import type { ValMap } from "types/map"
import { apiAxios } from "../utils/axios"

export const getMaps = async () => {
  const client = await apiAxios()
  const { data } = await client.get<Record<string, ValMap>>("/maps")
  return data
}

export const getMapById = async (id: string) => {
  const client = await apiAxios()
  const { data } = await client.get<ValMap>(`/maps/${id}`)
  return data
}
