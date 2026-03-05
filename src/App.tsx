/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout, AppLayout } from "./components/Layout";
import { Login } from "./pages/Login";
import { BiometricSync } from "./pages/BiometricSync";
import { Personalization } from "./pages/Personalization";
import { Dashboard } from "./pages/Dashboard";
import { MoodCheckIn } from "./pages/MoodCheckIn";
import { EnergyInsight } from "./pages/EnergyInsight";
import { Success } from "./pages/Success";
import { Profile } from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth & Onboarding Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Login />} />
          <Route path="/sync" element={<BiometricSync />} />
          <Route path="/personalization" element={<Personalization />} />
          <Route path="/success" element={<Success />} />
        </Route>

        {/* Main App Routes */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mood" element={<MoodCheckIn />} />
          <Route path="/insight" element={<EnergyInsight />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
