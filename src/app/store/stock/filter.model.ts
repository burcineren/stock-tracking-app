export interface FilterStateModel {
  filters: string[];
  apiResponse?: any;
}

export interface StockElement {
  date: string;
  openPrice: number;
  symbol: string;
}