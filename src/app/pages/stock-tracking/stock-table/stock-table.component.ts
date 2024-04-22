import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { StockData } from 'src/app/store/stock/filter.model';
import { StockState } from 'src/app/store/stock/filter.state';

@Component({
  selector: 'vex-stock-table',
  templateUrl: './stock-table.component.html',
  styleUrls: ['./stock-table.component.scss']
})
export class StockTableComponent {
  @Input() filteredDataSource: MatTableDataSource<StockData>;
  tableTitle: string = "Hisse Senedi Değerleri ve Tarihleri";
  closeValues: number[] = [];
  dates: string[] = [];
  @Select(StockState.stockElements) stockElements$: Observable<string[]>;
  protected subscriptions$: Subject<boolean> = new Subject();
  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.select(StockState.stockElements).subscribe(stockElements => {
      this.filteredDataSource = new MatTableDataSource(stockElements);
    });
  }
  getAllSymbols(): string[] {
    const symbolSet = new Set<string>(); 

    if (this.filteredDataSource.data) {
      this.filteredDataSource.data.forEach(item => {
        symbolSet.add(item.symbol);
      });
    }
    return Array.from(symbolSet);
  }
  getPrice(): number {
    return this.filteredDataSource.data[0].openPrice;
  }
  ngOnDestroy(){
    this.subscriptions$.next(true);
    this.subscriptions$.complete();
  }
}
