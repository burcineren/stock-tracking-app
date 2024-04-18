import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StockService } from 'src/app/core/services/stock.service';
import { Select, Store } from '@ngxs/store';
import { StockChartComponent } from './stock-chart/stock-chart.component';
import { Observable } from 'rxjs';
import { FetchStockData, Filters } from 'src/app/store/stock/filter.actions';
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
  @Select(state => state.zoo.animals) animals$: Observable<string[]>;


  @ViewChild(StockChartComponent) stockChartComponent: StockChartComponent;

  newAnimal: string = '';
  filters: string[] = [];
  selectedStocks: string[] = [];
  stocks = ['IBM', 'AAPL', 'AMZN', 'GOOG', 'MSFT'];
  width = '100%';
  height = '400';
  type = 'msline';
  dataFormat = 'json';
  chartDataSource = {
    chart: {
      showHoverEffect: "1",
      drawCrossLine: "1",
      theme: "fusion",
    },
    categories: [
      {
        category: [],
      },
    ],
    dataset: [],
  };
  range = {
    start: null,
    end: null
  };
  filteredDataSource = new MatTableDataSource<StockElement>();

  constructor(private stockService: StockService, private store: Store) { }

  ngOnInit(): void {
  }
  filter(filters: string[]) {
    this.store.dispatch(new Filters(filters))
    console.log(this.store.dispatch(new Filters(filters)))
  }

  filterData() {
    const startDate = this.formatDate(this.range.start);
    const endDate = this.formatDate(this.range.end);
    const selectedStocks = this.selectedStocks;
    if (startDate && endDate && selectedStocks.length > 0) {
      this.store.dispatch(new FetchStockData(startDate, endDate, selectedStocks)).subscribe((data) => {
        this.filteredDataSource.filter = '';
        this.filteredDataSource.filter = this.filteredDataSource.filter.trim().toLowerCase();
      })
    } else {
      console.log('Please select a date range and at least one stock');
    }
  }
  formatDate(date: string | null): string | null {
    if (!date) {
      return null;
    }
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    return `${day}-${month}-${dateObj.getFullYear()}`;
  }
}
