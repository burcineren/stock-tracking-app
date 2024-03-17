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
  height = 400;
  type = "msline";
  dataFormat = "json";
  dataSource2 = data;
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
    if (startDate && endDate) {
      this.stockService.getDailyTimeSeries(this.stocks, startDate, endDate).subscribe((data) => {
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

        stockElements.sort((a, b) => a.symbol.localeCompare(b.symbol));

        this.filteredDataSource.data = stockElements;
        this.applyFilter();
      });

    } else {
      console.log('Please select a date range');
    }
  }





  formatDate(date: string | null): string | null {
    if (!date) {
      return null;
    }

    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0'); // Zero-pad the day
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Zero-pad the month
    console.log("first:::", day);
    // Reorder month and day for DD-MM-YYYY format
    return `${day}-${month}-${dateObj.getFullYear()}`;
  }
  applyFilter() {
    this.filteredDataSource.filterPredicate = (data: StockElement) => {
      const startDateTimestamp = new Date(this.formatDate(this.range.value.start)!).getTime();
      const endDateTimestamp = new Date(this.formatDate(this.range.value.end)!).getTime();
      const dataDateTimestamp = new Date(data.date).getTime();
      console.log("start:", startDateTimestamp, "end:", endDateTimestamp, "data:", dataDateTimestamp);
      return dataDateTimestamp >= startDateTimestamp && dataDateTimestamp <= endDateTimestamp;
    };

    this.filteredDataSource.filter = '';
  }
}
