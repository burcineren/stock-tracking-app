import { StockElement } from "./stoct.model";


// stock.actions.ts

export class LoadStockData {
  static readonly type = '[Stock] Load Stocks';
}

export class SetStocks {
  static readonly type = '[Stock] Set Stocks';
  constructor(public stocks: StockElement[]) {} // Modeli kullan
}

export class SetFilteredStocks {
  static readonly type = '[Stock] Set Filtered Stocks';
  constructor(public filteredStocks: StockElement[]) {} // Modeli kullan
}

export class SetStartDate {
  static readonly type = '[Stock] Set Start Date';
  constructor(public startDate: string | null) {}
}

export class SetEndDate {
  static readonly type = '[Stock] Set End Date';
  constructor(public endDate: string | null) {}
}
export class LoadStockSymbols {
  static readonly type = '[Stock] Load Stock Symbols';
}