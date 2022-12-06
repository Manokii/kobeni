import { createWriteStream, existsSync } from "fs";
import needle from "needle";

export const downloadFileTask = (url: string, path: string) => (): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    if (existsSync(path)) {
      // console.log(`📄 File exists: ${path}`);
      return resolve();
    }
    needle("get", url, { openTimeout: 0 })
      .then((res) => {
        try {
          const out = createWriteStream(path, { flags: "w" });
          out.write(res.raw);
          out.close();
        } catch {
          reject("unable to write file");
        }
        resolve();
      })
      .catch((err) => {
        console.log("unable to get file", url, err);
        reject(err);
      });
  });

export type Task = ReturnType<typeof downloadFileTask>;
