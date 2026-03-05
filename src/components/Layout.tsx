import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Home, BarChart2, Clock, User, Plus, Smile, Droplet, StretchHorizontal, Wind } from "lucide-react";
import { useState } from "react";

export function Layout() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col text-stone-800 font-sans">
      <Outlet />
    </div>
  );
}

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: BarChart2, label: "Stats", path: "/insight" },
    { icon: Plus, label: "Log", path: "action", isAction: true },
    { icon: Clock, label: "Time", path: "/time" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const handleQuickLog = async (actionType: string) => {
    try {
      const storedUser = localStorage.getItem("user");
      const userId = storedUser ? JSON.parse(storedUser).id : null;

      const response = await fetch('/api/log-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ actionType, userId }),
      });
      
      if (response.ok) {
        window.dispatchEvent(new Event('dashboard-data-updated'));
        setIsQuickLogOpen(false);
      }
    } catch (error) {
      console.error('Failed to log action:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex text-stone-800 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200 fixed h-full z-40">
        <div className="p-6">
          <h1 className="text-2xl font-serif font-medium text-stone-900">Momentum</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            if (item.isAction) {
              return (
                <button
                  key={item.label}
                  onClick={() => setIsQuickLogOpen(true)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-stone-600 hover:bg-stone-50 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 bg-[#5A5A40] text-white rounded-full flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Quick Log</span>
                </button>
              );
            }
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? "bg-stone-100 text-[#5A5A40]" : "text-stone-600 hover:bg-stone-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 relative min-h-screen flex flex-col pb-24 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 px-6 py-4 flex items-center justify-between z-40 pb-safe">
        {navItems.map((item) => {
          if (item.isAction) {
            return (
              <div key={item.label} className="relative -top-8">
                <button 
                  onClick={() => setIsQuickLogOpen(true)}
                  className="w-16 h-16 bg-[#5A5A40] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#4A4A30] transition-colors transform hover:scale-105 active:scale-95"
                >
                  <item.icon className="w-8 h-8" />
                </button>
              </div>
            );
          }
          const isActive = location.pathname === item.path;
          return (
            <button 
              key={item.label}
              onClick={() => navigate(item.path)} 
              className={`flex flex-col items-center transition-colors ${
                isActive ? "text-[#5A5A40]" : "text-stone-400 hover:text-stone-600"
              }`}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium tracking-wider uppercase">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Log Modal Overlay */}
      <AnimatePresence>
        {isQuickLogOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickLogOpen(false)}
              className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 left-0 right-0 md:w-[500px] md:rounded-[32px] bg-white rounded-t-[32px] p-6 z-50 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mb-8 md:hidden" />
              <h3 className="text-2xl font-serif font-medium text-stone-900 text-center mb-8">What's happening?</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button 
                  onClick={() => { setIsQuickLogOpen(false); navigate("/mood"); }}
                  className="bg-stone-50 hover:bg-stone-100 p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-colors border border-stone-100"
                >
                  <Smile className="w-8 h-8 text-yellow-500 mb-3" />
                  <span className="font-medium text-stone-900 mb-1">Mood Check-in</span>
                  <span className="text-xs text-stone-500">How are you?</span>
                </button>
                <button 
                  onClick={() => handleQuickLog('water')}
                  className="bg-stone-50 hover:bg-stone-100 p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-colors border border-stone-100"
                >
                  <Droplet className="w-8 h-8 text-blue-400 mb-3" />
                  <span className="font-medium text-stone-900 mb-1">Log Water</span>
                  <span className="text-xs text-stone-500">Stay hydrated</span>
                </button>
                <button 
                  onClick={() => handleQuickLog('rest')}
                  className="bg-stone-50 hover:bg-stone-100 p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-colors border border-stone-100"
                >
                  <StretchHorizontal className="w-8 h-8 text-green-500 mb-3" />
                  <span className="font-medium text-stone-900 mb-1">Active Rest</span>
                  <span className="text-xs text-stone-500">Stretch it out</span>
                </button>
                <button 
                  onClick={() => handleQuickLog('break')}
                  className="bg-stone-50 hover:bg-stone-100 p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-colors border border-stone-100"
                >
                  <Wind className="w-8 h-8 text-purple-400 mb-3" />
                  <span className="font-medium text-stone-900 mb-1">Micro-Break</span>
                  <span className="text-xs text-stone-500">Just breathe</span>
                </button>
              </div>
              
              <button 
                onClick={() => setIsQuickLogOpen(false)}
                className="w-full py-4 text-stone-500 font-medium hover:text-stone-800 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
