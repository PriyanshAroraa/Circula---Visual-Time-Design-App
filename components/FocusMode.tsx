import React, { useState, useEffect } from 'react';
import { Play, Pause, X, Check, Volume2, VolumeX } from 'lucide-react';
import { Task } from '../types';
import { CATEGORIES } from '../constants';

interface FocusModeProps {
  task: Task;
  onExit: () => void;
  onComplete: () => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ task, onExit, onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [sliderValue, setSliderValue] = useState(0);

  // Initialize timer based on task duration
  useEffect(() => {
    let durationHours = task.endTime - task.startTime;
    if (durationHours < 0) durationHours += 24;
    setTimeLeft(Math.floor(durationHours * 3600)); // seconds
    setIsActive(true);
  }, [task]);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Slide to complete logic
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSliderValue(val);
    if (val === 100) {
      onComplete();
    }
  };

  const handleSliderEnd = () => {
    if (sliderValue < 100) {
      setSliderValue(0); // Snap back
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const categoryColor = CATEGORIES[task.category]?.color || '#ffffff';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between text-white overflow-hidden bg-black">
      
      {/* Animated Liquid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-40 animate-pulse-slow"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${categoryColor} 0%, #000000 70%)`,
          filter: 'blur(80px)',
          transform: 'scale(1.2)'
        }}
      />
      <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-3xl" />

      {/* Header */}
      <div className="relative z-10 w-full flex justify-between p-6">
        <button onClick={onExit} className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <X size={24} />
        </button>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: categoryColor }} />
          Focus Mode
        </div>
        <button onClick={() => setIsMuted(!isMuted)} className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-12">
        
        {/* Breathing Circle */}
        <div className="relative w-72 h-72 flex items-center justify-center">
            <div 
                className="absolute inset-0 rounded-full border border-white/10" 
                style={{ animation: isActive ? 'breathe 4s infinite ease-in-out' : 'none' }}
            />
             <div 
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/30 rotate-45" 
                style={{ animation: isActive ? 'spin 10s infinite linear' : 'none' }}
            />
            
            <div className="flex flex-col items-center">
                <span className="text-7xl font-mono font-bold tracking-tighter tabular-nums" style={{ textShadow: `0 0 30px ${categoryColor}` }}>
                    {formatTime(timeLeft)}
                </span>
                <span className="text-neutral-400 mt-2 font-medium tracking-widest text-xs uppercase">remaining</span>
            </div>
        </div>

        <div className="max-w-xs space-y-2">
            <h2 className="text-2xl font-bold">{task.title}</h2>
            <p className="text-neutral-400 text-sm">{task.notes || "Stay focused. You've got this."}</p>
        </div>

        <button 
            onClick={() => setIsActive(!isActive)}
            className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-glow"
        >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
      </div>

      {/* Footer / Slider */}
      <div className="relative z-10 w-full px-8 pb-12">
        <div className="relative h-16 bg-white/10 rounded-full overflow-hidden border border-white/10 group backdrop-blur-md">
          <div 
            className="absolute left-0 top-0 bottom-0 bg-success/80 transition-all duration-75"
            style={{ width: `${sliderValue}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className={`text-sm font-bold uppercase tracking-widest transition-opacity duration-300 ${sliderValue > 10 ? 'opacity-0' : 'opacity-60'}`}>
                Slide to Complete
            </span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sliderValue}
            onChange={handleSliderChange}
            onTouchEnd={handleSliderEnd}
            onMouseUp={handleSliderEnd}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div 
             className="absolute top-1 bottom-1 w-14 bg-white rounded-full shadow-lg flex items-center justify-center pointer-events-none transition-all duration-75"
             style={{ left: `calc(${sliderValue}% - ${sliderValue * 0.6}px)` }} 
          >
             <Check size={24} className="text-black" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;