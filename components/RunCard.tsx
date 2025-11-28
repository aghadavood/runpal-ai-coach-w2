import React from 'react';
import { Run } from '../types';
import { MapPin, Clock, Zap, Maximize2 } from 'lucide-react';
import RouteMap from './RouteMap';

interface RunCardProps {
  run: Run;
  onClick: (run: Run) => void;
}

const RunCard: React.FC<RunCardProps> = ({ run, onClick }) => {
  return (
    <div 
      onClick={() => onClick(run)}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col h-full cursor-pointer relative"
    >
      <div className="relative h-48 w-full overflow-hidden">
        {/* Main Image */}
        <img 
          src={run.imageUrl} 
          alt={`Run on ${run.date}`} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Map Overlay on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 bg-white">
            <RouteMap id={run.id} className="w-full h-full" minimal={true} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-slate-600 shadow-sm transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                View Details
              </div>
            </div>
        </div>

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-0" />
        
        {/* Expand Icon */}
        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/30 backdrop-blur-md p-2 rounded-full text-slate-800 shadow-lg hover:bg-white/50">
             <Maximize2 size={16} />
          </div>
        </div>

        {/* Info Overlay (Hidden on hover when map shows) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 group-hover:opacity-0 transition-opacity duration-300">
          <p className="text-white font-medium text-lg truncate">{run.route}</p>
          <p className="text-slate-200 text-sm">{run.date}</p>
        </div>

        {/* Mood Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-slate-700 shadow-sm z-20">
          {run.mood.toUpperCase()}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col relative z-20 bg-white">
        <div className="flex justify-between mb-4 text-slate-600 text-sm">
          <div className="flex items-center gap-1">
            <Zap size={16} className="text-orange-500" />
            <span>{run.distance_km} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-blue-500" />
            <span>{run.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={16} className="text-emerald-500" />
            <span>{run.pace}</span>
          </div>
        </div>
        
        <div className="mt-auto">
          <p className="text-slate-700 italic text-sm border-l-2 border-indigo-400 pl-3 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
            "{run.memory}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default RunCard;