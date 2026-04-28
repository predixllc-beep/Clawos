import React, { useState, useEffect } from 'react';
import { usePersistentStore } from '../../state/persistentStore';
import { useSimEngine } from '../../state/simEngine';
import { TrendingUp, TrendingDown, DollarSign, Activity, History, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { usePredictionMarkets } from '../../hooks/usePredictionMarkets';

// Mock chart data for aesthetic visualization
const mockChartData = [
  { time: '1D', value: 92000 },
  { time: '2D', value: 93500 },
  { time: '3D', value: 94100 },
  { time: '4D', value: 93800 },
  { time: '5D', value: 96200 },
  { time: '6D', value: 98500 },
  { time: '7D', value: 100000 },
];

export const HomeFeature = () => {
  const { mode, activeExchange, agents } = usePersistentStore();
  const { balance, positions, history, prices, closePosition } = useSimEngine();
  const [activeTab, setActiveTab] = useState<'open' | 'history'>('open');
  const [chartData, setChartData] = useState<{time: string, value: number}[]>(mockChartData);

  useEffect(() => {
    let mounted = true;
    async function fetchChart() {
      try {
        const res = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=7');
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        
        const formatted = data.map((kline: any) => {
          const date = new Date(kline[0]);
          return {
            time: date.toLocaleDateString('en-US', { weekday: 'short' }),
            value: parseFloat(kline[4]) // Close price
          };
        });
        
        if (mounted && formatted.length > 0) {
          setChartData(formatted);
        }
      } catch (err) {
        console.warn('Failed to fetch binance chart data, using fallback:', err);
      }
    }
    
    fetchChart();
    
    return () => {
      mounted = false;
    };
  }, []);

  const btcPrice = prices['BTCUSDT'];
  const ethPrice = prices['ETHUSDT'];
  const { events: predictionEvents, loading: loadingPredictions } = usePredictionMarkets();
  const topPredictions = predictionEvents.slice(0, 2);

  return (
    <div className="p-4 flex flex-col gap-4 pb-24 overflow-y-auto no-scrollbar">
      {/* Portfolio Summary Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-md text-white overflow-hidden relative">
        <div className="p-5 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-blue-100 text-sm font-medium uppercase tracking-wider">Estimated Balance</span>
            <div className="bg-white/20 px-2 py-1 rounded-md text-xs font-semibold backdrop-blur-sm">
              {mode.toUpperCase()}
            </div>
          </div>
          <div className="text-4xl font-bold mb-1 flex items-center">
            <DollarSign className="w-8 h-8 opacity-80" strokeWidth={3} />
            {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-blue-100 flex items-center gap-2 mt-2">
            <span>Active Exchange: <span className="font-semibold text-white capitalize">{activeExchange}</span></span>
          </div>
        </div>
        
        {/* Recharts Chart inside Card */}
        <div className="h-24 w-full -mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e1b4b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
                formatter={(val: number) => [`$${val.toLocaleString()}`, 'BTC Price']}
                labelStyle={{ display: 'none' }}
              />
              <Area type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Market Tickers */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-2">Live Markets</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <span className="text-xs font-bold text-gray-500 mb-1">BTC/USDT</span>
          <span className="text-lg font-bold text-gray-900">
            {btcPrice ? `$${btcPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 'Loading...'}
          </span>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <span className="text-xs font-bold text-gray-500 mb-1">ETH/USDT</span>
          <span className="text-lg font-bold text-gray-900">
            {ethPrice ? `$${ethPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : 'Loading...'}
          </span>
        </div>
      </div>

      {/* Top Predictions */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-2">Top Predictions</h2>
      {topPredictions.length > 0 ? (
        <div className="flex flex-col gap-3">
          {topPredictions.map((event) => (
            <div key={event.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <div className="flex justify-between items-start gap-2 mb-2">
                <span className="text-sm font-semibold text-gray-900 leading-snug">{event.title}</span>
                {event.image && (
                  <img src={event.image} alt="" className="w-8 h-8 rounded shrink-0 object-cover bg-gray-100" />
                )}
              </div>
              <div className="flex gap-2 w-full h-8 bg-gray-50 rounded-lg overflow-hidden relative">
                {event.outcomes.slice(0, 2).map((outcome, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center px-2 h-full absolute top-0 ${idx === 0 ? 'left-0 bg-green-100/50 justify-start' : 'right-0 bg-red-100/50 justify-end'}`} 
                    style={{ width: `${outcome.price * 100}%` }}
                  >
                    <span className={`text-[10px] font-bold ${idx === 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {outcome.label} {Math.round(outcome.price * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex justify-center items-center h-16">
          <span className="text-xs text-gray-400 font-medium">{loadingPredictions ? 'Loading...' : 'No predictions available'}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-4 mt-2 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('open')}
          className={`pb-2 text-sm font-semibold transition-colors relative ${activeTab === 'open' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          Open Positions ({positions.length})
          {activeTab === 'open' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`pb-2 text-sm font-semibold transition-colors relative ${activeTab === 'history' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          History ({history.length})
          {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></div>}
        </button>
      </div>
      
      {activeTab === 'open' ? (
        positions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center mt-2">
            <Activity className="w-10 h-10 text-gray-300 mb-2" strokeWidth={1.5} />
            <p className="text-gray-500 font-medium">No open positions</p>
            <p className="text-xs text-gray-400 mt-1">Signals will appear when agents execute trades.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-2">
            {positions.map((pos) => (
              <div key={pos.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${pos.side === 'LONG' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="font-bold text-gray-900">{pos.symbol}</span>
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                      {pos.leverage}x
                    </span>
                  </div>
                  <div className={`font-semibold ${pos.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toFixed(2)} USD
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Entry: ${pos.entryPrice.toFixed(4)}</span>
                  <span>Mark: ${pos.markPrice.toFixed(4)}</span>
                </div>
                <div className="bg-gray-50 mt-3 p-2 rounded-lg flex justify-between items-center">
                   <span className="text-xs text-gray-600">Size: {pos.size}</span>
                   <div className="flex items-center gap-3">
                     <span className={`text-xs font-semibold ${pos.pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                       {pos.pnlPercent.toFixed(2)}%
                     </span>
                     <button 
                       onClick={() => closePosition(pos.id, prices[pos.symbol] || pos.markPrice)}
                       className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-medium hover:bg-gray-50 active:scale-95 transition-all"
                     >
                       Close
                     </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        history.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center mt-2">
            <History className="w-10 h-10 text-gray-300 mb-2" strokeWidth={1.5} />
            <p className="text-gray-500 font-medium">No trade history</p>
            <p className="text-xs text-gray-400 mt-1">Closed positions will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-2">
            {history.map((pos) => (
              <div key={pos.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col opacity-80">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-600">{pos.symbol}</span>
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                      {pos.side}
                    </span>
                  </div>
                  <div className={`font-semibold ${pos.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toFixed(2)} USD
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Entry: ${pos.entryPrice.toFixed(4)}</span>
                  <span>Exit: ${pos.markPrice.toFixed(4)}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-2">Active Hive Agents</h2>
      <div className="grid grid-cols-2 gap-3 pb-8">
        {agents.filter(a => a.enabled).map((agent) => (
          <div key={agent.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
              <span className="font-bold">{agent.name.charAt(0)}</span>
            </div>
            <h3 className="font-medium text-gray-800 text-sm">{agent.name}</h3>
            <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase mt-0.5">{agent.role}</p>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
               <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${agent.state?.health || 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
