import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, tap } from 'rxjs';
import { StockData } from 'src/app/core/stock/stock.model';
import { StockDataState } from 'src/app/core/store/stock/stock.state';

@Component({
  selector: 'vex-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @Select(StockDataState.getTableData) stockTableData$: Observable<StockData[]>;
  @Select(StockDataState.getLoading) loading$: Observable<boolean>;

  displayedColumns: { label: string, type: string }[] = [];

  dataSource = [];
  loading = false;

  get visibleColumns() {
    return this.displayedColumns.map(column => column.type === 'date' ? column.label : column.type);
  }

  constructor() {

    this.stockTableData$.pipe(tap(() => this.loading = true)).subscribe(data => {

      if (!data || data?.length === 0) {
        return;
      }

      this.setColumns(data[0]);
      this.dataSource = this.setDataSource(data);
      this.loading = false
    });

  }

  ngOnInit(): void {
  }

  setColumns(data: StockData) {
    this.displayedColumns = data.data.map(x => {
      return {
        label: x.key,
        type: 'date'
      }
    });

    this.displayedColumns.unshift({
      label: 'Stock',
      type: 'Stock'
    });
  }

  setDataSource(data: StockData[]) {

    return data.map(d => {
      let col = {};
      d.data.map(r => {
        col = {
          [r.key]: r.value,
          ...col
        };
      });

      col = { stock: d.symbol, ...col }
      return col;
    });

  }

}
