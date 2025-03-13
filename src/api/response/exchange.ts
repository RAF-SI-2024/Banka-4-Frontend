export interface ExchangeDto {
  lastUpdatedISO8061withTimezone: string;
  lastUpdatedUnix: number;
  nextUpdateISO8061withTimezone: string;
  nextUpdateUnix: number;
  lastLocalUpdate: number;
  exchanges: exchange[];
}

export interface exchange {
  Base: string;
  Quote: string;
  Buy: number;
  Neutral: number;
  Sell: number;
}
