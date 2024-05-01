import { Component, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';


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