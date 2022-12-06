import axios from "axios";
import https from "node:https";
import { Entitlement } from "../types/entitlement";
import { Env } from "../types/env";

export const getToken = async (env: Env) => {
  const headers = { Authorization: env.auth };
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  const path = `https://${env.basePath}/entitlements/v1/token`;
  const res = await axios.get<Entitlement>(path, { headers, httpsAgent });
  return res.data;
};
