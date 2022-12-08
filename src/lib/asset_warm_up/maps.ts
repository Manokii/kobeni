import { sanitizeFileName } from "lib/utils"
import { existsSync, mkdirSync } from "node:fs"
import { MapData } from "types/map"
import { valApiGot } from "../endpoints"
import { State } from "../state"
import { downloadFileTask, Task } from "./utils"

export async function warmupMaps(
  patchDir: string,
  addTask: (task: Task) => void,
  asset: (path: string) => string,
  state?: State
) {
  const mapsDir = patchDir + "/maps"

  if (!existsSync(mapsDir)) {
    mkdirSync(mapsDir)
  }

  const client = valApiGot()
  const { data: maps } = await client.get("maps").json<MapData>()

  maps.forEach((map) => {
    const mapName = sanitizeFileName(map.displayName)
    const MapDir = `${mapsDir}/${mapName}`
    if (!existsSync(MapDir)) {
      mkdirSync(MapDir)
    }

    const icon = map.displayIcon
    const listViewIcon = map.listViewIcon
    const splash = map.splash

    const iconPath = `${MapDir}/icon.png`
    const listViewIconPath = `${MapDir}/listViewIcon.png`
    const splashPath = `${MapDir}/splash.png`

    if (icon) {
      addTask(downloadFileTask(icon, iconPath))
    }

    if (listViewIcon) {
      addTask(downloadFileTask(listViewIcon, listViewIconPath))
    }

    if (splash) {
      addTask(downloadFileTask(splash, splashPath))
    }

    state?.maps.set(map.mapUrl, {
      ...map,
      displayIcon: asset(iconPath),
      listViewIcon: asset(listViewIconPath),
      splash: asset(splashPath),
    })
  })
}
