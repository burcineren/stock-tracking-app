import { Component, Input, OnInit } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { StockData } from "../core/stock/stock.model";
import { StockState } from "../core/store/stock/stock.state";

@Component({
  selector: "vex-stock-table",
  templateUrl: "./stock-table.component.html",
  styleUrls: ["./stock-table.component.scss"],
})
export class StockTableComponent {
  @Select(StockState.gatTableData) stockTableData$: Observable<StockData[]>;
  tableTitle: string = "Hisse Senedi Değerleri ve Tarihleri";
  closeValues: number[] = [];
  dates: string[] = [];
  displayedColumns: { label: string; type: string }[] = [];
  dataSource = [];
  get visibleColumns() {
    return this.displayedColumns.map((column) =>
      column.type === "date" ? column.label : column.type
    );
  }
  constructor() {
    this.stockTableData$.subscribe((data) => {
      if (!data || data.length === 0) {
        return;
      }
      this.dataSource = this.setDataSource(data);
    });
  }

  ngOnInit(): void {}
  setDataSource(data: StockData[]) {
    return data.map((stock) => {
      console.log(":::", stock);
    });
  }
}
