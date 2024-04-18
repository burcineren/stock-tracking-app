import { ChartData } from "./filter.model";


export class Filters {
  static readonly type = '[Filter] Set  Filters';
  constructor(public filters: string[]) {}
}
export class FetchStockData {
  static readonly type = '[Stock] Fetch Data';
  constructor(public startDate: string, public endDate: string, public selectedStocks: string[]) {}
}
export class UpdateChart {
  static readonly type = '[Stock] Update Chart';
  constructor(public chartData: ChartData) {}
}