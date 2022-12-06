import { sanitizeFileName } from "lib/utils";
import { existsSync, mkdirSync } from "node:fs";
import { PORT } from "server";
import { Chroma, Skin, WeaponData } from "types/weapon";
import { valApiGot } from "../endpoints";
import { State, StateWeapon } from "../state";
import { downloadFileTask, Task } from "./utils";

export async function warmupWeapons(
  patchDir: string,
  addTask: (task: Task) => void,
  asset: (path: string) => string,
  state?: State
) {
  const weaponsDir = patchDir + "/weapons";

  if (!existsSync(weaponsDir)) {
    mkdirSync(weaponsDir);
  }

  const client = valApiGot();
  const { data: weapons } = await client.get("weapons").json<WeaponData>();

  weapons.forEach((weapon) => {
    const weaponName = sanitizeFileName(weapon.displayName);
    const weaponPath = `${weaponsDir}/${weaponName}`;
    if (!existsSync(weaponPath)) {
      mkdirSync(weaponPath);
    }
    const killFeed = weapon.killStreamIcon;
    const icon = weapon.displayIcon;
    const shop = weapon.shopData?.newImage || weapon.shopData?.image || "";

    const killFeedPath = `${weaponPath}/killfeed.png`;
    const iconPath = `${weaponPath}/icon.png`;
    const shopPath = `${weaponPath}/shop.png`;

    const asset = (path: string) => {
      return `${state?.apiUrl || `http://localhost:${PORT}`}/static?path=${path}`;
    };

    if (icon) {
      addTask(downloadFileTask(icon, iconPath));
    }

    if (shop) {
      addTask(downloadFileTask(shop, shopPath));
    }

    if (killFeed) {
      addTask(downloadFileTask(killFeed, killFeedPath));
    }

    const skinsDir = `${weaponPath}/skins`;
    if (!existsSync(skinsDir)) {
      mkdirSync(skinsDir);
    }

    const includeSkins = process.env.INCLUDE_SKINS === "true";

    const skins: Map<string, Skin> = new Map();
    weapon.skins.forEach((skin) => {
      if (!includeSkins) {
        return skins.set(skin.uuid, skin);
      }

      const skinName = sanitizeFileName(skin.displayName);
      const skinDir = `${skinsDir}/${skinName}`;

      if (!existsSync(skinDir)) {
        mkdirSync(skinDir);
      }

      const skinIconPath = `${skinDir}/icon.png`;
      const wallpaperPath = `${skinDir}/wallpaper.png`;

      const wallpaper = skin.wallpaper;
      const icon = skin.displayIcon;

      if (icon) {
        addTask(downloadFileTask(icon, skinIconPath));
      }

      if (wallpaper) {
        addTask(downloadFileTask(wallpaper, wallpaperPath));
      }

      const newSkin: Skin = Object.assign(skin, {
        displayIcon: asset(skinIconPath),
        wallpaper: asset(wallpaperPath),
        chromas: skin.chromas.map((chroma) => {
          const chromaName = sanitizeFileName(chroma.displayName);
          const chromasDir = `${skinsDir}/chromas`;
          const chromaDir = `${chromasDir}/${chromaName}`;

          if (!existsSync(chromasDir)) {
            mkdirSync(chromasDir);
          }

          if (!existsSync(chromaDir)) {
            mkdirSync(chromaDir);
          }

          const iconPath = `${chromaDir}/icon.png`;
          const renderPath = `${chromaDir}/full_render.png`;

          const icon = chroma.displayIcon;
          const render = chroma.fullRender;

          if (icon) {
            addTask(downloadFileTask(icon, iconPath));
          }

          if (render) {
            addTask(downloadFileTask(render, renderPath));
          }

          // We're using Object.assign for a little bit of performance
          const newChroma = Object.assign<Chroma, Partial<Chroma>>(chroma, {
            displayIcon: asset(iconPath),
            fullRender: asset(render),
          });

          return newChroma;
        }),
      });

      skins.set(skin.uuid, newSkin);
    });

    const newWeapon: StateWeapon = {
      ...weapon,
      skins: new Map(weapon.skins.map((skin) => [skin.uuid, skin])),
      displayIcon: asset(iconPath),
      killStreamIcon: asset(killFeedPath),
      shopData: weapon.shopData ? { ...weapon.shopData, newImage: asset(shopPath) } : null,
    };

    state?.weapons.set(newWeapon.uuid, newWeapon);
  });
}
