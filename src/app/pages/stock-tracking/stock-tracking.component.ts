import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { StockService } from 'src/app/core/services/stock.service'; // Assuming StockService handles API calls
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { StockState } from 'src/app/store/stock/stock.state';
import { Select, Store } from '@ngxs/store';
import { LoadStockData, SetEndDate, SetFilteredStocks, SetStartDate } from 'src/app/store/stock/stoct.actions';
import { StockElement } from 'src/app/store/stock/stoct.model';
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
// interface StockElement {
//   symbol: string;
//   name: string;
//   openPrice: number;
//   high: number;
//   low: number;
//   close: number;
//   volume: number;
//   date: string;
// }

@Component({
  selector: 'vex-stock-tracking',
  templateUrl: './stock-tracking.component.html',
  styleUrls: ['./stock-tracking.component.scss'],
})
export class StockTrackingComponent implements OnInit {
  @Select(StockState.getStocks) stocks$: Observable<StockElement[]>;
  @Select(StockState.getFilteredStocks) filteredStocks$: Observable<StockElement[]>;
  filteredDataSource = new MatTableDataSource<StockElement>();
  dataSource = new MatTableDataSource<StockElement>();
  displayedColumns: string[] = ['symbol', 'date', 'openPrice'];
  selectedStocks: string[] = []; 
  
  height = 400;
  type = "msline";
  dataFormat = "json";
  dataSource2 = data;
  range = new FormGroup({
    start: new FormControl<string | null>(null),
    end: new FormControl<string | null>(null),
  });
  setStartDate(date: string) {
    this.store.dispatch(new SetStartDate(date));
  }
  setEndDate(date: string) {
    this.store.dispatch(new SetEndDate(date));
  }
  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new LoadStockData());
  }

  filterData() {
    const startDate = this.formatDate(this.range.value.start);
    const endDate = this.formatDate(this.range.value.end);
    const selectedStocks = this.selectedStocks; 

    console.log(selectedStocks)
    
      this.filteredStocks$.subscribe(filteredStocks => {
        this.store.dispatch(new LoadStockData());
      });
    
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
      const startDateTimestamp = new Date(this.formatDate(this.range.value.start)!).getTime();
      const endDateTimestamp = new Date(this.formatDate(this.range.value.end)!).getTime();
      const dataDateTimestamp = new Date(data.date).getTime();
      return dataDateTimestamp >= startDateTimestamp && dataDateTimestamp <= endDateTimestamp;
    };

    this.filteredDataSource.filter = '';
  }
}