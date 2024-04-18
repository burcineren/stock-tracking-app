import { Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { FusionChartsModule } from "angular-fusioncharts";

import * as FusionCharts from "fusioncharts";

import * as Charts from "fusioncharts/fusioncharts.charts";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { FetchStockData, UpdateChart } from 'src/app/store/stock/filter.actions';
import { StockState } from 'src/app/store/stock/filter.state';


FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme);
@Component({
  selector: 'vex-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.scss']
})

export class StockChartComponent {
  @Input() width: string;
  @Input() height: string;
  @Input() type: string;
  @Input() dataFormat: string;
  @Input() chartDataSource: any;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new FetchStockData(null, null, [])); 
  }

  ngDoCheck(): void {
    this.store.select(StockState.chartData).subscribe(chartData => {
      if (chartData) {
        this.chartDataSource = chartData;
      }
    });
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
      const dates = Object.keys(symbolData || {});
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
}
