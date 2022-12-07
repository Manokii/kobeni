import got from "got";
import os from "node:os";
import type { Entitlement } from "../types/entitlement";

const region = "ap";

const getHeaders = (entitlement: Entitlement) => {
  const client = {
    platformType: "PC",
    platformOS: "Windows",
    platformOSVersion: os.release(),
    platformChipset: os.arch(),
  };
  const clientString = JSON.stringify(client);
  const clientBase64 = Buffer.from(clientString).toString("base64");
  return {
    Authorization: `Bearer ${entitlement.accessToken}`,
    "X-Riot-Entitlements-JWT": entitlement.token,
    "X-Riot-Client-Platform": clientBase64,
  };
};

export const getLocalGot = (port: string, entitlement: Entitlement) => {
  return got.extend({
    prefixUrl: `http://127.0.0.1:${port}`,
    headers: getHeaders(entitlement),
    responseType: `json`,
  });
};

export const getPdGot = (entitlement: Entitlement) => {
  return got.extend({
    prefixUrl: `https://pd.${region}-1.a.pvp.net`,
    headers: getHeaders(entitlement),
    responseType: "json",
  });
};

export const getGlzGot = (token: Entitlement) => {
  return got.extend({
    prefixUrl: `https://glz-${region}-1.${region}.a.pvp.net`,
    headers: getHeaders(token),
    responseType: "json",
  });
};

export const valApiGot = () => {
  return got.extend({
    prefixUrl: "https://valorant-api.com/v1",
    headers: { "content-type": "application/json" },
    responseType: "json",
  });
};

export const henrikApi = () => {
  return got.extend({
    prefixUrl: "https://api.henrikdev.xyz/valorant/v1",
    headers: { "content-type": "application/json" },
    responseType: "json",
  });
};
