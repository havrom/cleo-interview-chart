import { Candle } from "../types/candle";

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
}: CandleLoaderParams): CandleLoaderHook {
  // Remove all code below this line and replace it with your own implementation

  if (!enabled) {
    return {
      status: "idle",
      data: null,
      error: null,
    };
  }

  const candleCount = 250;
  const periods = 4;
  return {
    status: "success",
    data: Array.from({ length: candleCount }, (_, i) => {
      const candleRatio = 1 / 10;

      const radians = (i / candleCount) * Math.PI * 2 * periods;
      const indexPrice = Math.cos(radians);
      const indexSlope = -Math.sin(radians);
      const priceChange = candleRatio * Math.sign(indexSlope);

      const open = indexPrice - priceChange;
      const close = indexPrice + priceChange;
      const high = Math.max(open, close) + candleRatio;
      const low = Math.min(open, close) - candleRatio;

      return {
        open,
        high,
        low,
        close,
      };
    }),
    error: null,
  };
}
