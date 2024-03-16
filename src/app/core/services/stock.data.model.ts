export interface StockData {
    meta: {
        information: string;
        symbol: string;
        lastRefreshed: string;
        outputSize: string;
        timeZone: string;
    };
    timeSeries: {
        [date: string]: {
            open: string;
            high: string;
            low: string;
            close: string;
            volume: string;
        };
    };
}