import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Database, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function Profile() {
  const navigate = useNavigate();
  const [dbStatus, setDbStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [dbMessage, setDbMessage] = useState<string>("");
  const [seedStatus, setSeedStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [seedMessage, setSeedMessage] = useState<string>("");

  const testDbConnection = async () => {
    setDbStatus("loading");
    setDbMessage("");
    
    try {
      const response = await fetch("/api/db-test");
      const data = await response.json();
      
      if (data.success) {
        setDbStatus("success");
        setDbMessage(data.message);
      } else {
        setDbStatus("error");
        setDbMessage(data.error || "Failed to connect");
      }
    } catch (error) {
      setDbStatus("error");
      setDbMessage("Network error occurred");
    }
  };

  const seedDatabase = async () => {
    setSeedStatus("loading");
    setSeedMessage("");
    
    try {
      const response = await fetch("/api/seed", { method: "POST" });
      const data = await response.json();
      
      if (data.success) {
        setSeedStatus("success");
        setSeedMessage(data.message);
      } else {
        setSeedStatus("error");
        setSeedMessage(data.error || "Failed to seed");
      }
    } catch (error) {
      setSeedStatus("error");
      setSeedMessage("Network error occurred");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-[#F5F5F0] relative"
    >
      <div className="flex items-center justify-between p-6 pb-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-stone-600 hover:text-stone-900">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-serif font-medium text-stone-800 tracking-wider uppercase text-sm">Profile & Settings</span>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-6 pt-6 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
              <Database className="w-6 h-6 text-stone-600" />
            </div>
            <div>
              <h3 className="font-medium text-stone-900">Database Connection</h3>
              <p className="text-sm text-stone-500">Test your Neon database</p>
            </div>
          </div>

          <button 
            onClick={testDbConnection}
            disabled={dbStatus === "loading"}
            className="w-full py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {dbStatus === "loading" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Testing Connection...</span>
              </>
            ) : (
              <span>Test Connection</span>
            )}
          </button>

          {dbStatus !== "idle" && dbStatus !== "loading" && (
            <div className={`mt-4 p-4 rounded-xl flex items-start space-x-3 ${
              dbStatus === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}>
              {dbStatus === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <p className="text-sm font-medium">{dbMessage}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm mt-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
              <Database className="w-6 h-6 text-stone-600" />
            </div>
            <div>
              <h3 className="font-medium text-stone-900">Seed Database</h3>
              <p className="text-sm text-stone-500">Add mockup data to Neon</p>
            </div>
          </div>

          <button 
            onClick={seedDatabase}
            disabled={seedStatus === "loading"}
            className="w-full py-3 bg-[#5A5A40] text-white rounded-xl font-medium hover:bg-[#4A4A30] transition-colors flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {seedStatus === "loading" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Seeding Database...</span>
              </>
            ) : (
              <span>Add Mockup Data</span>
            )}
          </button>

          {seedStatus !== "idle" && seedStatus !== "loading" && (
            <div className={`mt-4 p-4 rounded-xl flex items-start space-x-3 ${
              seedStatus === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}>
              {seedStatus === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <p className="text-sm font-medium">{seedMessage}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
