import { Candle } from "../types/candle";

/**
 * transforms array of market data values into array of candles
 * @param data market data
 * @returns candle array
 */
export function getCandlesFromMarketData(data: (number | null)[]): Candle[] {
  /* 
    The candles are in flattened array structure. 
    Each candle is composed of five different numbers in the following order: 
    open price, high price, low price, close price and volume; volume is nullable. 
    Volume is not visible in the chart and should be skipped while parsing the data. 
    Data gaps may occur, empty candles are represented as single null value. 
    Null candles at the start of the array must be ignored, null candles anywhere else 
    must be transformed into candles with open, high, low and close price equal to previous close price. 
    */

  // amount of market values to compose one candle
  const valuesPerCandle = 5;
  // resulting array of candles
  const candles: Candle[] = [];
  // iteration counter
  let i = 0;

  while (i < data.length) {
    if (data[i] === null) {
      // close value of last valid candle
      const prevClose = candles[candles.length - 1]?.close;
      // null candles at the start of the array must be ignored
      if (!prevClose) {
        i += 1;
        continue;
      }
      // null candles anywhere else
      // must be transformed into candles with open, high, low and close price
      // equal to previous close price
      candles.push({
        open: prevClose,
        high: prevClose,
        low: prevClose,
        close: prevClose,
      });
      i += 1;
      continue;
    }

    // Each candle is composed of five different numbers in the following order:
    // open price, high price, low price, close price and volume; volume is nullable.
    candles.push({
      open: data[i] as number,
      high: data[i + 1] as number,
      low: data[i + 2] as number,
      close: data[i + 3] as number,
    });
    // increment iteration counter per amount of subsequent values used
    i += valuesPerCandle;
  }

  return candles;
}
