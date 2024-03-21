import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StockService } from 'src/app/core/services/stock.service';
import { Store } from '@ngxs/store';
import { UpdateFilteredStockData } from 'src/app/store/stock/stock.actions';
import { StockChartComponent } from './stock-chart/stock-chart.component';

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

  filterData() {
    const startDate = this.formatDate(this.range.start);
    const endDate = this.formatDate(this.range.end);
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
  
        this.stockChartComponent.updateChart(selectedStocks, data);
  
        this.store.dispatch(new UpdateFilteredStockData(stockElements));
      });
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
