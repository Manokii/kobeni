import { AccountData } from "types/account"
import { Entitlement } from "../types/entitlement"
import { ValPlayer } from "../types/match"
import { PregameResponse } from "../types/pregame"
import { getGlzGot, getPdGot, henrikApi, valApiGot } from "./endpoints"

export const getPlayer = async (token: Entitlement) => {
  const got = getGlzGot(token)
  const path = `pregame/v1/players/${token.subject}`
  return await got.get(path).json<ValPlayer>()
}

export const getAccountById = async (puuid: string) => {
  const got = henrikApi()
  const path = `by-puuid/account/${puuid}`
  const { data } = await got.get(path).json<AccountData>()
  return data
}

export const getAccountByNameTag = async (name: string, tag: string) => {
  const got = valApiGot()
  const path = `accounts/${name}/${tag}`
  return await got.get(path).json()
}

export const getMatch = async (matchId: string, token: Entitlement) => {
  const got = getPdGot(token)
  console.log("fetching match data...")
  const path = `match-details/v1/matches/${matchId}`
  return await got.get(path).json()
}

export const getPregameMatch = async (matchId: string, token: Entitlement) => {
  if (!matchId) throw new Error("No match id provided")
  const got = getGlzGot(token)
  const path = `pregame/v1/matches/${matchId}`
  return await got.get(path).json<PregameResponse>()
}

export const sanitizeFileName = (name: string) => {
  return name.replaceAll("\\r\\n", " ").replaceAll(/[^a-zA-Z0-9() -']/gi, "_")
}
