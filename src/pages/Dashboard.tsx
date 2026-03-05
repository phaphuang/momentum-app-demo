import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Menu, Bell, Zap, Footprints, Moon, Droplet, Loader2 } from "lucide-react";

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
      className="flex-1 flex flex-col bg-[#f8f9fa] relative"
    >
      <div className="flex items-center justify-between p-5 md:p-8 bg-white border-b border-gray-100">
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 md:hidden">
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
        <span className="font-semibold text-gray-900 text-lg">Today</span>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 relative">
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 md:px-8 py-6 space-y-5 max-w-7xl mx-auto w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="w-8 h-8 text-[#1e3a5f] animate-spin" />
            <p className="text-gray-500 text-sm">Loading your data...</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{energyData?.battery_percentage || 72}%</div>
                  <div className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide">Energy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">8,403</div>
                  <div className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide">Steps</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">2,345</div>
                  <div className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide">Calories</div>
                </div>
              </div>
              <button className="text-sm text-gray-600 font-medium flex items-center space-x-1 hover:text-gray-900">
                <span>See data</span>
                <span className="text-lg">›</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <Moon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sleep</h3>
                    <p className="text-xs text-gray-500">You slept too little last night</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {biometricsData ? Math.floor(biometricsData.sleep_minutes / 60) : '6'}h
                  </div>
                  <div className="text-xs text-gray-500">
                    {biometricsData ? biometricsData.sleep_minutes % 60 : '11'}m
                  </div>
                </div>
              </div>

              <div className="relative h-32 flex items-end space-x-2">
                <div className="flex-1 h-full flex items-end justify-between">
                  {[6, 7, 5, 8, 6, 7, 6].map((hours, i) => (
                    <div key={i} className="flex flex-col items-center justify-end" style={{ height: '100%' }}>
                      <div
                        className={`w-2 rounded-full ${i === 3 ? 'bg-orange-400' : 'bg-gray-800'}`}
                        style={{ height: `${(hours / 8) * 100}%` }}
                      />
                      {i === 3 && (
                        <div className="w-4 h-4 rounded-full bg-orange-400 -mt-2 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                <span>12:00</span>
                <span>13:00</span>
                <span>14:00</span>
                <span>15:00</span>
                <span>16:00</span>
              </div>

              <div className="mt-4 px-3 py-2 bg-gray-50 rounded-xl flex items-center space-x-2">
                <div className="text-xs font-medium text-gray-700">Goal: 8h</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <Footprints className="w-5 h-5 text-gray-400 mb-2" />
                <span className="text-xl font-bold text-gray-900">8.4k</span>
                <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Steps</span>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-500 mb-2" />
                <span className="text-xl font-bold text-gray-900">7.86</span>
                <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">KM</span>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <Droplet className="w-5 h-5 text-blue-400 mb-2" />
                <span className="text-xl font-bold text-gray-900">
                  {intakeData ? (intakeData.water_ml / 1000).toFixed(1) : '1.2'}L
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Water</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
