import { StockDataModel } from "src/app/core/stock/stock.model";
import { ChartData } from "./filter.model";


export class Filters {
  static readonly type = '[Filter] Set  Filters';
  constructor(public filters: string[]) {}
}
export class StockDataAction {
  static readonly type = '[StockData] Action';
  constructor(public payload: StockDataModel) {}
}