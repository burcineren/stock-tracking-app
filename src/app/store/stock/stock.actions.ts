

import { StockElement } from './stock.model';

export class FilterData {
  static readonly type = '[Stock] Filter Data';
  constructor(public selectedStocks: string[]) {} // selectedStocks parametresi ekleniyor
}

export class UpdateStockData {
  static readonly type = '[Stock] Update Stock Data';
  constructor(public stockData: StockElement[]) {}
}

export class UpdateDateRange {
  static readonly type = '[Stock] Update Date Range';
  constructor(public range: { start: string | null, end: string | null }) {}
}

export class UpdateFilteredStockData {
  static readonly type = '[Stock] Update Filtered Stock Data';
  constructor(public data: StockElement[]) {}
}

export class UpdateChart {
  static readonly type = '[Stock] Update Chart';
  constructor(public chartData: any) {}
}
