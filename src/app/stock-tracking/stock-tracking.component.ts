import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { StockService } from 'src/app/core/stock/stock.service';
import {  Store } from '@ngxs/store';
import moment from 'moment';
import { StockDataAction } from '../core/store/stock/stock.actions';
interface StockElement {
  date: string;
  openPrice: number;
}
@Component({
  selector: 'vex-stock-tracking',
  templateUrl: './stock-tracking.component.html',
  styleUrls: ['./stock-tracking.component.scss'],
})
export class StockTrackingComponent implements OnInit {


  stocks = ['IBM', 'AAPL', 'AMZN', 'GOOG', 'MSFT'];

  
  selectedStocks: string[] = [];

  range = {
    start: null,
    end: null
  };


  constructor(private stockService: StockService, private store: Store) { }

  ngOnInit() {
  }
  
  filterData() {
    const selectedStocks = this.selectedStocks;

    // if (startDate && endDate && selectedStocks.length > 0) {
    //   this.store.dispatch(new StockDataAction(startDate)).subscribe((data) => {
    //     this.filteredDataSource.filter = '';
    //     this.filteredDataSource.filter = this.filteredDataSource.filter.trim().toLowerCase();
    //   })
    // } else {
    //   console.log('Please select a date range and at least one stock');
    // }
    this.store.dispatch(new StockDataAction({
      stocks: selectedStocks,
      startDate: moment(this.range.start),
      endDate: moment(this.range.end)
    }));
    
  }
 
}
