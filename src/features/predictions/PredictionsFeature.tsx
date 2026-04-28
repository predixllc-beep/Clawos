import React from 'react';
import { usePredictionMarkets } from '../../hooks/usePredictionMarkets';
import { Target, BarChart3, ArrowRight } from 'lucide-react';

export const PredictionsFeature = () => {
  const { events, loading } = usePredictionMarkets();

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-24 overflow-y-auto no-scrollbar">
      
      {/* Header */}
      <div className="bg-indigo-600 px-4 py-8 rounded-b-[40px] text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10">
          <Target className="w-48 h-48 -mr-10 -mt-10" />
        </div>
        <div className="relative z-10 flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-indigo-200" />
          <h1 className="text-xl font-bold">Prediction Markets</h1>
        </div>
        <p className="text-indigo-100 text-sm relative z-10 w-4/5">
          Live consensus probabilities from Polymarket & Kalshi.
        </p>
      </div>

      <div className="px-4 py-6 -mt-8 relative z-20">
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        event.source === 'Polymarket' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                      }`}>
                        {event.source}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">Vol: ${(event.volume).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 leading-snug text-sm">{event.title}</h3>
                  </div>
                  {event.image && (
                    <img src={event.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0" />
                  )}
                </div>

                {/* Outcomes */}
                <div className="flex flex-col gap-2 mt-4">
                  {event.outcomes.slice(0, 2).map((outcome, idx) => (
                    <div key={idx} className="relative w-full bg-gray-50 rounded-xl h-10 overflow-hidden flex items-center justify-between px-3">
                      {/* Progress bar background */}
                      <div 
                        className={`absolute left-0 top-0 bottom-0 opacity-20 ${
                          idx === 0 ? 'bg-green-500' : 'bg-red-500'
                        }`} 
                        style={{ width: `${outcome.price * 100}%` }}
                      />
                      <span className="font-medium text-sm text-gray-800 z-10">{outcome.label}</span>
                      <span className="font-bold text-sm text-gray-900 z-10">
                        {Math.round(outcome.price * 100)}%
                        <span className="text-xs font-normal text-gray-500 ml-1 translate-y-0.5">({outcome.price.toFixed(2)}¢)</span>
                      </span>
                    </div>
                  ))}
                  {event.outcomes.length > 2 && (
                    <div className="text-center mt-1">
                      <span className="text-xs text-gray-400 font-medium">+{event.outcomes.length - 2} more options</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {event.url && (
                  <a href={event.url} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center w-full gap-1 py-2 text-xs font-semibold text-indigo-600 active:bg-indigo-50 rounded-lg transition-colors">
                    View Market <ArrowRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
