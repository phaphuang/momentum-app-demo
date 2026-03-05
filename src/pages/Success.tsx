import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle2, Zap, Share2 } from "lucide-react";

export function Success() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex-1 flex flex-col bg-[#F5F5F0] p-6 relative max-w-3xl mx-auto w-full"
    >
      <div className="flex items-center justify-center mb-8 pt-4">
        <CheckCircle2 className="w-5 h-5 text-[#5A5A40] mr-2" />
        <span className="font-serif font-medium text-stone-800 tracking-wider uppercase text-sm">Daily Success</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.2 }}
          className="relative w-48 h-48 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-green-100 to-yellow-50 opacity-50" />
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400&h=400" 
            alt="Flourishing tree" 
            className="w-full h-full object-cover rounded-full p-2"
          />
        </motion.div>

        <div className="text-center space-y-4 px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-serif font-medium text-stone-900"
          >
            Momentum<br />Maintained!
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-stone-500 leading-relaxed max-w-[260px] mx-auto"
          >
            You've balanced your energy for today. Your Life-Tree is flourishing.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl p-6 shadow-sm w-full max-w-[280px]"
        >
          <div className="flex items-center space-x-2 text-stone-800 font-medium mb-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span>Energy Balance</span>
          </div>
          <div className="flex items-end space-x-2">
            <span className="text-4xl font-serif font-medium text-stone-900">100%</span>
            <span className="text-sm font-medium text-green-500 mb-1">+5% today</span>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-4 mt-auto pt-8 pb-6"
      >
        <button 
          onClick={() => navigate("/dashboard")}
          className="w-full py-4 bg-[#5A5A40] text-white rounded-full font-medium hover:bg-[#4A4A30] transition-colors shadow-md"
        >
          Back to Dashboard
        </button>
        <button className="w-full py-4 text-stone-500 font-medium hover:text-stone-800 transition-colors flex items-center justify-center space-x-2">
          <Share2 className="w-5 h-5" />
          <span>Share Progress</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
