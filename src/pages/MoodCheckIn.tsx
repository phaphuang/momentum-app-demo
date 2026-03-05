import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Smile, Frown, Meh, Plus } from "lucide-react";
import { cn } from "../lib/utils";

export function MoodCheckIn() {
  const navigate = useNavigate();
  const [mood, setMood] = useState<number>(50);
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);

  const contexts = [
    { id: "work", label: "#Work" },
    { id: "post-workout", label: "#PostWorkout" },
    { id: "social", label: "#Social" },
    { id: "stress", label: "#Stress" },
    { id: "meal", label: "#Meal" },
  ];

  const toggleContext = (id: string) => {
    setSelectedContexts(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const getMoodIcon = () => {
    if (mood < 33) return <Frown className="w-16 h-16 text-stone-400" />;
    if (mood < 66) return <Meh className="w-16 h-16 text-yellow-500" />;
    return <Smile className="w-16 h-16 text-green-500" />;
  };

  const getMoodLabel = () => {
    if (mood < 33) return "Drained / Low";
    if (mood < 66) return "Neutral / Okay";
    return "Radiant / High";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col bg-white p-6 relative max-w-3xl mx-auto w-full rounded-2xl md:my-8 shadow-sm"
    >
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-stone-600 hover:text-stone-900">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-serif font-medium text-stone-800">Mood & Context</span>
        <div className="w-9" />
      </div>

      <div className="flex-1 flex flex-col items-center pt-8 space-y-12">
        <h2 className="text-3xl font-serif font-medium text-stone-900 text-center leading-tight">
          How are you feeling<br />right now?
        </h2>

        <div className="w-32 h-32 rounded-full bg-[#F5F5F0] flex items-center justify-center shadow-inner">
          {getMoodIcon()}
        </div>

        <div className="w-full space-y-6 px-4">
          <div className="flex justify-between text-xs font-medium tracking-wider uppercase text-stone-400">
            <span>Drained/Low</span>
            <span>Radiant/High</span>
          </div>
          
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={mood}
            onChange={(e) => setMood(parseInt(e.target.value))}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
          />
          
          <div className="text-center font-serif text-xl text-[#5A5A40] font-medium">
            {getMoodLabel()}
          </div>
        </div>

        <div className="w-full pt-8 border-t border-stone-100">
          <h3 className="text-sm font-medium text-stone-900 mb-4">Add Context</h3>
          <div className="flex flex-wrap gap-2">
            {contexts.map((context) => (
              <button
                key={context.id}
                onClick={() => toggleContext(context.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                  selectedContexts.includes(context.id)
                    ? "bg-[#5A5A40] text-white border-[#5A5A40]"
                    : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                )}
              >
                {context.label}
              </button>
            ))}
            <button className="px-4 py-2 rounded-full text-sm font-medium bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100 flex items-center space-x-1">
              <Plus className="w-4 h-4" />
              <span>Custom</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8 pb-6">
        <button 
          onClick={() => navigate("/success")}
          className="w-full py-4 bg-[#5A5A40] text-white rounded-full font-medium hover:bg-[#4A4A30] transition-colors shadow-md"
        >
          Save Check-in
        </button>
      </div>
    </motion.div>
  );
}
