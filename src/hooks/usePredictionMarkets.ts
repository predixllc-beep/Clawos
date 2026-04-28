import { useState, useEffect } from 'react';

export interface PredictionEvent {
  id: string;
  source: 'Polymarket' | 'Kalshi';
  title: string;
  volume: number;
  outcomes: { label: string; price: number }[];
  endDate?: string;
  url?: string;
  image?: string;
}

export function usePredictionMarkets() {
  const [events, setEvents] = useState<PredictionEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    async function fetchData() {
      try {
        // Using an allorigins proxy to avoid strict CORS from Polymarket API
        const polyRes = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://gamma-api.polymarket.com/events?limit=10&active=true&closed=false'));
        
        if (!polyRes.ok) {
           throw new Error(`HTTP error! status: ${polyRes.status}`);
        }
        
        const proxyData = await polyRes.json();
        const polyData = JSON.parse(proxyData.contents);
        
        const mappedPoly: PredictionEvent[] = polyData.map((ev: any) => {
          const mainMarket = ev.markets?.[0];
          
          let outcomes: string[] = [];
          let prices: string[] = [];
          
          try {
            if (mainMarket?.outcomes) outcomes = JSON.parse(mainMarket.outcomes);
            if (mainMarket?.outcomePrices) prices = JSON.parse(mainMarket.outcomePrices);
          } catch (e) {
            // parsing error
          }
          
          return {
            id: `poly-${ev.id}`,
            source: 'Polymarket',
            title: ev.title,
            volume: parseFloat(ev.volume) || 0,
            image: ev.image,
            outcomes: outcomes.map((out: string, i: number) => ({
              label: out,
              price: parseFloat(prices[i]) || 0
            })),
            endDate: ev.endDate,
            url: `https://polymarket.com/event/${ev.slug}`,
          };
        }).filter((ev: any) => ev.outcomes.length > 0);

        if (mounted) {
          setEvents(mappedPoly.sort((a: any, b: any) => b.volume - a.volume));
        }
      } catch (err) {
        console.warn("Failed to fetch prediction markets live data:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60000); // 1 min updates
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { events, loading };
}
