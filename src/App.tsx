import { useEffect, useState } from "react";
import classes from "./App.module.scss";
import AssetSelect from "./components/AssetSelect";
import CandleInfo from "./components/CandleInfo";
import Chart from "./components/Chart";
import { useCandleLoader } from "./hooks/useCandleLoader";

function App() {
  const url = new URL(window.location.href);
  const symbol = url.searchParams.get("symbol");

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const candleLoader = useCandleLoader(
    symbol
      ? {
          enabled: true,
          symbol,
        }
      : {
          enabled: false,
        },
  );

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={classes["app"]}>
      <div className={classes["asset-select-wrapper"]}>
        <AssetSelect />
      </div>

      {candleLoader.status === "idle" && (
        <div className={classes["message"]}>No asset selected</div>
      )}

      {candleLoader.status === "loading" && (
        <div className={classes["message"]}>Loading...</div>
      )}

      {candleLoader.status === "error" && (
        <div className={classes["message"]}>Error: {candleLoader.error}</div>
      )}

      {candleLoader.status === "success" && (
        <>
          <Chart
            width={dimensions.width}
            height={dimensions.height}
            candles={candleLoader.data}
          />
          <div className={classes["candle-info-wrapper"]}>
            <CandleInfo candle={null} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
