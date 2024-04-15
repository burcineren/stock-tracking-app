

export class Filters {
  static readonly type = '[Filter] Set  Filters';
  constructor(public filters: string[]) {}
}
export class ApiResponse {
  static readonly type = '[Api] Set API Response';
  constructor(public response: string) {}
}

export class FetchStockData {
  static readonly type = '[Stock] Fetch Data';
  constructor(public startDate: string, public endDate: string, public selectedStocks: string[]) {}
}