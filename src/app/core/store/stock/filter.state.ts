import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StockService } from 'src/app/core/stock/stock.service';
import {  StockDataAction } from './filter.actions';
import { tap } from 'rxjs';
import { ChartData, StockData, StockStateModel } from './filter.model';
import { StockDataModel } from 'src/app/core/stock/stock.model';
@State<StockStateModel>({
  name: 'stock',
  defaults: {
    stockElements: [],

  }
})
@Injectable()
export class StockState {
  constructor(private stockService: StockService) { }
  @Selector()
  static stockElements(state: StockStateModel) {
    return state.stockElements;
  }
  

  @Action(StockDataAction)
  fetchStockData(ctx: StateContext<StockDataModel>, {payload}:StockDataAction) {
     this.stockService.getStockDataRequest(payload).subscribe(data => {});
    //  .pipe(
    //   tap(data => {
    //     const stockElements: StockData[] = [];
    //     const symbols: string[] = Object.keys(data);

    //     for (const symbol of symbols) {
    //       if (data[symbol] && data[symbol]['Time Series (Daily)'] && data[symbol]['Meta Data']) {
    //         const metaData = data[symbol]['Meta Data'];
    //         const timeSeries = data[symbol]['Time Series (Daily)'];
    //         const symbolName = metaData['2. Symbol'];

    //         for (const [date, values] of Object.entries(timeSeries)) {
    //           const openPrice = parseFloat(values['4. close']);
    //           stockElements.push({ date, openPrice, symbol: symbolName });
    //         }
    //       } else {
    //         console.error(`Time Series (Daily) data for stock ${symbol} is missing or undefined`);
    //       }
    //     }
    //     ctx.setState({
    //       ...ctx.getState(),
    //       stockElements
    //     });
    //     const categories = [];
    //     const dataset = [];

    //     if (Object.keys(data).length === 0) {
    //       const chartData: ChartData = {
    //         chart: {
    //           caption: "No Data Available",
    //           subcaption: "",
    //           theme: "fusion",
    //           type: "msline"
    //         },
    //         categories: [{ category: [] }],
    //         dataset: []
    //       };
    //       ctx.dispatch(new UpdateChart(chartData));
    //     } else {
    //       const symbols: string[] = Object.keys(data);
    //       const symbolData = data[symbols[0]]['Time Series (Daily)'];
    //       const dates = Object.keys(symbolData || {});
    //       const categoryLabels = dates.map(date => ({ label: date }));
    //       categories.push({ category: categoryLabels });
    //       for (const symbol of symbols) {
    //         const symbolData = data[symbol]['Time Series (Daily)'];
    //         const metaData = data[symbol]['Meta Data'];
    //         const symbolName = metaData['2. Symbol'];
    //         const seriesData = dates.map(date => ({ value: symbolData[date]['4. close'] || 0 }));
    //         dataset.push({
    //           seriesname: symbolName,
    //           data: seriesData
    //         });
    //       }
    //       const chartData: ChartData = {
    //         chart: {
    //           caption: "Hisse Senedi Değerleri ve Tarihleri",
    //           subcaption: "",
    //           yaxisname: "",
    //           theme: "fusion",
    //           type: "msline"
    //         },
    //         categories: categories,
    //         dataset: dataset
    //       };
    //       ctx.dispatch(new UpdateChart(chartData));
    //     }
    //   })

    // );
  }
  // @Action(UpdateChart)
  // updateChart(ctx: StateContext<StockStateModel>, { chartData }: UpdateChart) {
  //   ctx.patchState({
  //     chartData: chartData
  //   });
  // }
}