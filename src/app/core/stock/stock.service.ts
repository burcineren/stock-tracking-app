import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { StockDataRequestModel } from "./stock.model";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable, forkJoin, map, of, tap } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class StockService {

    cacheRequestSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    constructor(private http: HttpClient) { }

    getStockData(request: StockDataRequestModel) {

        const cache = request.stocks.filter(st => this.cacheRequestSubject.value.map(symbol => symbol['Meta Data']['2. Symbol']).includes(st));

        if (cache.length === request.stocks.length) {
            return of([])
        }

        let requests = request.stocks.filter(st => !this.cacheRequestSubject.value.map(symbol => symbol['Meta Data']['2. Symbol']).includes(st))
            .map(stock => {
                return this.http.get(`${environment.apiUrl}query?function=TIME_SERIES_DAILY&apikey=${environment.apiKey}&symbol=${stock}`);
            });

        return forkJoin(requests);
    }

}
