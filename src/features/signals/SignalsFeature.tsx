import React, { useState } from 'react';
import { useMasterFeed, FeedItem } from '../../hooks/useMasterFeed';
import { Activity, ArrowUpRight, ArrowDownRight, Clock, Newspaper, Target, Zap } from 'lucide-react';

export const SignalsFeature = () => {
  const feed = useMasterFeed();
  const [filter, setFilter] = useState<'ALL' | 'SIGNAL' | 'NEWS' | 'PREDICTION'>('ALL');

  const filteredFeed = filter === 'ALL' ? feed : feed.filter(f => f.type === filter);

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-24 overflow-y-auto no-scrollbar">
      {/* Header and Filters */}
      <div className="bg-indigo-600 px-4 pt-6 pb-8 rounded-b-[32px] text-white shadow-md relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 opacity-10">
          <Activity className="w-48 h-48 -mr-16 -mt-16" />
        </div>
        <div className="relative z-10 flex flex-col">
          <h1 className="text-xl font-bold mb-1">Market Feed</h1>
          <p className="text-indigo-200 text-xs mb-4">Live signals, news, and predictions.</p>
          
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {['ALL', 'SIGNAL', 'NEWS', 'PREDICTION'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f as any)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  filter === f 
                    ? 'bg-white text-indigo-700' 
                    : 'bg-indigo-500/50 text-indigo-100 hover:bg-indigo-500'
                }`}
              >
                {f === 'ALL' ? 'Everything' : f === 'SIGNAL' ? 'Crypto Signals' : f === 'NEWS' ? 'News' : 'Predictions'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 -mt-6">
        {filteredFeed.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center mt-2 relative z-20">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-gray-600 font-medium">Scanning Markets</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-[200px] text-center">
              The AI swarm is gathering live intelligence...
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 relative z-20">
            {filteredFeed.map((item) => (
              <FeedCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FeedCard: React.FC<{ item: FeedItem }> = ({ item }) => {
  if (item.type === 'SIGNAL') {
    const isLong = item.metadata?.direction === 'LONG';
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
        <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center ${
          isLong ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {isLong ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <span className="font-bold text-gray-900 truncate pr-2">{item.title}</span>
            <div className="flex items-center text-[10px] text-gray-400 shrink-0">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
            </div>
          </div>
          
          <p className="text-xs text-gray-600 mb-2 leading-snug">{item.description}</p>
          
          <div className="flex items-center justify-between">
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              isLong ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {item.metadata?.direction} ({item.metadata?.confidence}%)
            </div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">{item.source}</span>
          </div>
        </div>
      </div>
    );
  }

  if (item.type === 'NEWS') {
    return (
      <a href={item.metadata?.url} target="_blank" rel="noreferrer" className="block active:scale-[0.98] transition-transform">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
          <div className="flex justify-between items-start mb-1 gap-2">
             <div className="flex items-center gap-2">
               <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                 <Newspaper className="w-3 h-3 text-blue-600" />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{item.source}</span>
             </div>
             <div className="flex items-center text-[10px] text-gray-400 shrink-0">
               <Clock className="w-3 h-3 mr-1" />
               {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
             </div>
          </div>
          
          <div className="flex gap-3">
            <div className="flex-1 min-w-0">
               <h4 className="font-semibold text-sm text-gray-900 leading-tight mb-1">{item.title}</h4>
               <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
            </div>
            {item.metadata?.image && (
               <img src={item.metadata.image} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0" />
            )}
          </div>
        </div>
      </a>
    );
  }

  if (item.type === 'PREDICTION') {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
         <div className="flex justify-between items-start mb-1 gap-2">
             <div className="flex items-center gap-2">
               <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                 <Target className="w-3 h-3 text-purple-600" />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">{item.source}</span>
             </div>
             <div className="flex items-center text-[10px] text-gray-400 shrink-0">
               <Clock className="w-3 h-3 mr-1" />
               {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
             </div>
          </div>
          
          <div className="flex gap-3">
            <div className="flex-1 min-w-0">
               <h4 className="font-semibold text-sm text-gray-900 leading-tight mb-1">{item.title}</h4>
               <p className="text-xs text-gray-600">{item.description}</p>
            </div>
            {item.metadata?.image && (
               <img src={item.metadata.image} alt="" className="w-12 h-12 rounded object-cover bg-gray-100 shrink-0" />
            )}
          </div>
      </div>
    );
  }

  return null;
}
