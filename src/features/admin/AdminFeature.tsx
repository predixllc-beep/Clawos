import React, { useState } from 'react';
import { usePersistentStore } from '../../state/persistentStore';
import { useSimEngine } from '../../state/simEngine';
import { ShieldAlert, Server, HardDrive, Cpu, ExternalLink, Activity, Key } from 'lucide-react';

export const AdminFeature = () => {
  const { killSwitchEngaged, setKillSwitch, models, addModel, removeModel, apiKeys, setApiKeys } = usePersistentStore();
  const [verifying, setVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerifyStatus(apiKeys.binanceKey && apiKeys.binanceSecret ? 'success' : 'error');
      setTimeout(() => setVerifyStatus('idle'), 3000);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto pb-24 no-scrollbar">
      
      {/* Header Area */}
      <div className="bg-red-600 px-4 py-8 rounded-b-[40px] text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10">
          <ShieldAlert className="w-48 h-48 -mr-10 -mt-10" />
        </div>
        <div className="relative z-10 flex items-center gap-3 mb-2">
          <Server className="w-6 h-6 text-red-200" />
          <h1 className="text-xl font-bold">Control Plane</h1>
        </div>
        <p className="text-red-100 text-sm relative z-10 w-4/5">System architecture configuration and master override controls.</p>
      </div>

      <div className="px-4 py-6 -mt-8 relative z-20">
        
        {/* Kill Switch Card */}
        <div className={`rounded-2xl p-5 mb-6 shadow-sm border transition-colors ${killSwitchEngaged ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className={`w-5 h-5 ${killSwitchEngaged ? 'text-red-600' : 'text-gray-400'}`} />
              <h2 className="font-semibold text-gray-900">Kill Switch</h2>
            </div>
            <div className={`px-2 py-1 text-xs font-bold rounded-full ${killSwitchEngaged ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {killSwitchEngaged ? 'ENGAGED' : 'ARMED'}
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4 tracking-tight leading-snug">
            Instantly halt all execution and close open positions at market price.
          </p>
          <button 
            onClick={() => setKillSwitch(!killSwitchEngaged)}
            className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all active:scale-95 ${
              killSwitchEngaged 
              ? 'bg-white text-red-600 border border-red-200 shadow-sm' 
              : 'bg-red-600 text-white shadow-md shadow-red-600/20'
            }`}
          >
            {killSwitchEngaged ? 'Disable Override' : 'Engage Master Kill Switch'}
          </button>
        </div>

        {/* API Settings */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 pl-1">Exchange API Config</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col mb-3">
              <label className="text-xs font-medium text-gray-600 mb-1">Binance API Key</label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                <Key className="w-4 h-4 text-gray-400" />
                <input 
                  type="password" 
                  value={apiKeys.binanceKey}
                  onChange={(e) => setApiKeys({ binanceKey: e.target.value })}
                  placeholder="Enter API Key"
                  className="bg-transparent border-none p-0 flex-1 text-sm text-gray-800 focus:ring-0" 
                />
              </div>
            </div>
            
            <div className="flex flex-col mb-4">
              <label className="text-xs font-medium text-gray-600 mb-1">Binance API Secret</label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                <Key className="w-4 h-4 text-gray-400" />
                <input 
                  type="password" 
                  value={apiKeys.binanceSecret}
                  onChange={(e) => setApiKeys({ binanceSecret: e.target.value })}
                  placeholder="Enter API Secret"
                  className="bg-transparent border-none p-0 flex-1 text-sm text-gray-800 focus:ring-0" 
                />
              </div>
            </div>

            <button 
              onClick={handleVerify}
              disabled={verifying}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2
                ${verifyStatus === 'success' ? 'bg-green-50 text-green-700' : 
                  verifyStatus === 'error' ? 'bg-red-50 text-red-700' : 
                  'bg-indigo-50 text-indigo-700 active:bg-indigo-100'}
                ${verifying ? 'opacity-70' : ''}`}
            >
              {verifying ? (
                <>Verifying...</>
              ) : verifyStatus === 'success' ? (
                <>Connection Verified</>
              ) : verifyStatus === 'error' ? (
                <>Invalid Keys</>
              ) : (
                <>Verify Connection</>
              )}
            </button>
          </div>
        </div>

        {/* Local Network */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 pl-1">Network & LLMs</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            {models.map(model => (
              <div key={model.id} className="p-4 border-b border-gray-50 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900 text-sm">{model.name}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Active</span>
                </div>
                <div className="text-xs text-gray-400 font-mono ml-6 mt-1 flex items-center justify-between">
                  <span>{model.endpoint}</span>
                  {model.id !== 'default-local' && (
                    <button onClick={() => removeModel(model.id)} className="text-red-500 font-semibold p-1 hover:bg-red-50 rounded">Remove</button>
                  )}
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => addModel({ id: `model-${Date.now()}`, name: "New Endpoint", source: "local", endpoint: "http://localhost:11434/v1", assignedTo: ['all'] })}
              className="p-3 bg-gray-50 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4" /> Add Local Node
            </button>
          </div>
        </div>

        {/* System Logs / External Links */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 pl-1">Dataclaw Systems</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
             <div className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 border-b border-gray-50">
               <div className="flex items-center gap-3">
                 <Activity className="w-5 h-5 text-gray-400" />
                 <span className="font-medium text-gray-800 text-sm">System Diagnostics</span>
               </div>
               <ExternalLink className="w-4 h-4 text-gray-300" />
             </div>
             <div className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50">
               <div className="flex items-center gap-3">
                 <Server className="w-5 h-5 text-gray-400" />
                 <span className="font-medium text-gray-800 text-sm">Orchestrator Logs</span>
               </div>
               <ExternalLink className="w-4 h-4 text-gray-300" />
             </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
