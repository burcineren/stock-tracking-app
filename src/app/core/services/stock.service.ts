
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { StockData } from './stock.data.model';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'https://www.alphavantage.co/query';
  private apiKey = 'KA2WU7MEAX4THRE7';

  constructor(private http: HttpClient) { }

  getDailyTimeSeries(symbol: string): Observable<StockData> {
    const url = `${this.apiUrl}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${this.apiKey}`;
    return this.http.get<StockData>(url);
  }

}
