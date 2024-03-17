import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { StockService } from 'src/app/core/services/stock.service';
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
  stocks = ['IBM', 'AAPL', 'AMZN', 'GOOG','MSFT']; 
  width = 600;
  height = 400;
  type = "msline";
  dataFormat = "json";
  dataSource2 = data;
  headerDate: string | undefined;

  
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.stocks.forEach(symbol => {
      this.getStockData(symbol);
    });
  }

  getStockData(symbol: string): void {
    this.stockService.getDailyTimeSeries(symbol).subscribe(data => {
      const stockElements: StockElement[] = [];
      const metaData = data['Meta Data'];
      const timeSeries = data['Time Series (Daily)'];
      const symbol = metaData['2. Symbol'];

      for (const [date, values] of Object.entries(timeSeries)) {
        const openPrice = parseFloat(values['1. open']);
        stockElements.push({ date, openPrice, symbol });
      }

      this.dataSource.data = stockElements;
    });
  }

}
