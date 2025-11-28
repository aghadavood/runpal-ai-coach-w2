import React, { useState, useRef, useEffect } from 'react';
import { Navigation, Plus, Minus, RotateCcw } from 'lucide-react';

interface RouteMapProps {
  id: string;
  className?: string;
  minimal?: boolean;
  interactive?: boolean;
}

const RouteMap: React.FC<RouteMapProps> = ({ id, className = "", minimal = false, interactive = false }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Reset zoom/pan when id changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [id]);

  // Deterministic random generator for consistent paths per run
  const getPseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const generatePath = () => {
    let seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // SVG viewBox 300x150
    const width = 300;
    const height = 150;
    
    // Start point
    let x = 30;
    let y = height / 2 + (getPseudoRandom(seed++) - 0.5) * 60;
    const points = [`${x},${y}`];
    
    // Create random number of segments
    const segments = 6 + Math.floor(getPseudoRandom(seed++) * 5); 

    for (let i = 0; i < segments; i++) {
      const moveX = 20 + getPseudoRandom(seed++) * 30; // Move generally right
      const moveY = (getPseudoRandom(seed++) - 0.5) * 60; // Move up/down
      
      x += moveX;
      y += moveY;
      
      // Keep in bounds with padding
      y = Math.max(20, Math.min(height - 20, y));
      x = Math.min(width - 20, x);
      
      points.push(`${x},${y}`);
    }

    const startPoint = points[0].split(',');
    const endPoint = points[points.length - 1].split(',');

    return {
      pathData: points.join(' '),
      start: { x: parseFloat(startPoint[0]), y: parseFloat(startPoint[1]) },
      end: { x: parseFloat(endPoint[0]), y: parseFloat(endPoint[1]) }
    };
  };

  const { pathData, start, end } = generatePath();

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!interactive || !isDragging) return;
    e.preventDefault();
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
      setIsDragging(false);
      if (interactive) {
          (e.target as Element).releasePointerCapture(e.pointerId);
      }
  };

  const adjustZoom = (delta: number) => {
      setScale(prev => Math.min(Math.max(1, prev + delta), 4));
  };
  
  const resetMap = () => {
      setScale(1);
      setPosition({x: 0, y: 0});
  };

  return (
    <div 
        className={`relative overflow-hidden bg-slate-50 select-none ${className} ${interactive ? 'cursor-grab touch-none' : ''} ${isDragging ? 'cursor-grabbing' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
    >
       <div 
         className="w-full h-full origin-center"
         style={{ 
             transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
             transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
         }}
       >
           {/* Abstract Map Background */}
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ 
               backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', 
               backgroundSize: '15px 15px'
           }}></div>
           
           {/* Decorative road lines */}
           <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" viewBox="0 0 300 150" preserveAspectRatio="none">
              <path d="M-20,100 Q150,20 320,80" fill="none" stroke="#000" strokeWidth="15" />
              <path d="M100,-20 L120,170" fill="none" stroke="#000" strokeWidth="10" />
           </svg>

           {/* The Run Path */}
           <svg className="absolute inset-0 w-full h-full z-10 p-2" viewBox="0 0 300 150" preserveAspectRatio="none">
              <defs>
                 <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
                   <feGaussianBlur stdDeviation="2" result="blur" />
                   <feComposite in="SourceGraphic" in2="blur" operator="over" />
                 </filter>
                 <linearGradient id={`pathGradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#4f46e5" /> {/* Indigo */}
                   <stop offset="100%" stopColor="#ec4899" /> {/* Pink */}
                 </linearGradient>
              </defs>
              
              {/* Path Shadow */}
              <polyline 
                 points={pathData} 
                 fill="none" 
                 stroke="rgba(0,0,0,0.1)" 
                 strokeWidth="6" 
                 strokeLinecap="round" 
                 strokeLinejoin="round"
                 transform="translate(2, 3)"
              />

              {/* Actual Path */}
              <polyline 
                 points={pathData} 
                 fill="none" 
                 stroke={`url(#pathGradient-${id})`} 
                 strokeWidth="4" 
                 strokeLinecap="round" 
                 strokeLinejoin="round"
                 filter={`url(#glow-${id})`}
                 className="drop-shadow-sm"
              />
              
              {/* Start Marker (Green Dot) */}
              <circle cx={start.x} cy={start.y} r={minimal ? 4 : 5} fill="#10b981" stroke="white" strokeWidth="2" />
              
              {/* End Marker (Flag/Pin) */}
              <g transform={`translate(${end.x}, ${end.y - 14})`}>
                 <path d="M0,14 L0,0 L8,4 L0,8" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" strokeLinejoin="round" />
                 <circle cx="0" cy="14" r="2" fill="#ef4444" />
              </g>
           </svg>
       </div>

       {/* Interactive Controls */}
       {interactive && (
         <div className="absolute bottom-2 right-2 flex flex-col gap-1 z-20">
             <button 
                onClick={(e) => { e.stopPropagation(); adjustZoom(0.5); }} 
                className="p-1.5 bg-white/90 backdrop-blur rounded-lg shadow-sm text-slate-700 hover:bg-white hover:text-indigo-600 border border-slate-200 transition-colors"
                title="Zoom In"
            >
                <Plus size={16}/>
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); adjustZoom(-0.5); }} 
                className="p-1.5 bg-white/90 backdrop-blur rounded-lg shadow-sm text-slate-700 hover:bg-white hover:text-indigo-600 border border-slate-200 transition-colors"
                title="Zoom Out"
             >
                <Minus size={16}/>
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); resetMap(); }} 
                className="p-1.5 bg-white/90 backdrop-blur rounded-lg shadow-sm text-slate-700 hover:bg-white hover:text-indigo-600 border border-slate-200 transition-colors"
                title="Reset View"
             >
                <RotateCcw size={16}/>
             </button>
         </div>
       )}

       {!minimal && !interactive && (
         <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono text-slate-500 border border-slate-100 flex items-center gap-1">
           <Navigation size={10} />
           GPS TRACK
         </div>
       )}
    </div>
  );
};

export default RouteMap;