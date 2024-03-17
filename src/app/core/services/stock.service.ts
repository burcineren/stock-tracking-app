import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = 'https://www.alphavantage.co/query';
  private apiKey = 'AC248LFOPBKSO5YD';

  constructor(private http: HttpClient) {}

  getDailyTimeSeries(symbols: string[], startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('function', 'TIME_SERIES_DAILY')
      .set('apikey', this.apiKey)
      .set('startDate', startDate)
      .set('endDate', endDate);

    const requests = symbols.map(symbol => {
      return this.http.get<any>(`${this.apiUrl}`, { params: params.append('symbol', symbol) });
    });

    return forkJoin(requests);
  }
}
