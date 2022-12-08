import { Server } from "http"
import { address } from "ip"
import { Server as SocketIOServer } from "socket.io"
import { retryDecorator } from "ts-retry-promise"
import type { Account } from "types/account"
import type { Config } from "types/config"
import type { Entitlement } from "types/entitlement"
import type { ValMap } from "types/map"
import type { Player } from "types/pregame"
import type { VersionData } from "types/valorant_api"
import type { Skin, Weapon } from "types/weapon"
import { PORT } from "../server"
import { assetWarmUp } from "./asset_warm_up"
import { getLockfile, Lockfile } from "./get_lockfile"
import { getToken } from "./get_token"
import { getAccountById, getPlayer, getPregameMatch } from "./utils"

export interface StateAgent {
  name: string
  desc: string
  devName: string
  id: string
  portrait: string
  icon: string
  bg: string
  bgColors: string[]
  role: StateRole
  abilities: StateAbility[]
  voiceLine: { duration: number; url: string }
}

export interface StateAbility {
  slot: string
  name: string
  icon: string
  desc: string
}

export interface StateRole {
  id: string
  name: string
  desc: string
  icon: string
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
  | "Unknown"

export type StatePlayer = {
  puuid: string
  characterId: string
  status: string
  name: string
  tag: string
  agent: StateAgent | null
}

export type StateWeapon = Omit<Weapon, "skins"> & {
  skins: Map<string, Skin>
}

export class State {
  #isTickerOn = false
  #lockfile: Lockfile | null = null
  #token: Entitlement | null = null
  #httpServer: Server
  #wsServer: SocketIOServer
  #ticker: NodeJS.Timer | null = null

  agents: Map<string, StateAgent> = new Map()
  maps: Map<string, ValMap> = new Map()
  weapons: Map<string, StateWeapon> = new Map()
  accounts: Map<string, Account> = new Map()

  blue: StatePlayer[] = []
  red: StatePlayer[] = []
  mapId = ""
  version: VersionData | null = null
  status: StateStatus = "Unknown"
  apiUrl: string
  hostUrl: string
  matchId = ""
  config: Config = { manualAgentSelect: false, pollingInterval: 1000 }

  constructor(server: Server) {
    this.hostUrl = `http://${address()}:${PORT}`
    this.apiUrl = `${this.hostUrl}/api`
    this.#httpServer = server
    this.#wsServer = new SocketIOServer(server, { cors: { origin: "*" } })
    this.#wsServer.on("connect", (socket) => {
      socket.emit("agentSelect", {
        matchId: this.matchId,
        red: this.red,
        blue: this.blue,
        map: this.maps.get(this.mapId) || null,
      })
    })
  }

  setConfig(config: Partial<Config>) {
    this.config = { ...this.config, ...config }
  }

  async assetWarmUp() {
    await assetWarmUp(this)
    return this
  }

  async init(startTicker?: boolean) {
    this.setStatus("Initializing")
    await this.assetWarmUp()

    if (!startTicker) return

    const retries = "INFINITELY"
    const timeout = "INFINITELY"
    const delay = 3000

    const getLockFileFn = retryDecorator(getLockfile, {
      delay,
      retries,
      timeout,
      logger() {
        console.log("🔑 Looking for lockfile, please open valorant...")
      },
    })

    const getTokenFn = retryDecorator(getToken, {
      delay,
      retries,
      timeout,
      logger() {
        console.log("🎮 Looking for valorant...")
      },
    })

    const env = await getLockFileFn()
    this.#lockfile = env || this.#lockfile

    const entitlement = await getTokenFn(this.#lockfile)
    this.#token = entitlement || null

    this.setStatus("LookingForValorantExe")
    this.start()
  }

  setStatus(status: StateStatus) {
    this.status = status
  }

  setState(state: Partial<State>) {
    Object.assign(this, state)
  }

  async reset(options?: { init: true; startTicker?: boolean }) {
    this.stop()

    const newState = new State(this.#httpServer)
    Object.assign(this, newState)

    if (!options?.init) {
      return this
    }

    const { startTicker = true } = options
    this.init(startTicker)

    return this
  }

  start() {
    if (!this.#token) {
      return console.log("No token found")
    }

    this.#isTickerOn = true
    console.log("Ticker Started")

    this.#ticker = setInterval(async () => {
      if (this.config.manualAgentSelect || !this.#isTickerOn || !this.#token) return

      if (!this.matchId) {
        try {
          this.setStatus("WaitingForMatch")
          console.log("⏳ Waiting for match start")
          const data = await getPlayer(this.#token)
          this.setState({ matchId: data.MatchID || this.matchId })
        } catch {
          return
        }
      }

      const mapPlayer = (player: Player): StatePlayer => {
        const account = this.accounts.get(player.Subject)
        if (!account) {
          getAccountById(player.Subject)
            .then((acc) => this.accounts.set(player.Subject, acc))
            .catch()
        }

        return {
          characterId: player.CharacterID,
          puuid: player.Subject,
          name: this.accounts.get(player.Subject)?.name || "",
          tag: this.accounts.get(player.Subject)?.tag || "",
          status: player.CharacterSelectionState,
          agent: this.agents.get(player.CharacterID.toLowerCase()) || null,
        }
      }

      try {
        const pregame = await getPregameMatch(this.matchId, this.#token)
        this.setState({ mapId: pregame.MapID || this.mapId })
        for (const team of pregame.Teams) {
          if (team.TeamID === "Blue") this.blue = team.Players.map(mapPlayer)
          if (team.TeamID === "Red") this.red = team.Players.map(mapPlayer)
        }
      } catch {
        this.setState({ matchId: "" })
        return
      }

      this.setStatus("AgentSelect")
      this.#wsServer.emit("agentSelect", {
        matchId: this.matchId,
        red: this.red,
        blue: this.blue,
        map: this.maps.get(this.mapId) || null,
      })
      this.#wsServer.emit("agentSelect", this)
    }, this.config.pollingInterval)
  }

  stop() {
    this.#isTickerOn = false
    if (!this.#ticker) return
    clearInterval(this.#ticker)
    this.#ticker = null
    console.log("Ticker Stopped")
  }

  sanitizeWeapon(weapon: StateWeapon) {
    return Object.assign(weapon, { skins: Object.fromEntries(Object.entries(weapon.skins)) })
  }

  sanitizedWeapons() {
    const weaponEntries = Array.from(this.weapons.entries())
    const weapons = weaponEntries.map(([name, weapon]) => {
      return [name, this.sanitizeWeapon(weapon)]
    })

    return Object.fromEntries(weapons)
  }

  sanitizedAgents() {
    return Object.fromEntries(this.agents)
  }

  sanitizedMaps() {
    return Object.fromEntries(this.maps)
  }

  toJSON() {
    return {
      ...this,
      agents: this.sanitizedAgents(),
      weapons: this.sanitizedWeapons(),
      maps: this.sanitizedMaps(),
    }
  }
}
