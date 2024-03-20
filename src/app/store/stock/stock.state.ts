import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { FilterData, UpdateChart, UpdateDateRange, UpdateFilteredStockData, UpdateStockData } from './stock.actions';

import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { StockService } from 'src/app/core/services/stock.service';

export interface StockElement {
  date: string;
  openPrice: number;
  symbol: string;
}

export interface StockStateModel {
  stocks: StockElement[];
  dateRange: { start: string | null, end: string | null };
  filteredStockData: StockElement[];
  chartData: any;
  selectedStocks: string[];
}

@Injectable()
@State<StockStateModel>({
  name: 'stocks',
  defaults: {
    stocks: [],
    dateRange: { start: null, end: null },
    filteredStockData: [],
    chartData: null,
    selectedStocks: [] // selectedStocks özelliğini ekliyoruz
  }
})
export class StockState {

  constructor(private stockService: StockService) {}

  @Action(UpdateStockData)
  updateStockData(ctx: StateContext<StockStateModel>, action: UpdateStockData) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      stocks: action.stockData
    });
  }

  @Action(UpdateDateRange)
  updateDateRange(ctx: StateContext<StockStateModel>, action: UpdateDateRange) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      dateRange: action.range
    });
  }

  @Action(UpdateFilteredStockData)
  updateFilteredStockData(ctx: StateContext<StockStateModel>, action: UpdateFilteredStockData) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      filteredStockData: action.data
    });
  }

  @Action(UpdateChart)
  updateChart(ctx: StateContext<StockStateModel>, action: UpdateChart) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      chartData: action.chartData
    });
  }
}
