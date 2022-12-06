import { Server } from "http";
import { address } from "ip";
import { Server as SocketIOServer } from "socket.io";
import { retryDecorator } from "ts-retry-promise";
import { Map as StateMap } from "types/map";
import { Skin, Weapon } from "types/weapon";
import { PORT } from "../server";
import type { Config } from "../types/config";
import type { Entitlement } from "../types/entitlement";
import type { VersionData } from "../types/valorant_api";
import { assetWarmUp } from "./asset_warm_up";
import { getLockfile, Lockfile } from "./get_lockfile";
import { getToken } from "./get_token";
import { getPlayer, getPregameMatch } from "./utils";

export interface StateAgent {
  name: string;
  desc: string;
  devName: string;
  id: string;
  portrait: string;
  icon: string;
  bg: string;
  bgColors: string[];
  role: StateRole;
  abilities: StateAbility[];
  voiceLine: {
    duration: number;
    url: string;
  };
}

interface StateAbility {
  slot: string;
  name: string;
  icon: string;
  desc: string;
}

export interface StateRole {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

export type StateStatus =
  | "AssetWarmUp"
  | "Initializing"
  | "LookingForLockfile"
  | "LookingForValorantExe"
  | "WaitingForMatch"
  | "Ready"
  | "AgentSelect"
  | "Loading"
  | "Unknown";

type Player = {
  puuid: string;
  characterId: string;
  status: string;
  agent: StateAgent | null;
};

export type StateWeapon = Omit<Weapon, "skins"> & {
  skins: Map<string, Skin>;
};

export class State {
  #isTickerOn = false;
  #initializing = false;
  #lockfile: Lockfile | null = null;
  #token: Entitlement | null = null;
  #httpServer: Server;
  #wsServer: SocketIOServer;
  #ticker: NodeJS.Timer | null = null;
  agents: Map<string, StateAgent> = new Map();
  maps: Map<string, StateMap> = new Map();
  weapons: Map<string, StateWeapon> = new Map();
  blue: Player[] = [];
  red: Player[] = [];
  version: VersionData | null = null;
  status: StateStatus = "Unknown";
  apiUrl: string;
  hostUrl: string;
  config: Config = {
    manualAgentSelect: false,
    pollingInterval: 1000,
  };
  matchId = "";

  constructor(server: Server) {
    this.hostUrl = `http://${address()}:${PORT}`;
    this.apiUrl = `${this.hostUrl}/api`;
    this.#httpServer = server;
    this.#wsServer = new SocketIOServer(server, { cors: { origin: "*" } });
  }

  setConfig(config: Partial<Config>) {
    this.config = { ...this.config, ...config };
  }

  async init(startTicker?: boolean) {
    this.#initializing = true;
    this.setStatus("Initializing");
    await assetWarmUp(this);

    if (!startTicker) return;

    const retries = "INFINITELY";
    const timeout = "INFINITELY";
    const delay = 3000;
    const until = (t: unknown) => !t || !this.#initializing;

    const getLockFileFn = retryDecorator(getLockfile, {
      delay,
      retries,
      timeout,
      until,
      logger() {
        console.log("🔑 Looking for lockfile, please open valorant...");
      },
    });

    const getTokenFn = retryDecorator(getToken, {
      delay,
      retries,
      timeout,
      until,
      logger() {
        console.log("🎮 Looking for valorant...");
      },
    });

    const env = await getLockFileFn();
    this.#lockfile = env || this.#lockfile;

    const entitlement = await getTokenFn(this.#lockfile);
    this.#token = entitlement || null;

    this.#initializing = false;
    this.setStatus("LookingForValorantExe");
  }

  setStatus(status: StateStatus) {
    this.status = status;
  }

  set(state: Partial<State>) {
    Object.assign(this, state);
  }

  async reset(options?: { init: true; startTicker?: boolean }) {
    this.stop();
    this.#initializing = false;

    const newState = new State(this.#httpServer);
    Object.assign(this, newState);

    if (!options?.init) {
      return this;
    }

    const { startTicker = true } = options;
    this.init(startTicker);

    return this;
  }

  start() {
    if (!this.#token) return;
    this.#isTickerOn = true;
    console.log("Ticker Started");

    this.#ticker = setInterval(async () => {
      /**
       * Check if all the prerequisite are correct
       * - It's not manual agent select
       * - Ticker is on
       * - Token is present
       */
      if (this.config.manualAgentSelect || !this.#isTickerOn || !this.#token) return;

      /**
       * If matchId is not present, try to get it
       */
      if (!this.matchId) {
        try {
          this.setStatus("WaitingForMatch");
          console.log("⏳ Checking for ongoing match");
          const data = await getPlayer(this.#token);
          this.matchId = data.MatchID || this.matchId;
        } catch {
          console.log("✖️ No match found.");
        }
      }

      await getPregameMatch(this.matchId, this.#token)
        .then((data) => {
          for (const team of data.Teams) {
            if (team.TeamID === "Blue") {
              this.blue = team.Players.map((player) => ({
                characterId: player.CharacterID,
                puuid: player.Subject,
                status: player.CharacterSelectionState,
                agent: this.agents.get(player.CharacterID) || null,
              }));
            }
            if (team.TeamID === "Red") {
              this.red = team.Players.map((player) => ({
                characterId: player.CharacterID,
                puuid: player.Subject,
                status: player.CharacterSelectionState,
                agent: this.agents.get(player.CharacterID) || null,
              }));
            }
          }
        })
        .catch();

      this.setStatus("AgentSelect");
      this.#wsServer.emit("agentSelect", {
        matchId: this.matchId,
        red: this.red,
        blue: this.blue,
      });
    }, this.config.pollingInterval);
  }

  stop() {
    this.#isTickerOn = false;
    if (!this.#ticker) return;
    clearInterval(this.#ticker);
    this.#ticker = null;
    console.log("Ticker Stopped");
  }

  sanitizeWeapon(weapon: StateWeapon) {
    return Object.assign(weapon, { skins: Object.fromEntries(weapon.skins) });
  }

  sanitizedWeapons() {
    const weaponEntries = Array.from(this.weapons.entries());
    const weapons = weaponEntries.map(([name, weapon]) => {
      return [name, this.sanitizeWeapon(weapon)];
    });

    return Object.fromEntries(weapons);
  }

  sanitizedAgents() {
    return Object.fromEntries(this.agents);
  }

  sanitizedMaps() {
    return Object.fromEntries(this.maps);
  }

  toJSON() {
    return {
      ...this,
      agents: this.sanitizedAgents(),
      weapons: this.sanitizedWeapons(),
      maps: this.sanitizedMaps(),
    };
  }
}
