import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class StockService {
  private API_URL = environment.apiUrl;

  private API_KEY = environment.apiKey;


  constructor(private http: HttpClient) {}

  getDailyTimeSeries(symbols: string[], startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('function', 'TIME_SERIES_DAILY')
      .set('apikey', this.API_KEY)
      .set('startDate', startDate)
      .set('endDate', endDate);

    const requests = symbols.map(symbol => {
      return this.http.get<any>(`${this.API_URL}query`, { params: params.append('symbol', symbol) });
    });

    return forkJoin(requests);
  }
}
