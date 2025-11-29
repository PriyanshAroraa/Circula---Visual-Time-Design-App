import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader } from 'lucide-react';
import { generateSchedule } from '../services/geminiService';
import { Task } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface GeminiPlannerProps {
  onPlanGenerated: (tasks: Task[]) => void;
}

const GeminiPlanner: React.FC<GeminiPlannerProps> = ({ onPlanGenerated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');

    try {
      const result = await generateSchedule(prompt);
      
      // Transform raw JSON to Task objects with IDs
      const newTasks: Task[] = result.map((item: any) => ({
        id: uuidv4(),
        title: item.title,
        category: item.category,
        startTime: item.startTime,
        endTime: item.endTime,
        notes: item.notes,
        completed: false
      }));

      onPlanGenerated(newTasks);
      setIsOpen(false);
      setPrompt('');
    } catch (err) {
      setError('Failed to generate schedule. Please check API Key or try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-30 p-3 bg-neutral-800/80 backdrop-blur-md text-primary rounded-full hover:bg-neutral-700 transition-colors border border-neutral-700 shadow-lg"
      >
        <Sparkles size={20} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-surface border border-neutral-800 rounded-2xl p-6 shadow-2xl relative">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-neutral-500 hover:text-white"
        >
          <Loader size={20} className={loading ? "animate-spin" : "opacity-0"} />
          {!loading && "Close"}
        </button>

        <div className="flex items-center gap-3 mb-4 text-primary">
          <Sparkles size={24} />
          <h2 className="text-xl font-bold text-white">Magic Plan</h2>
        </div>

        <p className="text-neutral-400 text-sm mb-6">
          Describe your ideal day or list your to-dos. AI will organize them into a schedule.
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., I want to wake up at 7, exercise for an hour, work on my project until lunch, and read in the evening."
          className="w-full h-32 bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white focus:border-primary focus:outline-none resize-none mb-4 placeholder-neutral-600"
          autoFocus
        />

        {error && <p className="text-error text-xs mb-4">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>Generating <Loader className="animate-spin" size={16} /></>
          ) : (
            <>Generate Schedule <ArrowRight size={16} /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default GeminiPlanner;
