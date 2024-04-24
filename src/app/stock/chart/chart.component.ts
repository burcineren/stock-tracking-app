import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { StockData } from 'src/app/core/stock/stock.model';
import { StockDataState } from 'src/app/core/store/stock/stock.state';

@Component({
  selector: 'vex-fusion-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  width = '100%';
  height = '400';
  type = 'msline';
  dataFormat = 'json';

  chartData = {
    chart: {
      caption: "Mevcut Veri Yok",
      subcaption: "",
      theme: "fusion",
      showHoverEffect: "1",
      drawCrossLine: "1"
    },
    categories: [{ category: [] }],
    dataset: []
  }


  @Select(StockDataState.getLoading) getLoading$: Observable<boolean>;

  @Select(StockDataState.getChartData) getChartData: Observable<StockData[]>;

  constructor() {

    this.getChartData.subscribe((data: StockData[]) => {

      if (!data || data?.length === 0) {
        this.setDefaultChart();
      } else {
        this.setChart(data);
      }

    });

  }

  ngOnInit(): void {
  }

  setDefaultChart() {
    this.chartData = {
      chart: {
        caption: "Mevcut Veri Yok",
        subcaption: "",
        theme: "fusion",
        showHoverEffect: "1",
        drawCrossLine: "1"
      },
      categories: [{ category: [] }],
      dataset: []
    }
  }

  setChart(data: StockData[]) {
    this.chartData = {
      ...this.chartData,
      chart: {
        ...this.chartData.chart,
        caption: "Hisse Senedi Değerleri ve Tarihleri",
      },
      dataset: this.getDataset(data),
      categories: this.getCategories(data)
    }
  }

  getDataset(data: StockData[]) {

    return data.map(d => {
      return {
        seriesName: d.symbol,
        data: d.data.map(v => {
          return { value: v.value || 0 }
        })
      };
    });

  }

  getCategories(data: StockData[]) {

    return data.map(d => {
      return {
        category: d.data.map(k => {
          return {
            label: k.key
          };
        })
      }
    });

  }

}
