export interface ValPlayer {
  Subject: string
  MatchID: string
  Version: number
}

export interface CoreGameStats {
  MatchID: string
  Version: number
  State: string
  MapID: string
  ModeID: string
  ProvisioningFlow: string
  GamePodID: string
  AllMUCName: string
  TeamMUCName: string
  TeamVoiceID: string
  IsReconnectable: boolean
  ConnectionDetails: ConnectionDetails
  PostGameDetails: PostGameDetails
  Players: CoreGameStatsPlayer[]
  MatchmakingData: MatchmakingData
}

export interface ConnectionDetails {
  GameServerHosts: string[]
  GameServerHost: string
  GameServerPort: number
  GameServerObfuscatedIP: number
  GameClientHash: number
  PlayerKey: string
}

export interface MatchmakingData {
  QueueID: string
  IsRanked: boolean
}

export interface CoreGameStatsPlayer {
  Subject: string
  TeamID: TeamID
  CharacterID: string
  PlayerIdentity: PlayerIdentity
  SeasonalBadgeInfo: SeasonalBadgeInfo
  IsCoach: boolean
  IsAssociated: boolean
}

export interface PlayerIdentity {
  Subject: string
  PlayerCardID: string
  PlayerTitleID: string
  AccountLevel: number
  PreferredLevelBorderID: string
  Incognito: boolean
  HideAccountLevel: boolean
}

export interface SeasonalBadgeInfo {
  SeasonID: string
  NumberOfWins: number
  WinsByTier: null
  Rank: number
  LeaderboardRank: number
}

export enum TeamID {
  Blue = "Blue",
  Red = "Red",
}

export interface PostGameDetails {
  Start: string
  Players: PostGameDetailsPlayer[]
}

export interface PostGameDetailsPlayer {
  Subject: string
}
