import cliProgress from "cli-progress";
import { existsSync, mkdirSync } from "node:fs";
import { PORT } from "server";
import type { Version } from "../../types/valorant_api";
import { valApiGot } from "../endpoints";
import type { State } from "../state";
import { warmupAgents } from "./agents";
import { warmupMaps } from "./maps";
import type { Task } from "./utils";
import { warmupWeapons } from "./weapons";

export const assetWarmUp = async (state?: State) => {
  const previousStatus = state?.status || "Unknown";
  state?.setStatus("AssetWarmUp");
  const client = valApiGot();

  const res = await client.get("version").json<Version>();
  const version = res?.data.version;
  state?.setState({ version: res?.data || state.version });
  const rootAssetDir = "./dist/assets";
  const patchDir = `${rootAssetDir}/${version}`;

  if (!existsSync(rootAssetDir)) {
    mkdirSync(rootAssetDir);
  }

  if (!existsSync(patchDir)) {
    mkdirSync(patchDir);
  }

  const tasks: Array<Task> = [];
  const addTask = (task: Task) => tasks.push(task);
  const asset = (path: string) => {
    return `${state?.apiUrl || `http://localhost:${PORT}`}/static?path=${path}`;
  };

  const args = [patchDir, addTask, asset, state] as const;
  await warmupAgents(...args);
  await warmupWeapons(...args);
  await warmupMaps(...args);

  const batchSize = 10;
  const format = "⬇️  Downloading [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}";
  const bar = new cliProgress.Bar({ format });

  bar.start(tasks.length, 0);

  for (let i = 0; i < tasks.length; i = i + batchSize) {
    const currentTasks = tasks.slice(i, i + batchSize);
    await Promise.all(currentTasks.map((task) => task()));
    bar.update(i + 1);
  }

  bar.stop();

  console.log(`✅ Downloading ${tasks.length} assets finished.`);
  state?.setStatus(previousStatus);
};
