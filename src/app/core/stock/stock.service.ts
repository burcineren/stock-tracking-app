import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { StockDataRequestModel } from "./stock.model";
import { environment } from "src/environments/environment";
import { forkJoin } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class StockService {
    constructor(private http: HttpClient) { }

    getStockData(request: StockDataRequestModel) {
        const requests = request.stocks.map(stock => {
            return this.http.get(`${environment.apiUrl}query?function=TIME_SERIES_DAILY&apikey=${environment.apiKey}&symbol=${stock}`);
        });

        return forkJoin(requests);
    }

}
