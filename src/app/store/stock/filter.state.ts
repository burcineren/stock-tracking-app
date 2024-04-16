import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, createSelector } from '@ngxs/store';
import { StockService } from 'src/app/core/services/stock.service';
// import { FilterStateModel, StockStateModel } from './filter.model';
import { FetchStockData, Filters } from './filter.actions';
import { tap } from 'rxjs';

export interface StockData {
  date: string;
  openPrice: number;
  symbol: string;
}
export interface StockStateModel {
  stockElements: StockData[];
}


@State<StockStateModel>({
  name: 'stock',
  defaults: {
    stockElements: []
  }
})
@Injectable()
export class StockState {
  constructor(private stockService: StockService) { }
  @Selector()
  static stockElements(state: StockStateModel) {
    return state.stockElements;
  }
  static filteredStockElements(startDate: Date, endDate: Date, selectedStocks: string[]) {
    return createSelector([StockState], (state: StockStateModel) => {
    });
  }
  @Action(FetchStockData)
  fetchStockData(ctx: StateContext<StockStateModel>, { startDate, endDate, selectedStocks }: FetchStockData) {
    return this.stockService.getDailyTimeSeries(selectedStocks, startDate, endDate).pipe(
      tap(data => {
        const stockElements: StockData[] = [];
        const symbols: string[] = Object.keys(data);

        for (const symbol of symbols) {
          if (data[symbol] && data[symbol]['Time Series (Daily)'] && data[symbol]['Meta Data']) {
            const metaData = data[symbol]['Meta Data'];
            const timeSeries = data[symbol]['Time Series (Daily)'];
            const symbolName = metaData['2. Symbol'];

            for (const [date, values] of Object.entries(timeSeries)) {
              const openPrice = parseFloat(values['4. close']);
              stockElements.push({ date, openPrice, symbol: symbolName });
            }
          } else {
            console.error(`Time Series (Daily) data for stock ${symbol} is missing or undefined`);
          }
        }
        ctx.setState({
          stockElements
        });
      })
    );
  }
}