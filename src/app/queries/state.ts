import type { State } from "lib/state"
import { apiAxios } from "../utils/axios"

export const getState = async () => {
  const client = await apiAxios()
  const { data } = await client.get<ReturnType<State["toJSON"]>>("/")
  return data
}

export const getStatus = async () => {
  const client = await apiAxios()
  const { data } = await client.get<Pick<State, "status" | "version">>("/status")
  return data
}

export const getAgentSelect = async () => {
  const client = await apiAxios()
  const { data } = await client.get<ReturnType<State["getAgentSelect"]>>("/agentSelect")
  return data
}

export const resetState = async () => {
  const client = await apiAxios()
  const { data } = await client.post<{ message: string; success: boolean }>("/reset")
  return data
}
