import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'vex-stock-tracking',
  templateUrl: './stock-tracking.component.html',
  styleUrls: ['./stock-tracking.component.scss']
})
export class StockTrackingComponent  {
  stocks = ['IBM', 'AAPL', 'AMZN', 'GOOG']; 
}
