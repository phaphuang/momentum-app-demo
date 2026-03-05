import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

export function Personalization() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>("rest");

  const options = [
    {
      id: "rest",
      title: "Rest & Recovery",
      description: "Focus on sleep hygiene and stress management.",
      image: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&q=80&w=400&h=200"
    },
    {
      id: "activity",
      title: "Consistent Activity",
      description: "Build a routine of daily movement and strength.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400&h=200"
    },
    {
      id: "mindful",
      title: "Mindful Energy",
      description: "Balance nutrition and mental clarity.",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400&h=200"
    }
  ];

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
        <span className="font-serif font-medium text-stone-800">Personalization</span>
        <div className="w-9" />
      </div>

      <div className="flex items-center justify-between mb-8 text-xs font-medium uppercase tracking-wider text-stone-500">
        <span>Initializing Life-Tree</span>
        <span>Step 3 of 4</span>
      </div>

      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-serif font-medium text-stone-900 leading-tight">
          Your journey starts with<br />a seed.
        </h2>
        <p className="text-stone-500">What is your primary focus this month?</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-24">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelected(option.id)}
            className={cn(
              "w-full text-left bg-white rounded-2xl overflow-hidden border-2 transition-all duration-200",
              selected === option.id ? "border-[#5A5A40] shadow-md" : "border-transparent shadow-sm hover:shadow-md"
            )}
          >
            <div className="h-32 w-full relative">
              <img src={option.image} alt={option.title} className="w-full h-full object-cover" />
              {selected === option.id && (
                <div className="absolute top-4 right-4 bg-white rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-[#5A5A40]" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-serif font-medium text-lg text-stone-900 mb-1">{option.title}</h3>
              <p className="text-stone-500 text-sm">{option.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#F5F5F0] via-[#F5F5F0] to-transparent">
        <button 
          onClick={() => navigate("/dashboard")}
          disabled={!selected}
          className="w-full py-4 bg-[#5A5A40] text-white rounded-full font-medium hover:bg-[#4A4A30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <span>Plant My Seed</span>
        </button>
      </div>
    </motion.div>
  );
}
