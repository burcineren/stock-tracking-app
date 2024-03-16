import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockData } from './stock.data.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'https://www.alphavantage.co/query';
  private apiKey = 'AC248LFOPBKSO5YD';

  constructor(private http: HttpClient) { }

  getDailyTimeSeries(symbol: string): Observable<StockData> {
    const url = `${this.apiUrl}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${this.apiKey}`;
    return this.http.get<StockData>(url);
  }
}
