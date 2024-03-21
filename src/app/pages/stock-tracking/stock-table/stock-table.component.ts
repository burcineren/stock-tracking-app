import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'vex-stock-table',
  templateUrl: './stock-table.component.html',
  styleUrls: ['./stock-table.component.scss']
})
export class StockTableComponent implements OnInit {
  tableTitle: string = "Hisse Senedi Değerleri ve Tarihleri";
  @Input() filteredDataSource: any;
  constructor() { }

  ngOnInit(): void {
  }

}
