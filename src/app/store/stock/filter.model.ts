
export interface StockStateModel {
  stockElements: StockData[];
}
export interface StockData {
  date: string;
  openPrice: number;
  symbol: string;
}
export interface ChartData {
  chart: any;
  categories: any[];
  dataset: any[];
}