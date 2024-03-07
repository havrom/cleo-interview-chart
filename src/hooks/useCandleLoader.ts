import { useEffect, useState } from "react";
import { Candle } from "../types/candle";
import { fetcher } from "../utils/fetcher";
import { getCandlesFromMarketData } from "../utils/getCandlesFromMarketData";

// DO NOT MODIFY THIS TYPE
type CandleLoaderParams =
  | {
      enabled: false;
      symbol?: string | null;
    }
  | {
      enabled: true;
      symbol: string;
    };

// DO NOT MODIFY THIS TYPE
type CandleLoaderHook =
  | {
      status: "loading" | "idle";
      data: null;
      error: null;
    }
  | {
      status: "error";
      data: null;
      error: string;
    }
  | {
      status: "success";
      data: Candle[];
      error: null;
    };

export function useCandleLoader({
  enabled,
  symbol,
}: CandleLoaderParams): CandleLoaderHook {
  const [candleData, setCandleData] = useState<Candle[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (!symbol) return;

    // reset fetching state
    setErrorMessage("");
    setDataLoading(true);

    // fetch data from public json by market name
    fetcher<(number | null)[]>(`/candles/${symbol}.json`)
      .then((data) => {
        // transform market data and set candles array to state
        setCandleData(getCandlesFromMarketData(data));
      })
      .catch((error) => {
        // set errorMessage if error occurs while fetching 
        if (typeof error === "string") {
          setErrorMessage(error);
        } else if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An error occured");
        }
      })
      .finally(() => {
        setDataLoading(false);
      });
  }, [symbol]);

  if (!enabled) {
    return {
      status: "idle",
      data: null,
      error: null,
    };
  }
  if (errorMessage) {
    return {
      status: "error",
      data: null,
      error: errorMessage,
    };
  }
  if (dataLoading) {
    return {
      status: "loading",
      data: null,
      error: null,
    }
  }

  return {
    status: "success",
    data: candleData,
    error: null,
  };
}
