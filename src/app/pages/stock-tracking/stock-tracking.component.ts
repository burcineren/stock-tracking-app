import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { StockService } from 'src/app/core/services/stock.service'; // Assuming StockService handles API calls
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
const data = {
  chart: {
    caption: "Reach of Social Media Platforms amoung Adults",
    yaxisname: "% of Adults on this platform",
    subcaption: "2018-2023",
    showhovereffect: "1",
    numbersuffix: "%",
    drawcrossline: "1",
    plottooltext: "<b>$dataValue</b> of Adults were on $seriesName",
    theme: "gammel"
  },
  categories: [
    {
      category: [
        {
          label: "2018"
        },
        {
          label: "2019"
        },
        {
          label: "2021"
        },
        {
          label: "2023"
        }
      ]
    }
  ],
  dataset: [
    {
      seriesname: "Facebook",
      data: [
        {
          value: "68"
        },
        {
          value: "69"
        },
        {
          value: "69"
        },
        {
          value: "68"
        }
      ]
    },
    {
      seriesname: "Instagram",
      data: [
        {
          value: "35"
        },
        {
          value: "37"
        },
        {
          value: "40"
        },
        {
          value: "47"
        }
      ]
    },
    {
      seriesname: "LinkedIn",
      data: [
        {
          value: "25"
        },
        {
          value: "27"
        },
        {
          value: "28"
        },
        {
          value: "30"
        }
      ]
    },
    {
      seriesname: "Twitter",
      data: [
        {
          value: "24"
        },
        {
          value: "22"
        },
        {
          value: "23"
        },
        {
          value: "22"
        }
      ]
    }
  ]
};
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
  chartDataSource: any = {};
  range = new FormGroup({
    start: new FormControl<string | null>(null),
    end: new FormControl<string | null>(null),
  });
  constructor(private stockService: StockService) { }
  ngOnInit(): void {
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
      });
    } else {
      console.log('Please select a date range and at least one stock');
    }
  }
  
  
  
  
  
  updateChart(selectedStocks: string[], data: any) {
    if (Object.keys(data).length === 0) {
      this.chartDataSource = {
        chart: {
          caption: "No Data Available",
          subcaption: "",
          theme: "fusion"
        },
        categories: [],
        dataset: []
      };
    } else {
      const categories = [];
      const dataset = [];
  
      const symbols: string[] = Object.keys(data);
  
      const symbolData = data[symbols[0]]['Time Series (Daily)'];
      const dates = Object.keys(symbolData);
      const categoryLabels = dates.map(date => ({ label: date }));
      categories.push({ category: categoryLabels });
  
      for (const symbol of symbols) {
        const symbolData = data[symbol]['Time Series (Daily)'];
        const seriesData = dates.map(date => ({ value: symbolData[date]['4. close'] }));
        dataset.push({
          seriesname: symbol,
          data: seriesData
        });
      }
  
      this.chartDataSource = {
        chart: {
          caption: "Daily Stock Prices",
          subcaption: "2018-2023",
          yaxisname: "Price (USD)",
          theme: "fusion"
        },
        categories: categories,
        dataset: dataset
      };
    }
  
    console.log("chartDataSource", this.chartDataSource);
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
