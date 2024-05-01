import moment from 'moment';
export interface StockDataModel {
    stocks: string[];
    startDate: moment.Moment;
    endDate: moment.Moment;
}

export interface StockData {
    symbol: string,
    data: { key: string, value: string }[]
}
