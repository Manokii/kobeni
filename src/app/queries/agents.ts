import type { StateAgent } from "lib/state"
import { apiAxios } from "../utils/axios"

export const getAgents = async () => {
  const client = await apiAxios()
  const { data } = await client.get<Record<string, StateAgent>>("/agents")
  return data
}

export const getAgentById = async (id: string) => {
  const client = await apiAxios()
  const { data } = await client.get<StateAgent>(`/agents/${id}`)
  return data
}
