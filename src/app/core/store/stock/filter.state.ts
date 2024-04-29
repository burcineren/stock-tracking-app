import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StockService } from 'src/app/core/stock/stock.service';
import {  StockDataAction } from './filter.actions';
import { StockData, StockDataModel } from 'src/app/core/stock/stock.model';

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
  static gatTableData({tableData}: StockStateModel) {
    return tableData;
  }
  
  @Selector()
  static gatChartData({chartData}: StockStateModel) {
    return chartData;
  }

  @Action(StockDataAction)
  fetchStockData({patchState}: StateContext<StockStateModel>, {payload}:StockDataAction) {
     this.stockService.getStockDataRequest(payload).subscribe(data => {
     
     patchState({
        tableData: [],
        chartData: []
      })
      return;
     });
 
  }
}