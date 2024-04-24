import { StockDataRequestModel } from "../../stock/stock.model";

export class StockDataAction {
    public static readonly type = '[StockData] Action';

    constructor(public payload: StockDataRequestModel) { }

}
