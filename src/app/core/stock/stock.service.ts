import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StockDataModel } from './stock.model';


@Injectable({
  providedIn: 'root',
})
export class StockService {

  constructor(private http: HttpClient) {}

  getStockDataRequest(req:StockDataModel): Observable<any> {
   

    const requests = req.stocks.map(stock => {
      return this.http.get<any>(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&apikey=AC248LFOPBKSO5YD&symbol=${stock}`);
    });

    return forkJoin(requests);
  }
}
