import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StockService } from 'src/app/core/services/stock.service';
import { Store } from '@ngxs/store';
import { StockChartComponent } from './stock-chart/stock-chart.component';
import { FetchStockData, Filters } from 'src/app/store/stock/filter.actions';
import { StockDataAction } from 'src/app/core/store/stock/stock.action';
import moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  form: FormGroup;

  constructor(
    private stockService: StockService,
    private store: Store,
    private formBuilder: FormBuilder
  ) {

    this.form = this.formBuilder.group({
      stocks: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
    });

  }

  ngOnInit(): void {
  }
  filter(filters: string[]) {
    this.store.dispatch(new Filters(filters))
    console.log(this.store.dispatch(new Filters(filters)))
  }

  filterData() {

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    // const startDate = this.formatDate(this.range.start);
    // const endDate = this.formatDate(this.range.end);
    // const selectedStocks = this.selectedStocks;
    // if (startDate && endDate && selectedStocks.length > 0) {
    //   this.store.dispatch(new FetchStockData(startDate, endDate, selectedStocks)).subscribe((data) => {
    //     this.filteredDataSource.filter = '';
    //     this.filteredDataSource.filter = this.filteredDataSource.filter.trim().toLowerCase();
    //   })
    // } else {
    //   console.log('Please select a date range and at least one stock');
    // }

    const stocks = this.form.get('stocks').value;
    const startDate = moment(this.form.get('startDate').value);
    const endDate = moment(this.form.get('endDate').value);

    this.store.dispatch(new StockDataAction({
      stocks,
      startDate,
      endDate
    }));

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
