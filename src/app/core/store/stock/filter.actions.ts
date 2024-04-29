import { StockDataModel } from "src/app/core/stock/stock.model";

export class StockDataAction {
  static readonly type = '[StockData] Action';
  constructor(public payload: StockDataModel) {}
}