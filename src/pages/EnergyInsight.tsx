import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, MoreVertical, Leaf, Droplet, Wind, CheckCircle2, Timer } from "lucide-react";

export function EnergyInsight() {
  const navigate = useNavigate();
  const [waterLogged, setWaterLogged] = useState(false);
  const [breathingStarted, setBreathingStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const handleLogWater = async () => {
    setWaterLogged(true);
    try {
      const storedUser = localStorage.getItem("user");
      const userId = storedUser ? JSON.parse(storedUser).id : null;
      
      const response = await fetch('/api/log-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType: 'water', userId }),
      });
      if (response.ok) {
        window.dispatchEvent(new Event('dashboard-data-updated'));
      }
    } catch (error) {
      console.error('Failed to log water:', error);
    }
    setTimeout(() => setWaterLogged(false), 3000);
  };

  const handleStartBreathing = async () => {
    setBreathingStarted(true);
    setTimeLeft(60);
    
    try {
      const storedUser = localStorage.getItem("user");
      const userId = storedUser ? JSON.parse(storedUser).id : null;

      const response = await fetch('/api/log-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType: 'break', userId }),
      });
      if (response.ok) {
        window.dispatchEvent(new Event('dashboard-data-updated'));
      }
    } catch (error) {
      console.error('Failed to log breathing break:', error);
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setBreathingStarted(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-[#F5F5F0] relative"
    >
      <div className="flex items-center justify-between p-6 md:p-8 pb-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-stone-600 hover:text-stone-900 md:hidden">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-serif font-medium text-stone-800 tracking-wider uppercase text-sm md:text-xl">Energy Insight</span>
        <button className="p-2 -mr-2 text-stone-600 hover:text-stone-900">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-[32px] overflow-hidden shadow-sm">
            <div className="h-48 relative">
              <img 
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800&h=400" 
                alt="Forest path" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
              <h2 className="absolute bottom-6 left-6 text-2xl font-serif font-medium text-white">Momentum Insight</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center space-x-2 text-[#5A5A40] mb-2">
                  <Leaf className="w-4 h-4" />
                  <span className="text-xs font-medium tracking-wider uppercase">AI Coach Advice</span>
                </div>
                <h3 className="text-xl font-serif font-medium text-stone-900 mb-2">Your Life-Tree status</h3>
                <p className="text-stone-600 leading-relaxed italic">
                  "You've logged high stress but low hydration. Your 'Life-Tree' needs a drink to stay green."
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-[#F5F5F0] flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-[#5A5A40]" />
                  </div>
                  <div>
                    <div className="text-xs font-medium tracking-wider uppercase text-stone-500 mb-1">Hydration Level</div>
                    <div className="text-lg font-serif font-medium text-stone-900">40%</div>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-stone-100 flex items-center justify-center relative">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-stone-100" />
                    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="175" strokeDashoffset="105" className="text-blue-400" />
                  </svg>
                  <Droplet className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium tracking-widest uppercase text-stone-500 mb-4 ml-2">Recommended Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={handleLogWater}
                disabled={waterLogged}
                className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${waterLogged ? 'bg-green-50' : 'bg-blue-50 group-hover:bg-blue-100'}`}>
                    {waterLogged ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Droplet className="w-5 h-5 text-blue-500" />}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-stone-900">{waterLogged ? "Water Logged!" : "Log 16oz Water"}</div>
                    <div className="text-xs text-stone-500">{waterLogged ? "Your Life-Tree thanks you" : "Instantly boost your Life-Tree"}</div>
                  </div>
                </div>
                {!waterLogged && <ArrowLeft className="w-5 h-5 text-stone-300 transform rotate-180 group-hover:text-stone-500 transition-colors" />}
              </button>
              <button 
                onClick={handleStartBreathing}
                disabled={breathingStarted}
                className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${breathingStarted ? 'bg-purple-100 animate-pulse' : 'bg-purple-50 group-hover:bg-purple-100'}`}>
                    {breathingStarted ? <Timer className="w-5 h-5 text-purple-500" /> : <Wind className="w-5 h-5 text-purple-500" />}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-stone-900">{breathingStarted ? `Breathing... ${timeLeft}s` : "Start 1-Min Breathing"}</div>
                    <div className="text-xs text-stone-500">{breathingStarted ? "Inhale slowly, exhale deeply" : "Reduce stress levels immediately"}</div>
                  </div>
                </div>
                {!breathingStarted && <ArrowLeft className="w-5 h-5 text-stone-300 transform rotate-180 group-hover:text-stone-500 transition-colors" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
