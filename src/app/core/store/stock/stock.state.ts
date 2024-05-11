import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StockService } from 'src/app/core/stock/stock.service';
import { StockDataAction } from './stock.actions';
import { StockData } from 'src/app/core/stock/stock.model';
import moment from 'moment';

export interface StockStateModel {
    tableData: StockData[];
    chartData: StockData[];
}
@State<StockStateModel>({
    name: 'stock',
    defaults: {
        tableData: null,
        chartData: null
    }
})
@Injectable()
export class StockState {
    constructor(private stockService: StockService) { }
    @Selector()
    static gatTableData({ tableData }: StockStateModel) {
        return tableData;
    }

    @Selector()
    static getChartData({ chartData }: StockStateModel) {
        return chartData;
    }

    @Action(StockDataAction)
    fetchStockData({ patchState }: StateContext<StockStateModel>, { payload }: StockDataAction) {
        patchState({
            tableData: [],
            chartData: []
        });
        this.stockService.getStockDataRequest(payload).subscribe(response => {

            const formatData = response.map((res) => {
                const symbol = res['Meta Data']['2. Symbol'];

                return {
                    symbol: res['Meta Data']['2. Symbol'],
                    data: this.getStockData(res['Time Series (Daily)'], { startDate: payload.startDate, endDate: payload.endDate })
                }

            })

            patchState({
                tableData: formatData,
                chartData: formatData,
            });
        });

    }
    private getStockData(timeSeries, dates: { startDate: moment.Moment, endDate: moment.Moment }) {
        return Object.keys(timeSeries).filter((key) => moment(key).isBetween(dates.startDate, dates.endDate, undefined, '[]')).map((key) => {
            return {
                key: key,
                value: timeSeries[key]['4. close']
            }
        })
    }
}