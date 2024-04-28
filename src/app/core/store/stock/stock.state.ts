import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StockDataAction } from './stock.action';
import { StockService } from '../../stock/stock.service';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { StockData, StockDataRequestModel } from '../../stock/stock.model';
import { forkJoin } from 'rxjs';

export interface StockStateModel {
    loading: boolean;
    tableData: StockData[];
    chartData: StockData[];
}

@State<StockStateModel>({
    name: 'stockData',
    defaults: {
        loading: false,
        tableData: null,
        chartData: null
    }
})

@Injectable()
export class StockDataState {

    @Selector()
    static getLoading({ loading }: StockStateModel) {
        return loading;
    }

    @Selector()
    static getTableData({ tableData }: StockStateModel) {
        return tableData;
    }

    @Selector()
    static getChartData({ chartData }: StockStateModel) {
        return chartData;
    }

    constructor(
        private stockService: StockService
    ) { }

    @Action(StockDataAction)
    setStockData({ patchState }: StateContext<StockStateModel>, { payload }: StockDataAction) {

        patchState({
            loading: true,
            chartData: [],
            tableData: [],
        });

        this.stockService.getStockData(payload).subscribe(response => {

            const formatterData: StockData[] = [
                ...this.getServiceResponse(payload, response),
                ...this.getCacheResponse(payload, response)
            ];

            const cache = this.stockService.cacheRequestSubject.value;

            this.stockService.cacheRequestSubject.next([
                ...response,
                ...cache
            ]);

            patchState({
                loading: false,
                chartData: formatterData,
                tableData: formatterData,
            });
        });


    }

    private getCacheResponse(payload: StockDataRequestModel, response: any[]) {
        return this.stockService.cacheRequestSubject.value
            .filter(cache => payload.stocks.includes(cache['Meta Data']['2. Symbol'])
                && !response.map(res => res['Meta Data']['2. Symbol']).includes(cache['Meta Data']['2. Symbol']))
            .map(res => {
                return {
                    symbol: res['Meta Data']['2. Symbol'],
                    data: this.getData(res['Time Series (Daily)'], { startDate: payload.startDate, endDate: payload.endDate })
                };
            });
    }

    private getServiceResponse(payload: StockDataRequestModel, response: any[]) {
        return response.map(res => {
            return {
                symbol: res['Meta Data']['2. Symbol'],
                data: this.getData(res['Time Series (Daily)'], { startDate: payload.startDate, endDate: payload.endDate })
            };
        });
    }

    private getData(timeSeries, dates: { startDate: moment.Moment, endDate: moment.Moment }) {
        return Object.keys(timeSeries).filter(key => moment(key).isBetween(dates.startDate, dates.endDate, undefined, '[]'))
            .sort((a, b) => moment(a).isBefore(b) ? -1 : 1)
            .map(key => {
                return {
                    key,
                    value: timeSeries[key]['4. close']
                };
            });
    }

}