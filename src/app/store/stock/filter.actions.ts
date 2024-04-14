

export class Filters{
  static readonly type = '[Filter] Set  Filters';
  constructor(public filters: string[]) {}
}
export class ApiResponse{
  static readonly type = '[Api] Set API Response';
  constructor(public response: string) {}
}