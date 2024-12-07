export interface ICurrency {
    Code: string,
    Legend:string,
    Symbol: string,
    ConvertionIndex: number,
}
export interface ICurrencyUpdateReq {
    code: string,
    convertionIndex: number,
}
export interface ICurrencyToShow {
    code: string,
    legend: string,
    symbol: string,
    convertionIndex: number,
    }

