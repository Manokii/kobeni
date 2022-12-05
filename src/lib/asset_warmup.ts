import cliProgress from "cli-progress";
import needle from "needle";
import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import type { Agents, Version } from "../types/val_api";
import { valApiGot } from "./axios_instance";
import type { State } from "./state";

const downloadFileTask = (url: string, path: string) => (): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    if (existsSync(path)) {
      console.log(`📄 File exists: ${path}`);
      return resolve();
    }
    needle("get", url, { openTimeout: 0 })
      .then((res) => {
        const out = createWriteStream(path, { flags: "w" });
        out.write(res.raw);
        out.close();
        resolve();
      })
      .catch((err) => reject(err));
  });

export const assetWarmUp = async (state: State) => {
  const previousStatus = state.status;
  state.setStatus("AssetWarmUp");
  const client = valApiGot();

  const res = await client.get("version").json<Version>();
  const version = res?.data.version;
  state.version = res?.data || state.version;
  const rootAssetFolder = "./dist/assets";
  const patchFolder = `${rootAssetFolder}/${version}`;
  const patchFolderAgent = patchFolder + "/agents";

  if (!existsSync(rootAssetFolder)) {
    mkdirSync(rootAssetFolder);
  }

  if (!existsSync(patchFolder)) {
    mkdirSync(patchFolder);
  }

  if (!existsSync(patchFolderAgent)) {
    mkdirSync(patchFolderAgent);
  }

  const tasks: Array<() => Promise<void>> = [];
  const { data: agents } = await client.get("agents?isPlayableCharacter=true").json<Agents>();
  agents.forEach((agent) => {
    const agentName = agent.displayName.replace("/", "-");
    const agentPath = `${patchFolderAgent}/${agentName}`;
    if (!existsSync(agentPath)) {
      mkdirSync(agentPath);
    }
    const portrait = agent.fullPortraitV2 || agent.fullPortrait || agent.bustPortrait;
    const voiceLine = agent.voiceLine.mediaList[0]?.wave;
    const icon = agent.displayIcon;
    const bg = agent.background;
    const portraitPath = `${agentPath}/portrait.png`;
    const iconPath = `${agentPath}/icon.png`;
    const bgPath = `${agentPath}/bg.png`;
    const voiceLinePath = `${agentPath}/voiceline.wav`;

    const asset = (path: string) => `${state.apiUrl}/static?path=${path}`;

    if (portrait) {
      tasks.push(downloadFileTask(portrait, portraitPath));
    }

    if (icon) {
      tasks.push(downloadFileTask(icon, iconPath));
    }

    if (bg) {
      tasks.push(downloadFileTask(bg, bgPath));
    }

    if (voiceLine) {
      tasks.push(downloadFileTask(voiceLine, voiceLinePath));
    }

    const abilitiesPath = `${agentPath}/abilities`;
    if (!existsSync(abilitiesPath)) {
      mkdirSync(abilitiesPath);
    }
    agent.abilities.forEach((ability) => {
      const path = `${abilitiesPath}/${ability.slot}.png`;
      const icon = ability.displayIcon;
      if (icon) {
        tasks.push(downloadFileTask(ability.displayIcon || "", path));
      }
    });

    state.agents.set(agent.uuid, {
      abilities: agent.abilities.map((a) => ({
        desc: a.description,
        icon: asset(`${abilitiesPath}/${a.slot}.png`),
        name: a.displayName,
        slot: a.slot,
      })),
      bg: asset(bgPath),
      bgColors: agent.backgroundGradientColors,
      desc: agent.description,
      devName: agent.developerName,
      icon: asset(iconPath),
      id: agent.uuid,
      name: agent.displayName,
      portrait: asset(portraitPath),
      role: {
        desc: agent.role?.description || "",
        icon: agent.role?.displayIcon || "",
        id: agent.role?.uuid || "",
        name: agent.role?.displayName || "",
      },
      voiceLine: {
        duration: agent.voiceLine.maxDuration,
        url: asset(voiceLinePath),
      },
    });
  });

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
  state.setStatus(previousStatus);
};
