import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  PlusCircle, 
  Calendar,
  TrendingUp,
  Award,
  Upload,
  X,
  Loader2,
  Camera
} from 'lucide-react';
import { PAST_RUNS, SAFORA_PROFILE } from './constants';
import { AppView, Run } from './types';
import RunCard from './components/RunCard';
import RunDetailModal from './components/RunDetailModal';
import ChatInterface from './components/ChatInterface';
import { analyzeRunPhoto } from './services/gemini';

const calculatePace = (distance: number, duration: number): string => {
  if (distance <= 0) return "0:00/km";
  const paceDec = duration / distance;
  const minutes = Math.floor(paceDec);
  const seconds = Math.round((paceDec - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [runs, setRuns] = useState<Run[]>(PAST_RUNS);
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);
  
  // Log Run State
  const [newRunImage, setNewRunImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Calculated Stats
  const totalRuns = runs.length;
  const totalKm = runs.reduce((acc, run) => acc + run.distance_km, 0).toFixed(1);
  const streak = 5 + (runs.length - PAST_RUNS.length); 

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewRunImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setNewRunImage(null);
    setImagePreview(null);
  };

  const handleSaveRun = async () => {
    if (!newRunImage || !distance || !duration) return;

    setIsAnalyzing(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        // Strip data url prefix for API
        const base64Data = base64String.split(',')[1];
        const mimeType = base64String.split(';')[0].split(':')[1];

        const analysis = await analyzeRunPhoto(base64Data, mimeType);

        const newRun: Run = {
          id: Date.now().toString(),
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
          distance_km: parseFloat(distance),
          duration: `${duration} min`,
          pace: calculatePace(parseFloat(distance), parseFloat(duration)),
          route: "New Route", 
          mood: analysis.mood as any,
          photo_note: analysis.photo_note,
          memory: analysis.memory,
          imageUrl: base64String // Store local preview
        };

        setRuns(prev => [newRun, ...prev]);
        
        // Reset and navigate
        setNewRunImage(null);
        setImagePreview(null);
        setDistance('');
        setDuration('');
        setCurrentView(AppView.DASHBOARD);
      };
      reader.readAsDataURL(newRunImage);
    } catch (error) {
      console.error("Failed to save run", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 md:pb-0 font-sans">
      {/* Mobile-first Navigation (Bottom) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 md:hidden flex justify-around p-3 safe-area-bottom">
        <button 
          onClick={() => setCurrentView(AppView.DASHBOARD)}
          className={`flex flex-col items-center gap-1 text-xs font-medium ${currentView === AppView.DASHBOARD ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={24} />
          <span>Home</span>
        </button>
        <button 
          onClick={() => setCurrentView(AppView.LOG_RUN)}
          className="flex flex-col items-center gap-1 text-xs font-medium text-slate-400"
        >
          <div className={`rounded-full p-2 -mt-6 border-4 border-slate-50 shadow-lg text-white ${currentView === AppView.LOG_RUN ? 'bg-indigo-700' : 'bg-indigo-600'}`}>
            <PlusCircle size={24} />
          </div>
          <span className={currentView === AppView.LOG_RUN ? 'text-indigo-600' : ''}>Log Run</span>
        </button>
        <button 
          onClick={() => setCurrentView(AppView.CHAT)}
          className={`flex flex-col items-center gap-1 text-xs font-medium ${currentView === AppView.CHAT ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <MessageSquare size={24} />
          <span>Chat</span>
        </button>
      </nav>

      {/* Desktop Navigation (Top) */}
      <nav className="hidden md:block bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <Award size={20} />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">RunPal</span>
          </div>
          <div className="flex gap-8">
            <button 
              onClick={() => setCurrentView(AppView.DASHBOARD)}
              className={`text-sm font-medium transition-colors ${currentView === AppView.DASHBOARD ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentView(AppView.LOG_RUN)}
              className={`text-sm font-medium transition-colors ${currentView === AppView.LOG_RUN ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Log Run
            </button>
            <button 
              onClick={() => setCurrentView(AppView.CHAT)}
              className={`text-sm font-medium transition-colors ${currentView === AppView.CHAT ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Coach Chat
            </button>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right">
                <p className="text-sm font-semibold text-slate-700">{SAFORA_PROFILE.name}</p>
                <p className="text-xs text-slate-400">Streak: {streak} days</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 font-bold">
                S
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        
        {/* VIEW: DASHBOARD */}
        {currentView === AppView.DASHBOARD && (
          <div className="animate-fade-in space-y-8">
            
            {/* Header / Welcome */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, {SAFORA_PROFILE.name}</h1>
              <p className="text-slate-500 max-w-2xl">
                You've logged <span className="font-semibold text-indigo-600">{totalKm} km</span> this week. 
                Your visual journey is looking incredible.
              </p>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-indigo-500">
                  <TrendingUp size={18} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Streak</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{streak} <span className="text-sm font-normal text-slate-400">runs</span></p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-emerald-500">
                  <Calendar size={18} />
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Runs</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{totalRuns} <span className="text-sm font-normal text-slate-400">runs</span></p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 col-span-2 md:col-span-2 flex items-center justify-between">
                <div>
                   <div className="flex items-center gap-2 mb-1 text-orange-500">
                    <Award size={18} />
                    <span className="text-xs font-semibold uppercase tracking-wider">Latest Memory</span>
                  </div>
                  <p className="text-sm text-slate-600 italic">"{runs[0]?.memory || "Ready for your next run!"}"</p>
                </div>
                <button 
                  onClick={() => setCurrentView(AppView.CHAT)}
                  className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors"
                >
                  Talk to RunPal
                </button>
              </div>
            </div>

            {/* Memory Wall */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Your Memory Wall</h2>
                <span className="text-sm text-slate-500">Click a memory to revisit the path</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {runs.map((run) => (
                  <RunCard 
                    key={run.id} 
                    run={run} 
                    onClick={(r) => setSelectedRun(r)}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VIEW: CHAT */}
        {currentView === AppView.CHAT && (
          <div className="animate-fade-in h-full">
            <div className="mb-6 text-center md:text-left">
              <h1 className="text-2xl font-bold text-slate-800">Coach Chat</h1>
              <p className="text-slate-500 text-sm">Review your memories and plan your next run.</p>
            </div>
            <ChatInterface />
          </div>
        )}

        {/* VIEW: LOG RUN */}
        {currentView === AppView.LOG_RUN && (
          <div className="animate-fade-in max-w-lg mx-auto bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Log a New Run</h2>
            
            <div className="space-y-6">
              
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Photo Memory</label>
                {!imagePreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500"><span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-slate-400">PNG, JPG (RunPal will analyze the mood!)</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                  </label>
                ) : (
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-slate-600 hover:text-red-500 shadow-sm"
                    >
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-2 right-2 bg-indigo-600/90 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                       <Award size={12} />
                       Ready to analyze
                    </div>
                  </div>
                )}
              </div>

              {/* Stats Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Distance (km)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="5.0"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration (min)</label>
                  <input 
                    type="number" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="30"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleSaveRun}
                disabled={!imagePreview || !distance || !duration || isAnalyzing}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-md
                  ${(!imagePreview || !distance || !duration || isAnalyzing) 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
                  }
                `}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Analyzing Memory...
                  </>
                ) : (
                  <>
                    <Award size={24} />
                    Save & Analyze Run
                  </>
                )}
              </button>
              
              <p className="text-center text-xs text-slate-400">
                RunPal will automatically generate your memory and mood from the photo.
              </p>
            </div>
          </div>
        )}

        {/* Modals */}
        {selectedRun && (
          <RunDetailModal 
            run={selectedRun} 
            onClose={() => setSelectedRun(null)} 
          />
        )}

      </main>
    </div>
  );
};

export default App;