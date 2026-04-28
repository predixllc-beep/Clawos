import { useState, useEffect } from 'react';
import { useRealtimeSignals } from './useRealtimeSignals';
import { usePredictionMarkets } from './usePredictionMarkets';

export type FeedItemType = 'SIGNAL' | 'VOLUME' | 'NEWS' | 'PREDICTION';

export interface FeedItem {
  id: string;
  type: FeedItemType;
  title: string;
  description: string;
  timestamp: number;
  source: string;
  metadata?: any;
}

export function useMasterFeed() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const tradeSignals = useRealtimeSignals();
  const { events: predictionEvents } = usePredictionMarkets();

  // Map trade signals to FeedItem
  const signalFeed: FeedItem[] = tradeSignals.map(sig => ({
    id: sig.id,
    type: 'SIGNAL',
    title: `${sig.direction} Signal: ${sig.symbol}`,
    description: `AI detected a high-probability ${sig.direction.toLowerCase()} setup. Confidence: ${sig.confidence}%`,
    timestamp: new Date(sig.timestamp).getTime(),
    source: sig.source,
    metadata: { direction: sig.direction, confidence: sig.confidence, symbol: sig.symbol }
  }));

  // Fetch news
  useEffect(() => {
    let mounted = true;
    async function fetchNews() {
      try {
        const res = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN&limit=10');
        if (!res.ok) return;
        const data = await res.json();
        
        const newsItems: FeedItem[] = data.Data.map((article: any) => ({
          id: `news-${article.id}`,
          type: 'NEWS',
          title: article.title,
          description: article.body.length > 100 ? article.body.substring(0, 100) + '...' : article.body,
          timestamp: article.published_on * 1000,
          source: article.source_info?.name || 'Crypto News',
          metadata: { url: article.url, tags: article.tags, image: article.imageurl }
        }));

        if (mounted) {
          setFeed(prev => {
            const all = [...prev.filter(p => p.type !== 'NEWS'), ...newsItems];
            return all.sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);
          });
        }
      } catch (err) {
        console.warn('Failed to fetch news', err);
      }
    }
    
    fetchNews();
    const interval = setInterval(fetchNews, 120000); // 2 mins
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  // Sync predictions into feed
  useEffect(() => {
    if (predictionEvents.length > 0) {
      const predItems: FeedItem[] = predictionEvents.slice(0, 5).map(ev => ({
        id: `pred-${ev.id}`,
        type: 'PREDICTION',
        title: 'Market Probability Update',
        description: `${ev.title} - Top outcome: ${ev.outcomes[0]?.label} at ${Math.round((ev.outcomes[0]?.price || 0) * 100)}%`,
        timestamp: Date.now() - Math.random() * 3600000, // mock recent past
        source: ev.source,
        metadata: { url: ev.url, image: ev.image }
      }));

      setFeed(prev => {
        const all = [...prev.filter(p => p.type !== 'PREDICTION' && p.type !== 'NEWS'), ...predItems, ...prev.filter(p => p.type === 'NEWS')];
        return all.sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);
      });
    }
  }, [predictionEvents]);

  // Combine live signals every time they update
  const combinedFeed = [...feed.filter(p => p.type !== 'SIGNAL'), ...signalFeed]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 50);

  return combinedFeed;
}
