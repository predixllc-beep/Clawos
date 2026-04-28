import React, { useState } from 'react';
import { usePersistentStore } from '../../state/persistentStore';
import { Settings, Cpu, BrainCircuit, Activity, ChevronLeft, Terminal } from 'lucide-react';

export const AgentsFeature = () => {
  const { agents, mode, setMode, activeExchange, setActiveExchange } = usePersistentStore();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  if (selectedAgent) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
          <button 
            onClick={() => setSelectedAgentId(null)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">{selectedAgent.name}</h2>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{selectedAgent.role}</p>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-bold ${selectedAgent.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {selectedAgent.enabled ? 'ONLINE' : 'OFFLINE'}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-24 no-scrollbar flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Total Trades</div>
              <div className="text-2xl font-bold text-gray-900">{selectedAgent.state?.performance.totalTrades || 0}</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Win Rate</div>
              <div className="text-2xl font-bold text-gray-900">{selectedAgent.state?.performance.winRate.toFixed(1) || 0}%</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Lifetime PNL</div>
              <div className={`text-2xl font-bold ${selectedAgent.state?.performance.pnl && selectedAgent.state.performance.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${selectedAgent.state?.performance.pnl.toFixed(2) || 0}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Sharpe Ratio</div>
              <div className="text-2xl font-bold text-gray-900">{selectedAgent.state?.performance.sharpeRatio.toFixed(2) || 0}</div>
            </div>
          </div>

          {/* Strategy / Risk Parameters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden shrink-0">
            <div className="bg-gray-50 border-b border-gray-100 px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-800">Strategy Parameters</h3>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <div>
                <div className="flex justify-between mb-1 text-xs">
                  <span className="font-medium text-gray-700 block">Confidence Threshold</span>
                  <span className="text-indigo-600 font-bold">85%</span>
                </div>
                <input type="range" min="50" max="99" defaultValue="85" className="w-full accent-indigo-600" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                   <label className="text-xs font-medium text-gray-700 mb-1 block">Take-Profit (%)</label>
                   <input type="number" defaultValue="5.0" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-semibold" />
                </div>
                <div>
                   <label className="text-xs font-medium text-gray-700 mb-1 block">Stop-Loss (%)</label>
                   <input type="number" defaultValue="2.0" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-semibold" />
                </div>
              </div>

               <div>
                 <label className="text-xs font-medium text-gray-700 mb-1 block">Max Leverage limit</label>
                 <select defaultValue="10" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-semibold">
                    <option value="1">1x (Spot)</option>
                    <option value="3">3x</option>
                    <option value="5">5x</option>
                    <option value="10">10x</option>
                 </select>
               </div>
              
              <button 
                onClick={() => {}} 
                className="mt-1 w-full bg-indigo-50 text-indigo-700 active:bg-indigo-100 rounded-lg py-2.5 text-sm font-semibold transition"
              >
                Apply Changes
              </button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl shadow-inner border border-gray-800 flex flex-col overflow-hidden h-64 shrink-0">
            <div className="bg-gray-800 px-3 py-2 flex items-center gap-2 border-b border-gray-700">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-gray-300">Agent Logs ({selectedAgent.name})</span>
            </div>
            <div className="p-3 font-mono text-[10px] text-green-400 flex-1 overflow-y-auto flex flex-col gap-1">
              {['Initializing model params...', 'Connecting to exchange stream...', 'Analyzing orderbook depth...', 'Executing sentiment analysis...', 'No actionable setup found. Standing by.'].map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-gray-500">[{new Date(Date.now() - (10-i)*60000).toISOString().split('T')[1].slice(0,8)}]</span>
                  <span>{log}</span>
                </div>
              ))}
              <div className="mt-2 animate-pulse flex gap-2">
                <span className="text-gray-500">[{new Date().toISOString().split('T')[1].slice(0,8)}]</span>
                <span>Awaiting new events_</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 gap-6 pb-24 overflow-y-auto no-scrollbar">
      {/* Overview Head */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center shrink-0">
          <BrainCircuit className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Dataclaw Swarm</h2>
          <p className="text-sm text-gray-500">Autonomous Execution Layer</p>
        </div>
      </div>

      {/* Global Settings */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">System Settings</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                <Activity className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-800">Execution Mode</span>
            </div>
            <select 
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="text-sm font-medium bg-gray-50 border-none rounded-lg px-3 py-1.5 focus:ring-0 active:bg-gray-100"
            >
              <option value="paper">Paper Trading</option>
              <option value="shadow">Shadow Mode</option>
              <option value="live">Live Trading</option>
            </select>
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <Settings className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-800">Active Exchange</span>
            </div>
            <select 
              value={activeExchange}
              onChange={(e) => setActiveExchange(e.target.value as any)}
              className="text-sm font-medium bg-gray-50 border-none rounded-lg px-3 py-1.5 focus:ring-0 active:bg-gray-100"
            >
              <option value="auto">Smart Router (Auto)</option>
              <option value="binance">Binance</option>
              <option value="mexc">MEXC</option>
            </select>
          </div>
        </div>
      </div>

      {/* Agents List */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Model Roster & Perf</h3>
        <div className="flex flex-col gap-3">
          {agents.map((agent) => (
            <div 
              key={agent.id} 
              onClick={() => setSelectedAgentId(agent.id)}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${agent.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{agent.name}</h4>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">{agent.role}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${agent.state?.performance.pnl && agent.state.performance.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${agent.state?.performance.pnl.toFixed(0)}
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">LIFETIME PNL</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2 border-t border-gray-50 pt-3">
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-800">{agent.state?.performance.winRate.toFixed(1)}%</div>
                  <div className="text-[10px] text-gray-400">WIN RATE</div>
                </div>
                <div className="text-center border-l border-r border-gray-50">
                  <div className="text-xs font-semibold text-gray-800">{agent.state?.performance.totalTrades}</div>
                  <div className="text-[10px] text-gray-400">TRADES</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-800">{agent.state?.performance.sharpeRatio.toFixed(2)}</div>
                  <div className="text-[10px] text-gray-400">SHARPE</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
