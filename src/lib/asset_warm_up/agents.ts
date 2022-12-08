import { existsSync, mkdirSync } from "node:fs"
import type { Agents } from "../../types/valorant_api"
import { valApiGot } from "../endpoints"
import type { State } from "../state"
import { downloadFileTask, Task } from "./utils"

export async function warmupAgents(
  patchDir: string,
  addTask: (task: Task) => void,
  asset: (path: string) => string,
  state?: State
) {
  const agentsDir = patchDir + "/agents"

  if (!existsSync(agentsDir)) {
    mkdirSync(agentsDir)
  }

  const client = valApiGot()
  const { data: agents } = await client.get("agents?isPlayableCharacter=true").json<Agents>()

  agents.forEach((agent) => {
    const agentName = agent.displayName.replace("/", "-")
    const agentPath = `${agentsDir}/${agentName}`
    if (!existsSync(agentPath)) {
      mkdirSync(agentPath)
    }
    const portrait = agent.fullPortraitV2 || agent.fullPortrait || agent.bustPortrait
    const voiceLine = agent.voiceLine.mediaList[0]?.wave
    const icon = agent.displayIcon
    const bg = agent.background
    const role = agent.role?.displayIcon

    const portraitPath = `${agentPath}/portrait.png`
    const iconPath = `${agentPath}/icon.png`
    const bgPath = `${agentPath}/bg.png`
    const voiceLinePath = `${agentPath}/voiceline.wav`
    const rolePath = `${agentPath}/role.png`

    if (portrait) {
      addTask(downloadFileTask(portrait, portraitPath))
    }

    if (icon) {
      addTask(downloadFileTask(icon, iconPath))
    }

    if (bg) {
      addTask(downloadFileTask(bg, bgPath))
    }

    if (voiceLine) {
      addTask(downloadFileTask(voiceLine, voiceLinePath))
    }

    if (role) {
      addTask(downloadFileTask(role, rolePath))
    }

    const abilitiesPath = `${agentPath}/abilities`
    if (!existsSync(abilitiesPath)) {
      mkdirSync(abilitiesPath)
    }
    agent.abilities.forEach((ability) => {
      const path = `${abilitiesPath}/${ability.slot}.png`
      const icon = ability.displayIcon
      if (icon) {
        addTask(downloadFileTask(ability.displayIcon || "", path))
      }
    })

    state?.agents.set(agent.uuid, {
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
        icon: rolePath,
        id: agent.role?.uuid || "",
        name: agent.role?.displayName || "",
      },
      voiceLine: {
        duration: agent.voiceLine.maxDuration,
        url: asset(voiceLinePath),
      },
    })
  })
}
