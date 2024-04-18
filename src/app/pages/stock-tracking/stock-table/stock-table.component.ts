import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Select, Store } from '@ngxs/store';
import { StockData } from 'src/app/store/stock/filter.model';
import { StockState } from 'src/app/store/stock/filter.state';

@Component({
  selector: 'vex-stock-table',
  templateUrl: './stock-table.component.html',
  styleUrls: ['./stock-table.component.scss']
})
export class StockTableComponent  {
  @Input() filteredDataSource: MatTableDataSource<StockData>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.select(StockState.stockElements).subscribe(stockElements => {
      this.filteredDataSource = new MatTableDataSource(stockElements);
    });
  }
}
