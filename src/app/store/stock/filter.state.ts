import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StockService } from 'src/app/core/services/stock.service';
import { FetchStockData, UpdateChart } from './filter.actions';
import { tap } from 'rxjs';
import { ChartData, StockData, StockStateModel } from './filter.model';
@State<StockStateModel>({
  name: 'stock',
  defaults: {
    stockElements: [],
    chartData: {
      chart: {
        caption: "Mevcut Veri Yok",
        subcaption: "",
        theme: "fusion",
        type: "line"
      },
      categories: [{ category: [] }],
      dataset: []
    }

  }
})
@Injectable()
export class StockState {
  constructor(private stockService: StockService) { }
  @Selector()
  static stockElements(state: StockStateModel) {
    return state.stockElements;
  }
  @Selector()
  static chartData(state: StockStateModel) {
    return state.chartData;
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
          ...ctx.getState(),
          stockElements
        });
        const categories = [];
        const dataset = [];

        if (Object.keys(data).length === 0) {
          const chartData: ChartData = {
            chart: {
              caption: "No Data Available",
              subcaption: "",
              theme: "fusion",
              type: "line"
            },
            categories: [{ category: [] }],
            dataset: []
          };
          ctx.dispatch(new UpdateChart(chartData));
        } else {
          const symbols: string[] = Object.keys(data);
          const symbolData = data[symbols[0]]['Time Series (Daily)'];
          const dates = Object.keys(symbolData || {});
          const categoryLabels = dates.map(date => ({ label: date }));
          categories.push({ category: categoryLabels });
          for (const symbol of symbols) {
            const symbolData = data[symbol]['Time Series (Daily)'];
            const seriesData = dates.map(date => ({ value: symbolData[date]['4. close'] || 0 }));
            dataset.push({
              seriesname: symbol,
              data: seriesData
            });
          }
          const chartData: ChartData = {
            chart: {
              caption: "Hisse Senedi Değerleri ve Tarihleri",
              subcaption: "",
              yaxisname: "",
              theme: "fusion",
              type: "line"
            },
            categories: categories,
            dataset: dataset
          };
          ctx.dispatch(new UpdateChart(chartData));
        }
      })
     
    );
  }
  @Action(UpdateChart)
  updateChart(ctx: StateContext<StockStateModel>, { chartData }: UpdateChart) {
    ctx.patchState({
      chartData: chartData
    });
  }
}