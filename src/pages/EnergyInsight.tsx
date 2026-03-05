import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, MoreVertical, Activity, Droplet, Wind, CheckCircle2, Timer } from "lucide-react";

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
      className="flex-1 flex flex-col bg-[#f8f9fa] relative"
    >
      <div className="flex items-center justify-between p-5 md:p-8 bg-white border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 md:hidden">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <span className="font-semibold text-gray-900 text-lg">Statistics</span>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50">
          <MoreVertical className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 md:px-8 py-6 space-y-5 max-w-7xl mx-auto w-full">
        <div className="space-y-5">
          <div className="bg-blue-50 rounded-3xl p-5 border border-blue-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Calories</h3>
                  <p className="text-xs text-gray-500">Sedentary lifestyle</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">850</div>
                <div className="text-xs text-gray-500">kcal</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">256g</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wide">Carbo</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">200g</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wide">Proteins</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">350g</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wide">Fats</div>
              </div>
            </div>

            <div className="relative h-32 flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="60" fill="none" stroke="#e0e7ff" strokeWidth="12" />
                <circle cx="80" cy="80" r="60" fill="none" stroke="#1e3a5f" strokeWidth="12" strokeDasharray="377" strokeDashoffset="150" strokeLinecap="round" />
              </svg>
              <div className="absolute text-center">
                <div className="text-2xl font-bold text-gray-900">1500</div>
                <div className="text-xs text-gray-500">kcal</div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-3xl p-5 border border-orange-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Wind className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Weight</h3>
                  <p className="text-xs text-gray-500">53.8kg - 63kg perfect for you!</p>
                </div>
              </div>
            </div>

            <div className="text-5xl font-bold text-gray-900 mb-4">74</div>

            <div className="h-20 relative">
              <svg className="w-full h-full">
                <polyline
                  points="0,60 40,50 80,45 120,55 160,40 200,35 240,45 280,35 320,40"
                  fill="none"
                  stroke="#ff8c42"
                  strokeWidth="3"
                  className="drop-shadow-sm"
                />
                <circle cx="240" cy="45" r="5" fill="#ff8c42" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-orange-50 via-transparent to-transparent opacity-40 pointer-events-none" style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fed7aa 2px, #fed7aa 3px)'
              }} />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3 ml-1">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleLogWater}
                disabled={waterLogged}
                className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all border border-gray-100 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${waterLogged ? 'bg-green-50' : 'bg-blue-50 group-hover:bg-blue-100'}`}>
                    {waterLogged ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Droplet className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 text-sm">{waterLogged ? "Water Logged!" : "Log Water"}</div>
                    <div className="text-xs text-gray-500">{waterLogged ? "Great job staying hydrated" : "Stay hydrated today"}</div>
                  </div>
                </div>
                {!waterLogged && <ArrowLeft className="w-4 h-4 text-gray-300 transform rotate-180 group-hover:text-gray-500 transition-colors" />}
              </button>
              <button
                onClick={handleStartBreathing}
                disabled={breathingStarted}
                className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all border border-gray-100 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${breathingStarted ? 'bg-orange-100 animate-pulse' : 'bg-orange-50 group-hover:bg-orange-100'}`}>
                    {breathingStarted ? <Timer className="w-5 h-5 text-orange-600" /> : <Wind className="w-5 h-5 text-orange-600" />}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 text-sm">{breathingStarted ? `Breathing... ${timeLeft}s` : "Breathing Exercise"}</div>
                    <div className="text-xs text-gray-500">{breathingStarted ? "Inhale slowly, exhale deeply" : "Reduce stress in 1 minute"}</div>
                  </div>
                </div>
                {!breathingStarted && <ArrowLeft className="w-4 h-4 text-gray-300 transform rotate-180 group-hover:text-gray-500 transition-colors" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
