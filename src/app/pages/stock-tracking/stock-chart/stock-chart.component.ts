import { Component, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { FusionChartsModule } from "angular-fusioncharts";

import * as FusionCharts from "fusioncharts";

import * as Charts from "fusioncharts/fusioncharts.charts";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { Observable, Subject } from 'rxjs';
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

  @Select(StockState.chartData) animals$: Observable<string[]>;

  protected subscriptions$: Subject<boolean> = new Subject();

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
    this.store.dispatch(new UpdateChart(this.chartDataSource));
  }
  ngOnDestroy() {
    this.subscriptions$.next(true);
    this.subscriptions$.complete();
  }
}
