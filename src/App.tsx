import { useState } from 'react';
import { Home, LineChart, Cpu, ShieldAlert, Target, Bell, X } from 'lucide-react';
import { Scaffold } from './shared/widgets/Scaffold';
import { AppBar } from './shared/widgets/AppBar';
import { BottomNavigationBar } from './shared/widgets/BottomNavigationBar';
import { HomeFeature } from './features/home/HomeFeature';
import { SignalsFeature } from './features/signals/SignalsFeature';
import { AgentsFeature } from './features/agents/AgentsFeature';
import { AdminFeature } from './features/admin/AdminFeature';
import { PredictionsFeature } from './features/predictions/PredictionsFeature';
import { useMarketDataBridge } from './hooks/useMarketDataBridge';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useMarketDataBridge();

  // Flutter-style indexed stack substitution
  const pages = [
    <HomeFeature key="home" />,
    <SignalsFeature key="signals" />,
    <PredictionsFeature key="predictions" />,
    <AgentsFeature key="agents" />,
    <AdminFeature key="admin" />
  ];

  const pageNames = ['Dashboard', 'Signals Feed', 'Predictions', 'Swarm Setup', 'Control Plane'];

  const navItems = [
    {
      icon: <Home className="w-6 h-6" strokeWidth={1.5} />,
      activeIcon: <Home className="w-6 h-6" strokeWidth={2.5} />,
      label: 'Home',
    },
    {
      icon: <LineChart className="w-6 h-6" strokeWidth={1.5} />,
      activeIcon: <LineChart className="w-6 h-6" strokeWidth={2.5} />,
      label: 'Signals',
    },
    {
      icon: <Target className="w-6 h-6" strokeWidth={1.5} />,
      activeIcon: <Target className="w-6 h-6" strokeWidth={2.5} />,
      label: 'Predict',
    },
    {
      icon: <Cpu className="w-6 h-6" strokeWidth={1.5} />,
      activeIcon: <Cpu className="w-6 h-6" strokeWidth={2.5} />,
      label: 'Agents',
    },
    {
      icon: <ShieldAlert className="w-6 h-6" strokeWidth={1.5} />,
      activeIcon: <ShieldAlert className="w-6 h-6" strokeWidth={2.5} />,
      label: 'Admin',
    },
  ];

  return (
    <>
      <Scaffold
      appBar={
        <AppBar 
          // Dynamic title based on tab
          title={pageNames[currentIndex]}
          actions={[
            <button 
              key="bell" 
              onClick={() => setShowNotifications(true)}
              className="relative text-gray-600 active:scale-90 transition-transform p-1"
            >
              <Bell className="w-6 h-6" strokeWidth={1.5} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          ]} 
        />
      }
      body={
        <div className="h-full w-full">
          {/* Renders the active tab content */}
          {pages[currentIndex]}
        </div>
      }
      bottomNavigationBar={
        <BottomNavigationBar
          items={navItems}
          currentIndex={currentIndex}
          onTap={(idx) => setCurrentIndex(idx)}
        />
      }
    />
    {/* Notifications Drawer */}
    {showNotifications && (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
          onClick={() => setShowNotifications(false)}
        />
        <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col slide-in-right transform transition-transform animate-in fade-in slide-in-from-right-8 duration-300">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 pt-safe">
            <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
            <button 
              onClick={() => setShowNotifications(false)}
              className="p-2 -mr-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {[
              { title: 'Position Closed', time: '2m ago', desc: 'Agent Alpha closed BTC/USDT LONG. PNL: +$145.20', type: 'success' },
              { title: 'Signal Alert', time: '15m ago', desc: 'Strong SHORT signal detected on ETH/USDT by Pattern Swarm.', type: 'info' },
              { title: 'System Warning', time: '1h ago', desc: 'API rate limit warning on MEXC endpoints.', type: 'warning' }
            ].map((notif, i) => (
              <div key={i} className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  notif.type === 'success' ? 'bg-green-500' :
                  notif.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                }`} />
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-semibold text-sm text-gray-900">{notif.title}</h4>
                    <span className="text-[10px] text-gray-400">{notif.time}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{notif.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </>
  );
}

