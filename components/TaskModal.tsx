import React, { useState, useEffect } from 'react';
import { X, Clock, AlignLeft, Tag, Zap } from 'lucide-react';
import { Task, CategoryType } from '../types';
import { CATEGORIES } from '../constants';
import { getDurationString } from '../utils/timeUtils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  initialData?: Task | null;
  onDelete?: (id: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialData, onDelete }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>(CategoryType.FOCUS);
  const [startTime, setStartTime] = useState(9.0);
  const [endTime, setEndTime] = useState(10.0);
  const [notes, setNotes] = useState('');
  const [energyLevel, setEnergyLevel] = useState(2); // 1, 2, 3

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCategory(initialData.category);
      setStartTime(initialData.startTime);
      setEndTime(initialData.endTime);
      setNotes(initialData.notes || '');
      setEnergyLevel(initialData.energyLevel || 2);
    } else {
      // Reset defaults for new task
      setTitle('');
      setCategory(CategoryType.FOCUS);
      setStartTime(9.0);
      setEndTime(10.0);
      setNotes('');
      setEnergyLevel(2);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id,
      title,
      category,
      startTime,
      endTime,
      notes,
      completed: initialData?.completed || false,
      energyLevel
    });
    onClose();
  };

  const timeOptions = [];
  for (let i = 0; i < 24; i += 0.25) {
    const h = Math.floor(i);
    const m = (i % 1) * 60;
    const label = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    timeOptions.push({ value: i, label });
  }

  const energyLabels = { 1: 'Low 😌', 2: 'Medium ⚡', 3: 'High 🔥' };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-surface/90 border border-neutral-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-800">
            <h2 className="text-xl font-semibold text-white">
              {initialData ? 'Edit Task' : 'New Task'}
            </h2>
            <button 
              type="button" 
              onClick={onClose}
              className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
            
            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">What are you working on?</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task Name"
                className="w-full bg-transparent text-3xl font-bold text-white placeholder-neutral-700 border-b border-neutral-800 focus:border-primary focus:outline-none py-2 transition-colors"
                autoFocus
                required
              />
            </div>

            {/* Time Picker */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <Clock size={12} /> Start
                </label>
                <div className="relative">
                  <select 
                    value={startTime}
                    onChange={(e) => setStartTime(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none appearance-none"
                  >
                    {timeOptions.map(opt => (
                      <option key={`start-${opt.value}`} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <Clock size={12} /> End
                </label>
                <div className="relative">
                  <select 
                    value={endTime}
                    onChange={(e) => setEndTime(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white focus:border-primary focus:outline-none appearance-none"
                  >
                    {timeOptions.map(opt => (
                      <option key={`end-${opt.value}`} value={opt.value} disabled={opt.value <= startTime}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-center text-neutral-500 font-mono">
              Duration: {getDurationString(startTime, endTime)}
            </div>

            {/* Category Selector */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                <Tag size={12} /> Category
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(CATEGORIES).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all ${
                      category === cat.id 
                        ? 'bg-white text-black shadow-glow' 
                        : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy Level */}
            <div className="space-y-3">
               <label className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                <Zap size={12} /> Energy Required
              </label>
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between gap-4">
                 <span className="text-xl transition-all" style={{ opacity: energyLevel === 1 ? 1 : 0.3, filter: energyLevel === 1 ? 'none' : 'grayscale(100%)' }}>😌</span>
                 <input 
                   type="range" 
                   min="1" 
                   max="3" 
                   step="1"
                   value={energyLevel}
                   onChange={(e) => setEnergyLevel(Number(e.target.value))}
                   className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary"
                 />
                 <span className="text-xl transition-all" style={{ opacity: energyLevel === 3 ? 1 : 0.3, filter: energyLevel === 3 ? 'none' : 'grayscale(100%)' }}>🔥</span>
              </div>
              <div className="text-center text-xs text-primary font-medium">
                {energyLabels[energyLevel as keyof typeof energyLabels]}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                <AlignLeft size={12} /> Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add details..."
                rows={3}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-primary focus:outline-none resize-none"
              />
            </div>

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-800 bg-neutral-900/50 flex gap-3">
            {initialData && onDelete && (
               <button
               type="button"
               onClick={() => { onDelete(initialData.id); onClose(); }}
               className="px-6 py-3 rounded-xl font-medium text-error bg-error/10 hover:bg-error/20 transition-colors"
             >
               Delete
             </button>
            )}
            <button
              type="submit"
              className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-white/10"
            >
              {initialData ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;