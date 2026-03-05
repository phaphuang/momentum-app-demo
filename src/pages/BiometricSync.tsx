import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Heart, Moon, Activity, Droplet, ArrowLeft, Lock } from "lucide-react";

export function BiometricSync() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-[#F5F5F0] p-6 relative max-w-3xl mx-auto w-full"
    >
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-stone-600 hover:text-stone-900">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-serif font-medium text-stone-800">Momentum</span>
        <div className="w-9" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <div className="relative w-64 h-64 rounded-full bg-stone-200/50 flex items-center justify-center">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-stone-500">
            <Heart className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium tracking-wider uppercase">Heart</span>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-stone-500">
            <Activity className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium tracking-wider uppercase">Activity</span>
          </div>
          <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center text-stone-500">
            <Moon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium tracking-wider uppercase">Sleep</span>
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center text-stone-500">
            <Droplet className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium tracking-wider uppercase">Vitals</span>
          </div>
          <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center">
            <Heart className="w-8 h-8 text-[#5A5A40]" />
          </div>
        </div>

        <div className="text-center space-y-4 px-4">
          <h2 className="text-3xl font-serif font-medium text-stone-900">Sync your vitals</h2>
          <p className="text-stone-500 leading-relaxed">
            Momentum works best when it knows your heart rate and sleep patterns.
          </p>
        </div>
      </div>

      <div className="space-y-4 mt-auto pt-8">
        <button 
          onClick={() => navigate("/personalization")}
          className="w-full py-4 bg-[#5A5A40] text-white rounded-full font-medium hover:bg-[#4A4A30] transition-colors"
        >
          Connect Health Data
        </button>
        <button 
          onClick={() => navigate("/personalization")}
          className="w-full py-4 text-stone-500 font-medium hover:text-stone-800 transition-colors"
        >
          Skip for now
        </button>
      </div>
      
      <div className="mt-8 flex items-center justify-center space-x-2 text-xs text-stone-400">
        <Lock className="w-3 h-3" />
        <span className="uppercase tracking-wider font-medium">Secure Encrypted Data Sync</span>
      </div>
    </motion.div>
  );
}
