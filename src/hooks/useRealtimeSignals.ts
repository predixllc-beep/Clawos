import { useEffect, useState } from 'react';

export interface Signal {
  id: string;
  source: string;
  symbol: string;
  direction: 'LONG' | 'SHORT';
  confidence: number;
  timestamp: string;
}

export function useRealtimeSignals() {
  const [signals, setSignals] = useState<Signal[]>([]);

  useEffect(() => {
    let ws: WebSocket;
    let lastPrice = 0;

    const connectToBinance = () => {
      ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const price = parseFloat(data.p);
          const quantity = parseFloat(data.q);
          const isBuyerMaker = data.m; // true if seller took the bid, false if buyer took the ask
          
          if (lastPrice === 0) lastPrice = price;
          
          // Generate an AI signal based on actual large trades (e.g. > 1 BTC)
          if (quantity > 1) {
            const direction = isBuyerMaker ? 'SHORT' : 'LONG';
            const change = Math.abs(((price - lastPrice) / lastPrice) * 100);
            
            // Generate a signal
            setSignals((current) => [{
              id: `ws-${data.t}`,
              source: 'Onyx-Live',
              symbol: 'BTC/USDT',
              direction,
              confidence: Math.min(100, Math.max(70, Math.floor(70 + (quantity * 2) + Math.random() * 5))),
              timestamp: new Date(data.T).toISOString()
            }, ...current].slice(0, 50));
          }
          
          lastPrice = price;

        } catch (e) {
          console.error("WS parsing error", e);
        }
      };

      ws.onerror = (err) => {
        console.error('Binance WS error', err);
      };
      
      ws.onclose = () => {
        console.log('WS disconnected, reconnecting...');
        setTimeout(connectToBinance, 5000);
      };
    }

    connectToBinance();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  return signals;
}
