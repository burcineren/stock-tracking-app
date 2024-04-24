import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StockDataAction } from './stock.action';
import { StockService } from '../../stock/stock.service';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { StockData } from '../../stock/stock.model';

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

            const formatterData: StockData[] = response.map(res => {
                return {
                    symbol: res['Meta Data']['2. Symbol'],
                    data: this.getData(res['Time Series (Daily)'], { startDate: payload.startDate, endDate: payload.endDate })
                };
            });

            patchState({
                loading: false,
                chartData: formatterData,
                tableData: formatterData,
            });
        });


    }

    private getData(timeSeries, dates: { startDate: moment.Moment, endDate: moment.Moment }) {
        return Object.keys(timeSeries).filter(key => moment(key).isBetween(dates.startDate, dates.endDate, undefined, '[]')).map(key => {
            return {
                key,
                value: timeSeries[key]['4. close']
            };
        });
    }

}