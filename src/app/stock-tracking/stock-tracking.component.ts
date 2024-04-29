import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StockService } from 'src/app/core/stock/stock.service';
import { Select, Store } from '@ngxs/store';
import { StockChartComponent } from '../stock-chart/stock-chart.component';
import moment from 'moment';
interface StockElement {
  date: string;
  openPrice: number;
  symbol: string;
}
@Component({
  selector: 'vex-stock-tracking',
  templateUrl: './stock-tracking.component.html',
  styleUrls: ['./stock-tracking.component.scss'],
})
export class StockTrackingComponent implements OnInit {


  @ViewChild(StockChartComponent) stockChartComponent: StockChartComponent;

  filters: string[] = [];
  selectedStocks: string[] = [];
  stocks = ['IBM', 'AAPL', 'AMZN', 'GOOG', 'MSFT'];

  range = {
    start: null,
    end: null
  };
  filteredDataSource = new MatTableDataSource<StockElement>();

  constructor(private stockService: StockService, private store: Store) { }

  ngOnInit() {
  }
  filterData() {
    const startDate = moment(this.range.start);
    const endDate = moment(this.range.end);
    const selectedStocks = this.selectedStocks;
    // if (startDate && endDate && selectedStocks.length > 0) {
    //   this.store.dispatch(new StockDataAction(startDate)).subscribe((data) => {
    //     this.filteredDataSource.filter = '';
    //     this.filteredDataSource.filter = this.filteredDataSource.filter.trim().toLowerCase();
    //   })
    // } else {
    //   console.log('Please select a date range and at least one stock');
    // }
  }
  
}
