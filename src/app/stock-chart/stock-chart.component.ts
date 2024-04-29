import { Component, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { FusionChartsModule } from "angular-fusioncharts";

import * as FusionCharts from "fusioncharts";

import * as Charts from "fusioncharts/fusioncharts.charts";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { Observable, Subject } from 'rxjs';
// import { FetchStockData, UpdateChart } from 'src/app/store/stock/filter.actions';
import { StockState } from 'src/app/core/store/stock/filter.state';


FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme);
@Component({
  selector: 'vex-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.scss']
})

export class StockChartComponent {
  width = '100%';
  height = '400';
  type = 'msline';
  dataFormat = 'json';

  @Input() chartDataSource: any;

  chartData: {
    chart: {
      caption: "Mevcut Veri Yok",
      subcaption: "",
      theme: "fusion",
      type: "msline"
    },
    categories: [{ category: [] }],
    dataset: []
  }



  constructor(private store: Store) { }

  ngOnInit(): void {

 
}
}