import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Menu, Bell, Leaf, Zap, Footprints, Moon, Droplet, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

interface UserData {
  display_name: string;
  tree_stage: string;
}

interface EnergyData {
  battery_percentage: number;
  status: string;
}

interface BiometricsData {
  sleep_minutes: number;
}

interface IntakeData {
  water_ml: number;
}

export function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [energyData, setEnergyData] = useState<EnergyData | null>(null);
  const [biometricsData, setBiometricsData] = useState<BiometricsData | null>(null);
  const [intakeData, setIntakeData] = useState<IntakeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        let url = "/api/dashboard-data";
        if (storedUser) {
          const user = JSON.parse(storedUser);
          url += `?userId=${user.id}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          setUserData(data.data.user);
          setEnergyData(data.data.energy);
          setBiometricsData(data.data.biometrics);
          setIntakeData(data.data.intake);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    const handleUserDataUpdated = () => {
      fetchUserData();
    };

    window.addEventListener('dashboard-data-updated', handleUserDataUpdated);

    return () => {
      window.removeEventListener('dashboard-data-updated', handleUserDataUpdated);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col bg-[#F5F5F0] relative"
    >
      <div className="flex items-center justify-between p-6 md:p-8 pb-2">
        <button className="p-2 -ml-2 text-stone-600 hover:text-stone-900 md:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-serif font-medium text-stone-800 tracking-wider uppercase text-sm md:text-xl">Dashboard</span>
        <button className="p-2 -mr-2 text-stone-600 hover:text-stone-900 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#F5F5F0]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8 space-y-6 max-w-7xl mx-auto w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="w-8 h-8 text-[#5A5A40] animate-spin" />
            <p className="text-stone-500 text-sm">Loading your momentum...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Life Tree Card */}
            <div className="bg-white rounded-[32px] p-8 flex flex-col items-center justify-center shadow-sm relative overflow-hidden lg:col-span-1 min-h-[300px]">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-stone-50 to-white opacity-50" />
              <div className="w-24 h-24 rounded-full bg-[#F5F5F0] flex items-center justify-center mb-4 relative z-10 shadow-inner">
                <Leaf className="w-10 h-10 text-[#5A5A40]" />
              </div>
              <h2 className="text-2xl font-serif font-medium text-stone-900 relative z-10">Life-Tree</h2>
              <p className="text-stone-500 text-xs tracking-widest uppercase font-medium mt-1 relative z-10">
                {userData?.tree_stage || "Seed"} Stage
              </p>
              <div className="absolute bottom-4 right-4 text-stone-300">
                <Droplet className="w-4 h-4" />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {/* Energy Battery */}
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-stone-800 font-medium">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span>Energy Battery</span>
                  </div>
                  <span className="text-2xl font-serif font-medium text-stone-900">
                    {energyData?.battery_percentage || 72}%
                  </span>
                </div>
                
                <div className="h-3 bg-stone-100 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-green-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${energyData?.battery_percentage || 72}%` }} 
                  />
                </div>
                
                <div className="flex items-start space-x-3 bg-stone-50 p-4 rounded-2xl">
                  <div className="mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {userData ? `Hey ${userData.display_name}, you're ready for a focused afternoon. Consider a deep work session now.` : "You're ready for a focused afternoon. Consider a deep work session now."}
                  </p>
                </div>
              </div>

              {/* Activity Log */}
              <div>
                <h3 className="text-xs font-medium tracking-widest uppercase text-stone-500 mb-4 ml-2">Activity Log</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
                    <Footprints className="w-5 h-5 text-stone-400 mb-2" />
                    <span className="text-lg font-serif font-medium text-stone-900">
                      8.4k
                    </span>
                    <span className="text-[10px] tracking-wider uppercase text-stone-500 mt-1">Steps</span>
                  </div>
                  <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
                    <Moon className="w-5 h-5 text-stone-400 mb-2" />
                    <span className="text-lg font-serif font-medium text-stone-900">
                      {biometricsData ? (biometricsData.sleep_minutes / 60).toFixed(1) : '7.5'}h
                    </span>
                    <span className="text-[10px] tracking-wider uppercase text-stone-500 mt-1">Sleep</span>
                  </div>
                  <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
                    <Droplet className="w-5 h-5 text-blue-400 mb-2" />
                    <span className="text-lg font-serif font-medium text-stone-900">
                      {intakeData ? (intakeData.water_ml / 1000).toFixed(1) : '1.2'}L
                    </span>
                    <span className="text-[10px] tracking-wider uppercase text-stone-500 mt-1">Water</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
