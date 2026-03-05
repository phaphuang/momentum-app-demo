import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Hop as Home, ChartBar as BarChart2, Clock, User, Plus, Smile, Droplet, StretchHorizontal, Wind } from "lucide-react";
import { useState } from "react";

export function Layout() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-gray-800 font-sans">
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
    { icon: BarChart2, label: "Discover", path: "/insight" },
    { icon: Plus, label: "Log", path: "action", isAction: true },
    { icon: Clock, label: "Community", path: "/time" },
    { icon: User, label: "Premium", path: "/profile" },
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
    <div className="min-h-screen bg-[#f8f9fa] flex text-gray-800 font-sans">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 fixed h-full z-40">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-900">Momentum</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            if (item.isAction) {
              return (
                <button
                  key={item.label}
                  onClick={() => setIsQuickLogOpen(true)}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center">
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
                  isActive ? "bg-blue-50 text-[#1e3a5f]" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 md:ml-64 relative min-h-screen flex flex-col pb-24 md:pb-0">
        <Outlet />
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-between z-40 shadow-lg pb-safe">
        {navItems.map((item) => {
          if (item.isAction) {
            return (
              <div key={item.label} className="relative -top-6">
                <button
                  onClick={() => setIsQuickLogOpen(true)}
                  className="w-14 h-14 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#2d4a6f] transition-all transform hover:scale-105 active:scale-95"
                >
                  <item.icon className="w-6 h-6" />
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
                isActive ? "text-[#1e3a5f]" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <item.icon className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {isQuickLogOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickLogOpen(false)}
              className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 left-0 right-0 md:w-[500px] md:rounded-3xl bg-white rounded-t-3xl p-6 z-50 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 md:hidden" />
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">Quick Log</h3>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => { setIsQuickLogOpen(false); navigate("/mood"); }}
                  className="bg-yellow-50 hover:bg-yellow-100 p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all border border-yellow-100 hover:shadow-md"
                >
                  <Smile className="w-7 h-7 text-yellow-600 mb-2" />
                  <span className="font-medium text-gray-900 text-sm mb-0.5">Mood Check-in</span>
                  <span className="text-[10px] text-gray-500">How are you?</span>
                </button>
                <button
                  onClick={() => handleQuickLog('water')}
                  className="bg-blue-50 hover:bg-blue-100 p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all border border-blue-100 hover:shadow-md"
                >
                  <Droplet className="w-7 h-7 text-blue-500 mb-2" />
                  <span className="font-medium text-gray-900 text-sm mb-0.5">Log Water</span>
                  <span className="text-[10px] text-gray-500">Stay hydrated</span>
                </button>
                <button
                  onClick={() => handleQuickLog('rest')}
                  className="bg-green-50 hover:bg-green-100 p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all border border-green-100 hover:shadow-md"
                >
                  <StretchHorizontal className="w-7 h-7 text-green-600 mb-2" />
                  <span className="font-medium text-gray-900 text-sm mb-0.5">Active Rest</span>
                  <span className="text-[10px] text-gray-500">Stretch it out</span>
                </button>
                <button
                  onClick={() => handleQuickLog('break')}
                  className="bg-orange-50 hover:bg-orange-100 p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all border border-orange-100 hover:shadow-md"
                >
                  <Wind className="w-7 h-7 text-orange-500 mb-2" />
                  <span className="font-medium text-gray-900 text-sm mb-0.5">Micro-Break</span>
                  <span className="text-[10px] text-gray-500">Just breathe</span>
                </button>
              </div>

              <button
                onClick={() => setIsQuickLogOpen(false)}
                className="w-full py-3 text-gray-500 font-medium hover:text-gray-800 transition-colors"
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
