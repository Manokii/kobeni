export interface AccountData {
  status: number;
  data: Account;
}

export interface Account {
  puuid: string;
  region: string;
  account_level: number;
  name: string;
  tag: string;
  card: Card;
  last_update: string;
  last_update_raw: number;
}

export interface Card {
  small: string;
  large: string;
  wide: string;
  id: string;
}
