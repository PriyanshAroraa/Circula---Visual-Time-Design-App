
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Task } from '../types';
import { CATEGORIES } from '../constants';
import { timeToAngle, angleToTime } from '../utils/timeUtils';

interface RadialTimelineProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  onTimeSelect: (time: number) => void;
  width?: number;
  height?: number;
}

const RadialTimeline: React.FC<RadialTimelineProps> = ({ tasks, onTaskSelect, onTimeSelect, width = 360, height = 360 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Interaction State
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [interactionStart, setInteractionStart] = useState<{angle: number, time: number} | null>(null);

  // Responsive dimensions
  const outerRadius = Math.min(width, height) / 2 - 20;
  const innerRadius = outerRadius * 0.65;
  const labelRadius = outerRadius + 15;

  // --- Interaction Handlers ---

  const getAngleFromEvent = (clientX: number, clientY: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(clientY - cy, clientX - cx); 
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    
    const startAngle = getAngleFromEvent(e.clientX, e.clientY);
    setInteractionStart({ angle: startAngle, time: Date.now() });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !interactionStart) return;
    
    const currentAngle = getAngleFromEvent(e.clientX, e.clientY);
    const delta = currentAngle - interactionStart.angle;
    setRotation((delta * 180) / Math.PI);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !interactionStart) return;
    
    const clickDuration = Date.now() - interactionStart.time;
    const dragDistance = Math.abs(rotation);
    
    if (dragDistance < 5 && clickDuration < 300) {
      handleDialClick(e.clientX, e.clientY);
    }

    setIsDragging(false);
    setRotation(0); // Spring back
    setInteractionStart(null);
  };

  const handleDialClick = (clientX: number, clientY: number) => {
    const rawAngle = getAngleFromEvent(clientX, clientY);
    let clockAngle = rawAngle + Math.PI / 2;
    const rotationRad = (rotation * Math.PI) / 180;
    clockAngle -= rotationRad;
    const time = angleToTime(clockAngle);
    onTimeSelect(time);
  };


  // --- D3 Rendering ---
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // --- Definitions (Gradients & Filters) ---
    const defs = svg.append("defs");

    // 1. Liquid Distortion Filter
    // Combines turbulence (noise) with displacement to create a watery/glassy edge
    const liquidFilter = defs.append("filter")
        .attr("id", "liquid")
        .attr("x", "-20%")
        .attr("y", "-20%")
        .attr("width", "140%")
        .attr("height", "140%");
    
    liquidFilter.append("feTurbulence")
        .attr("type", "fractalNoise")
        .attr("baseFrequency", "0.02") // Controls the frequency of the waves
        .attr("numOctaves", "3")
        .attr("seed", "1")
        .attr("result", "noise");
    
    liquidFilter.append("feDisplacementMap")
        .attr("in", "SourceGraphic")
        .attr("in2", "noise")
        .attr("scale", "3") // Controls the intensity of the distortion
        .attr("xChannelSelector", "R")
        .attr("yChannelSelector", "G");

    // 2. Inner Glow Filter for "Glass" segments
    const glowFilter = defs.append("filter").attr("id", "glow");
    glowFilter.append("feGaussianBlur").attr("stdDeviation", "2").attr("result", "coloredBlur");
    const feMerge = glowFilter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // 3. Gradients for each category
    Object.values(CATEGORIES).forEach(cat => {
        const grad = defs.append("linearGradient")
            .attr("id", `grad-${cat.id}`)
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%"); // Diagonal gradient
        
        // Start color (base)
        grad.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", cat.color)
            .attr("stop-opacity", 0.8);
            
        // End color (darker or lighter for depth)
        grad.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", d3.color(cat.color)?.brighter(0.5)?.toString() || cat.color)
            .attr("stop-opacity", 0.9);
    });


    // Main Group
    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // --- Background Ring (Glass) ---
    const bgArc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    // Subtle glass background ring
    g.append("path")
      .attr("d", bgArc as any)
      .attr("fill", "rgba(255, 255, 255, 0.03)")
      .attr("stroke", "rgba(255, 255, 255, 0.05)")
      .attr("stroke-width", 1)
      .style("cursor", "crosshair");

    // --- Time Markers ---
    const hours = d3.range(0, 24);
    g.selectAll(".hour-marker")
      .data(hours)
      .enter()
      .append("line")
      .attr("class", "hour-marker")
      .attr("x1", 0)
      .attr("y1", -outerRadius)
      .attr("x2", 0)
      .attr("y2", -innerRadius + 8)
      .attr("stroke", (d) => d % 3 === 0 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)")
      .attr("stroke-width", (d) => d % 6 === 0 ? 1.5 : 1)
      .attr("stroke-linecap", "round")
      .attr("transform", (d) => `rotate(${d * 15})`);

    // --- Labels ---
    const mainHours = [0, 6, 12, 18];
    g.selectAll(".hour-label")
      .data(mainHours)
      .enter()
      .append("text")
      .attr("class", "font-mono text-[10px] fill-neutral-500 select-none pointer-events-none")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .attr("transform", (d) => {
        const angle = (d * 15 - 90) * (Math.PI / 180);
        const x = Math.cos(angle) * labelRadius;
        const y = Math.sin(angle) * labelRadius;
        return `translate(${x},${y})`;
      })
      .text((d) => d.toString().padStart(2, '0'));

    // --- Task Arcs (Liquid Glass) ---
    const arcGenerator = d3.arc<Task>()
      .innerRadius(innerRadius + 4)
      .outerRadius(outerRadius - 4)
      .startAngle(d => timeToAngle(d.startTime))
      .endAngle(d => timeToAngle(d.endTime))
      .padAngle(0.04) // More gap for separation
      .cornerRadius(8); // Softer corners

    const taskGroups = g.selectAll(".task-group")
      .data(tasks)
      .enter()
      .append("g")
      .attr("class", "task-group");
    
    taskGroups.append("path")
      .attr("d", arcGenerator as any)
      .attr("fill", d => `url(#grad-${d.category})`)
      .attr("stroke", "rgba(255,255,255,0.2)") // Inner highlight stroke
      .attr("stroke-width", 0.5)
      .style("filter", "url(#liquid)") // Apply distortion
      .style("cursor", "pointer")
      .style("mix-blend-mode", "screen") // Blending for luminosity
      .on("mouseover", function() { d3.select(this).style("filter", "url(#glow) url(#liquid)"); }) // Enhanced glow on hover
      .on("mouseout", function() { d3.select(this).style("filter", "url(#liquid)"); })
      .on("click", (event, d) => {
        event.stopPropagation();
        onTaskSelect(d);
      });

    // --- Current Time Indicator ---
    const now = new Date();
    const currentHours = now.getHours() + now.getMinutes() / 60;
    const currentAngleDeg = currentHours * 15;

    // Glowing line
    g.append("line")
      .attr("x1", 0)
      .attr("y1", -innerRadius + 12)
      .attr("x2", 0)
      .attr("y2", -outerRadius - 2)
      .attr("stroke", "#00D9FF")
      .attr("stroke-width", 1.5)
      .attr("stroke-linecap", "round")
      .attr("transform", `rotate(${currentAngleDeg})`)
      .style("filter", "drop-shadow(0 0 6px #00D9FF)");
    
    // Glowing dot
    g.append("circle")
      .attr("cx", 0)
      .attr("cy", -outerRadius - 2)
      .attr("r", 3)
      .attr("fill", "#00D9FF")
      .attr("transform", `rotate(${currentAngleDeg})`)
      .style("filter", "drop-shadow(0 0 8px #00D9FF)");

  }, [tasks, width, height, innerRadius, outerRadius, onTaskSelect, labelRadius]);

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center touch-none select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ width, height }}
    >
      <div 
        className="will-change-transform"
        style={{ 
          transform: `rotate(${rotation}deg)`,
          transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transformOrigin: 'center center'
        }}
      >
        <svg 
          ref={svgRef} 
          width={width} 
          height={height} 
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        />
      </div>

      {/* Center Glass Hub */}
      <div 
        className="absolute rounded-full flex flex-col items-center justify-center text-center z-10 pointer-events-none"
        style={{ 
          width: innerRadius * 1.55, 
          height: innerRadius * 1.55,
          background: 'radial-gradient(130% 130% at 30% 30%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.4) 100%)', // Subtle gradient
          backdropFilter: 'blur(12px)', // Strong blur
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.3)' // Inner depth + outer drop shadow
        }}
      >
        {/* Shine reflection */}
        <div className="absolute top-4 left-4 w-1/3 h-1/3 bg-white/5 rounded-full blur-xl pointer-events-none" />

        <h3 className="text-neutral-500 text-[9px] font-bold tracking-[0.2em] uppercase mb-1 opacity-70">Current</h3>
        <p className="text-white text-3xl font-mono font-medium tracking-tighter drop-shadow-lg">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
        </p>
        
        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent my-3" />
        
        <p className="text-cyan-400 text-[10px] font-medium max-w-[90px] truncate drop-shadow-md">
          {tasks.find(t => {
            const h = new Date().getHours() + new Date().getMinutes()/60;
            return h >= t.startTime && h < t.endTime;
          })?.title || "Free Time"}
        </p>
      </div>
    </div>
  );
};

export default RadialTimeline;
