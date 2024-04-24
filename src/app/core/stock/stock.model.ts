import moment from 'moment';

export interface StockDataRequestModel {
    stocks: string[];
    startDate: moment.Moment;
    endDate: moment.Moment;
}

export interface StockData {
    symbol: string,
    data: { key: string, value: string }[]
}
