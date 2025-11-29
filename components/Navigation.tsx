import React from 'react';
import { Home, PieChart, Settings, Plus } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onAddTask: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView, onAddTask }) => {
  const navItemClass = (view: ViewState) => `
    flex flex-col items-center justify-center w-full h-full space-y-1
    ${currentView === view ? 'text-primary' : 'text-neutral-500 hover:text-neutral-300'}
    transition-colors
  `;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-surface/80 backdrop-blur-xl border-t border-neutral-800 pb-2 z-40">
      <div className="max-w-md mx-auto h-full flex items-center justify-around px-4">
        
        <button onClick={() => onChangeView('daily')} className={navItemClass('daily')}>
          <Home size={24} strokeWidth={currentView === 'daily' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Daily</span>
        </button>

        <button 
          onClick={onAddTask}
          className="relative -top-6 bg-white text-black rounded-full p-4 shadow-glow hover:scale-105 transition-transform active:scale-95"
        >
          <Plus size={28} strokeWidth={3} />
        </button>

        <button onClick={() => onChangeView('analytics')} className={navItemClass('analytics')}>
          <PieChart size={24} strokeWidth={currentView === 'analytics' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Insights</span>
        </button>
        
      </div>
    </div>
  );
};

export default Navigation;
