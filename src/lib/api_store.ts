import { Config } from "types/config";
import { VersionData } from "types/val_api";
import type { Lockfile } from "./get_lockfile";

export type Store = {
  lockfile: Lockfile | null;
  agents: Map<string, ApiAgent>;
  version: VersionData | null;
  status:
    | "AssetWarmUp"
    | "LookingForValorantEXE"
    | "WaitingForMatch"
    | "Ready"
    | "AgentSelect"
    | "Loading"
    | "Unknown";
  config: Config;
};

export interface ApiAgent {
  name: string;
  desc: string;
  devName: string;
  id: string;
  portrait: string;
  icon: string;
  bg: string;
  bgColors: string[];
  role: ApiRole;
  abilities: ApiAbility[];
  voiceLine: {
    duration: number;
    url: string;
  };
}

interface ApiAbility {
  slot: string;
  name: string;
  icon: string;
  desc: string;
}

export interface ApiRole {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

export const store: Store = {
  lockfile: null,
  agents: new Map(),
  status: "Unknown",
  config: { manualAgentSelect: false, pollingInterval: 1000 },
  version: null,
};
