export interface CeremonyData {
  status: number
  data: Datum[]
}

export interface Datum {
  uuid: string
  displayName: string
  assetPath: string
}
