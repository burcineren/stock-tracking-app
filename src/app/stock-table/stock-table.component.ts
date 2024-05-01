import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';

@Component({
  selector: 'vex-stock-table',
  templateUrl: './stock-table.component.html',
  styleUrls: ['./stock-table.component.scss']
})
export class StockTableComponent {
  tableTitle: string = "Hisse Senedi Değerleri ve Tarihleri";
  closeValues: number[] = [];
  dates: string[] = [];

  constructor(private store: Store) { }

  ngOnInit(): void {
  
  }

}
