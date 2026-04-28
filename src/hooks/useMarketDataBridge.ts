import { useEffect } from 'react';
import { useSimEngine } from '../state/simEngine';
import { usePersistentStore } from '../state/persistentStore';

let isBridgeInitialized = false;

export function useMarketDataBridge() {
  const { updatePrices, openPosition, positions } = useSimEngine();
  const { killSwitchEngaged, agents } = usePersistentStore();

  useEffect(() => {
    if (isBridgeInitialized) return;
    isBridgeInitialized = true;

    let ws: WebSocket;
    
    /* 
    // Default mock positions just so the UI isn't empty on load
    if (positions.length === 0) {
      openPosition('openclaw', 'BTCUSDT', 'LONG', 0.5, 68000, 10);
      openPosition('betafish', 'ETHUSDT', 'SHORT', 15, 3500, 5);
    }
    */

    const connect = () => {
      // Connect to combined stream for multiple tickers
      ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
      
      ws.onmessage = (event) => {
        if (killSwitchEngaged) {
          // If kill switch is engaged, don't execute trades, optionally close them all.
          // In a real app we'd close all positions.
          return;
        }

        try {
          const data = JSON.parse(event.data);
          const prices: Record<string, number> = {};
          
          data.forEach((ticker: any) => {
            const sym = ticker.s;
            const price = parseFloat(ticker.c);
            prices[sym] = price;
          });

          // Send to sim engine to update live PNL
          updatePrices(prices);

        } catch (err) {
          console.error("Failed to parse ticker stream", err);
        }
      };

      ws.onclose = () => {
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      isBridgeInitialized = false;
      if (ws) ws.close();
    };
  }, [killSwitchEngaged, updatePrices, positions.length, openPosition]);

}
