import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Task } from '../types';
import { CATEGORIES } from '../constants';

interface AnalyticsProps {
  tasks: Task[];
}

const Analytics: React.FC<AnalyticsProps> = ({ tasks }) => {
  
  // Calculate duration per category
  const data = React.useMemo(() => {
    const map = new Map<string, number>();
    
    tasks.forEach(t => {
      let duration = t.endTime - t.startTime;
      if (duration < 0) duration += 24;
      const current = map.get(t.category) || 0;
      map.set(t.category, current + duration);
    });

    return Array.from(map.entries()).map(([key, value]) => ({
      name: CATEGORIES[key as any]?.label || key,
      value: Number(value.toFixed(1)),
      color: CATEGORIES[key as any]?.color || '#888'
    })).sort((a, b) => b.value - a.value);
  }, [tasks]);

  const totalHours = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 pb-32">
      <header>
        <h2 className="text-3xl font-bold mb-1">Insights</h2>
        <p className="text-neutral-500">How you spend your day</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface border border-neutral-800 p-4 rounded-2xl">
          <p className="text-neutral-500 text-xs uppercase font-bold tracking-wider mb-1">Scheduled</p>
          <p className="text-2xl font-mono text-white">{totalHours}h <span className="text-sm text-neutral-600">/ 24h</span></p>
        </div>
        <div className="bg-surface border border-neutral-800 p-4 rounded-2xl">
          <p className="text-neutral-500 text-xs uppercase font-bold tracking-wider mb-1">Productivity</p>
          <p className="text-2xl font-mono text-primary">
            {Math.round((totalHours / 24) * 100)}%
          </p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-surface border border-neutral-800 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-6">Distribution</h3>
        <div className="h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F1F1F', border: 'none', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => [`${value}h`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <span className="text-2xl font-bold text-white">{data.length}</span>
              <p className="text-xs text-neutral-500 uppercase">Areas</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-sm text-neutral-300">{d.name}</span>
              <span className="text-xs text-neutral-500 ml-auto font-mono">{d.value}h</span>
            </div>
          ))}
        </div>
      </div>

       {/* Bar Chart Mockup */}
       <div className="bg-surface border border-neutral-800 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-6">Focus Trend</h3>
        <div className="h-48 w-full">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={[{day: 'M', v: 4}, {day: 'T', v: 6}, {day: 'W', v: 3}, {day: 'T', v: 8}, {day: 'F', v: 5}, {day: 'S', v: 2}, {day: 'S', v: 1}]}>
               <XAxis dataKey="day" stroke="#444" tick={{fill: '#666'}} axisLine={false} tickLine={false} />
               <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1F1F1F', border: 'none' }} />
               <Bar dataKey="v" fill="#333" radius={[4, 4, 4, 4]} activeBar={{fill: '#00D9FF'}} />
             </BarChart>
           </ResponsiveContainer>
        </div>
       </div>

    </div>
  );
};

export default Analytics;
