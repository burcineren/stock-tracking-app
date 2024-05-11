import { Component, Input } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { StockState } from "../core/store/stock/stock.state";
import { StockData } from "../core/stock/stock.model";

@Component({
  selector: "vex-stock-chart",
  templateUrl: "./stock-chart.component.html",
  styleUrls: ["./stock-chart.component.scss"],
})
export class StockChartComponent {
  width = "100%";
  height = "400";
  type = "msline";
  dataFormat = "json";

  chartData = {
    chart: {
      caption: "Mevcut Veri Yok",
      subcaption: "",
      theme: "fusion",
      showHoverEffect: "1",
      drawCrossLine: "1",
    },
    categories: [{ category: [] }],
    dataset: [],
  };

  @Select(StockState.getChartData) getChartData: Observable<StockData[]>;

  constructor() {
    this.getChartData.subscribe((data) => {
      if (!data || data?.length === 0) {
        this.setDefaultChart();
      } else {
        this.setChartData(data);
      }
    });
  }
  ngOnInit(): void {}
  setDefaultChart() {
    this.chartData = {
      chart: {
        caption: "Mevcut Veri Yok",
        subcaption: "",
        theme: "fusion",
        showHoverEffect: "1",
        drawCrossLine: "1",
      },
      categories: [{ category: [] }],
      dataset: [],
    };
  }
  setChartData(data: StockData[]) {
    this.chartData = {
      ...this.chartData,
      chart: {
        ...this.chartData.chart,
        caption: "Hisse Senedi Değer ve Tarihleri",
      },
      dataset: this.getDataSet(data),
      categories: this.getCategories(data),
    };

    console.log(this.chartData);
  }
  getCategories(data: StockData[]) {
    return data.map((e) => {
      return {
        category: e.data.map((d) => {
          return {
            label: d.key,
          };
        }),
      };
    });
  }
  getDataSet(data: StockData[]) {
    return data.map((e) => {
      return {
        seriesName: e.symbol,
        category: e.data.map((d) => {
          return { value: d.value || 0 };
        }),
      };
    });
  }
}
