import type { StateWeapon } from "lib/state"
import { apiAxios } from "../utils/axios"

export const getWeapons = async () => {
  const client = await apiAxios()
  const { data } = await client.get<Record<string, StateWeapon>>(`/weapons`)
  return data
}

export const getWeaponById = async (id: string) => {
  const client = await apiAxios()
  const { data } = await client.get<StateWeapon>(`/weapons/${id}`)
  return data
}
