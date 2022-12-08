export interface MapData {
  status: number
  data: ValMap[]
}

export interface ValMap {
  uuid: string
  displayName: string
  coordinates: string
  displayIcon: null | string
  listViewIcon: string
  splash: string
  assetPath: string
  mapUrl: string
  xMultiplier: number
  yMultiplier: number
  xScalarToAdd: number
  yScalarToAdd: number
  callouts: Callout[] | null
}

export interface Callout {
  regionName: string
  superRegionName: SuperRegionName
  location: Location
}

export interface Location {
  x: number
  y: number
}

export enum SuperRegionName {
  A = "A",
  AttackerSide = "Attacker Side",
  B = "B",
  C = "C",
  DefenderSide = "Defender Side",
  Mid = "Mid",
}
