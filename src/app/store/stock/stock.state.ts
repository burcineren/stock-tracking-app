// stock.state.ts

import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { StockService } from 'src/app/core/services/stock.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LoadStockData, LoadStockSymbols, SetEndDate, SetFilteredStocks, SetStartDate, SetStocks } from './stoct.actions';
import { StockElement } from './stoct.model';

@Injectable()
@State<{
  stocks: StockElement[],
  filteredStocks: StockElement[],
  startDate: string | null,
  endDate: string | null
}>({
  name: 'stock',
  defaults: {
    stocks: [],
    filteredStocks: [],
    startDate: null,
    endDate: null,
  },
})
export class StockState {

  constructor(private stockService: StockService) {}

  @Action(LoadStockData)
  loadStocks(ctx: StateContext<any>, action: LoadStockData) {
    const state = ctx.getState();
    const { startDate, endDate } = state;
    const selectedStocks = ['IBM', 'AAPL', 'AMZN', 'GOOG', 'MSFT']; // Örnek olarak seçili hisse senedi sembolleri

    if (startDate && endDate && selectedStocks) {
      return this.stockService.getDailyTimeSeries(selectedStocks, startDate, endDate).pipe(
        tap((data: any) => {
          const stockElements: StockElement[] = [];
          // Veri işleme işlemleri burada gerçekleştirilir
          // Örneğin, API'den gelen veriyi StockElement nesnelerine dönüştürme
          for (const symbol of selectedStocks) {
            if (data[symbol] && data[symbol]['Time Series (Daily)'] && data[symbol]['Meta Data']) {
              const metaData = data[symbol]['Meta Data'];
              const timeSeries = data[symbol]['Time Series (Daily)'];

              for (const [date, values] of Object.entries(timeSeries)) {
                stockElements.push({
                  symbol: symbol,
                  name: metaData['2. Symbol'],
                  openPrice: parseFloat(values['1. open']),
                  high: parseFloat(values['2. high']),
                  low: parseFloat(values['3. low']),
                  close: parseFloat(values['4. close']),
                  volume: parseInt(values['5. volume']),
                  date: date
                });
              }
            } else {
              console.error(`Time Series (Daily) data for stock ${symbol} is missing or undefined`);
            }
          }
          ctx.dispatch(new SetStocks(stockElements)); // StockElement nesnelerini güncelleyin
        })
      );
    } else {
      console.log('Please select a date range and at least one stock');
      return null;
    }
  }

  @Action(SetStocks)
  setStocks(ctx: StateContext<any>, action: SetStocks) {
    ctx.patchState({
      stocks: action.stocks,
    });
  }

  @Action(SetFilteredStocks)
  setFilteredStocks(ctx: StateContext<any>, action: SetFilteredStocks) {
    ctx.patchState({
      filteredStocks: action.filteredStocks,
    }); 
  }
  @Action(LoadStockSymbols)
  loadStockSymbols(ctx: StateContext<any>, action: LoadStockSymbols) {
    const staticSymbols: string[] = ['AAPL', 'GOOG', 'MSFT', 'AMZN', 'IBM']; // Define your static stock symbols here

    ctx.patchState({
      symbols: staticSymbols
    });
  }

  @Action(LoadStockData)
  loadStockData(ctx: StateContext<any>, action: LoadStockData) {
    const state = ctx.getState();
    const { symbols } = state;

    // Now load data for these symbols
    // Implement your data loading logic here
  }

  @Action(SetStartDate)
  setStartDate(ctx: StateContext<any>, action: SetStartDate) {
    ctx.patchState({
      startDate: action.startDate,
    });
  }

  @Action(SetEndDate)
  setEndDate(ctx: StateContext<any>, action: SetEndDate) {
    ctx.patchState({
      endDate: action.endDate,
    });
  }

  @Selector()
  static getStocks(state: any) {
    return state.stock.stocks;
  }

  @Selector()
  static getFilteredStocks(state: any) {
    return state.stock.filteredStocks;
  }
  
}
