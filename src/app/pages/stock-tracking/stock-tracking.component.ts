import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { StockService } from 'src/app/core/services/stock.service'; // Assuming StockService handles API calls
import { MatTableDataSource } from '@angular/material/table';

import { Observable } from 'rxjs';
import { FilterData, UpdateChart, UpdateDateRange, UpdateFilteredStockData, UpdateStockData } from 'src/app/store/stock/stock.actions';
import { Store } from '@ngxs/store';
import { StockState } from 'src/app/store/stock/stock.state';
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
  dataSource = new MatTableDataSource<StockElement>();
  displayedColumns: string[] = ['symbol', 'date', 'openPrice'];
  stocks = ['IBM', 'AAPL', 'AMZN', 'GOOG', 'MSFT'];
  selectedStocks: string[] = [];
  width = '1200';
  height = '400';
  type = 'msline';
  dataFormat = 'json';
  chartDataSource: any = {
    chart: {
      caption: "Hisse Senedi Değerleri ve Tarihleri",
      showhovereffect: "1",
      numbersuffix: "%",
      drawcrossline: "1",
      theme: "fusion",
      type: "msline"
    },
    categories: [
      {
        category: [
          {
            label: ""
          }
        ]
      }
    ],
    dataset: [
      {
        seriesname: "",
        data: [
          {
            value: ""
          }
        ]
      }
    ]
  };
  range = new FormGroup({
    start: new FormControl<string | null>(null),
    end: new FormControl<string | null>(null),
  });
  constructor(private stockService: StockService, private store: Store, private stockState: StockState) { }

  ngOnInit(): void {
    // this.store.dispatch(new FilterData());
  }

  filteredDataSource = new MatTableDataSource<StockElement>();
  filterData() {
    const startDate = this.formatDate(this.range.value.start);
    const endDate = this.formatDate(this.range.value.end);
    const selectedStocks = this.selectedStocks;

    if (startDate && endDate && selectedStocks.length > 0) {
      this.stockService.getDailyTimeSeries(selectedStocks, startDate, endDate).subscribe((data) => {
        const stockElements: StockElement[] = [];
        const symbols: string[] = Object.keys(data);

        for (const symbol of symbols) {
          if (data[symbol] && data[symbol]['Time Series (Daily)'] && data[symbol]['Meta Data']) {
            const metaData = data[symbol]['Meta Data'];
            const timeSeries = data[symbol]['Time Series (Daily)'];
            const symbolName = metaData['2. Symbol'];

            for (const [date, values] of Object.entries(timeSeries)) {
              const openPrice = parseFloat(values['1. open']);
              stockElements.push({ date, openPrice, symbol: symbolName });
            }
          } else {
            console.error(`Time Series (Daily) data for stock ${symbol} is missing or undefined`);
          }
        }
        this.filteredDataSource.data = stockElements;

        this.filteredDataSource.filter = '';
        this.filteredDataSource.filter = this.filteredDataSource.filter.trim().toLowerCase();

        this.updateChart(selectedStocks, data);

        console.log(this.filteredDataSource.data);
        this.store.dispatch(new UpdateFilteredStockData(stockElements));
      });
    } else {
      console.log('Please select a date range and at least one stock');
    }
  }
  updateChart(selectedStocks: string[], data: any) {
    const categories = [];
    const dataset = [];

    if (Object.keys(data).length === 0) {
      this.chartDataSource = {
        chart: {
          caption: "No Data Available",
          subcaption: "",
          theme: "fusion",
          type: "line"
        },
        categories: [{ category: [] }],
        dataset: []
      };
    } else {
      const symbols: string[] = Object.keys(data);
      const symbolData = data[symbols[0]]['Time Series (Daily)'];
      const dates = Object.keys(symbolData);
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
      this.chartDataSource = {
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

      this.store.dispatch(new UpdateChart(this.chartDataSource));
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
  applyFilter() {
    this.filteredDataSource.filterPredicate = (data: StockElement) => {
      const startDateTime = new Date(this.formatDate(this.range.value.start)!).getTime();
      const endDateTime = new Date(this.formatDate(this.range.value.end)!).getTime();
      const dataDateTimes = new Date(data.date).getTime();
      return dataDateTimes >= startDateTime && dataDateTimes <= endDateTime;
    };

    this.filteredDataSource.filter = '';
  }
}
