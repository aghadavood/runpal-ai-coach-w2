import React from 'react';
import { Run } from '../types';
import { MapPin, Clock, Zap, X, Calendar, Share2, Heart, Map as MapIcon } from 'lucide-react';
import RouteMap from './RouteMap';

interface RunDetailModalProps {
  run: Run;
  onClose: () => void;
}

const RunDetailModal: React.FC<RunDetailModalProps> = ({ run, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in max-h-[90vh] md:max-h-[80vh]">
        
        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 md:hidden bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"
        >
          <X size={20} />
        </button>

        {/* Left Side: Visuals */}
        <div className="w-full md:w-1/2 bg-slate-100 flex flex-col h-full overflow-y-auto scrollbar-hide">
          {/* Main Photo */}
          <div className="relative h-64 md:h-1/2 min-h-[250px]">
            <img 
              src={run.imageUrl} 
              alt={run.route} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/30 mb-2">
                {run.mood.toUpperCase()} MOOD
              </div>
            </div>
          </div>
          
          {/* Map / Path View */}
          <div className="p-6 bg-slate-50 flex-1 border-t border-slate-200">
             <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold">
                <MapIcon size={18} className="text-indigo-600" />
                <h3>Run Path</h3>
             </div>
             
             <div className="w-full h-48 rounded-xl border border-slate-200 shadow-inner overflow-hidden relative z-0">
                <RouteMap id={run.id} className="w-full h-full" interactive={true} />
             </div>
             
             <p className="mt-4 text-xs text-slate-500 leading-relaxed">
               This route took you through <span className="font-semibold text-slate-700">{run.route}</span>. 
               {run.distance_km > 5 ? " A solid long-distance effort covering diverse terrain." : " A focused, high-energy session."}
             </p>
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col bg-white overflow-y-auto">
          {/* Desktop Close Button */}
          <div className="hidden md:flex justify-end mb-2">
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-800 transition-colors p-2 hover:bg-slate-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          {/* Header Info */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <Calendar size={16} />
              <span>{run.date}</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{run.route}</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium">
                {run.duration}
              </span>
              <span className="text-sm text-slate-400 hidden sm:inline">
                •
              </span>
              <span className="text-sm text-slate-600 italic">
                {run.photo_note}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center">
              <Zap className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-slate-800">{run.distance_km}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">km</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
              <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-slate-800">{run.duration.replace(' min', '')}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">min</div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
              <MapPin className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-slate-800">{run.pace.replace('/km', '')}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">/km</div>
            </div>
          </div>

          {/* Memory Section */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">AI Memory Journal</h3>
            <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 relative">
              <div className="absolute top-4 left-4 text-4xl text-indigo-200 font-serif opacity-50">"</div>
              <p className="text-slate-700 text-lg leading-relaxed italic relative z-10 text-center">
                {run.memory}
              </p>
              <div className="absolute bottom-0 right-4 text-4xl text-indigo-200 font-serif opacity-50 translate-y-2">"</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto flex gap-3">
            <button className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
              <Share2 size={18} />
              Share
            </button>
            <button className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
              <Heart size={18} />
              Love it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunDetailModal;