import fs from "node:fs";
import { Env } from "../types/env";

export const getLockfile = async (): Promise<Env> => {
  const path = `${process.env.LOCALAPPDATA}\\Riot Games\\Riot Client\\Config\\lockfile`;
  const lockfile = fs.readFileSync(path, { encoding: "utf8" });
  const [client, PID, port, password, protocol] = lockfile.split(":");
  const raw = { client, PID, port, password, protocol };
  const base64 = Buffer.from(`riot:${password}`).toString("base64");
  return { raw, auth: `Basic ${base64}`, basePath: `127.0.0.1:${port}` };
};

export type Lockfile = ReturnType<typeof getLockfile>;
