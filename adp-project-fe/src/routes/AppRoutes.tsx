import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import MasterSheetPage from "../pages/MasterSheetPage";
import AdpSchemeFormPage from "../pages/AdpSchemeFormPage";
import AdpSchemeCostingPage from "../pages/AdpSchemeCostingPage";
import PipelinePage from "../pages/PipelinePage";
import PipelineDetailPage from "../pages/PipelineDetailPage";
import ReportsPage from "../pages/ReportsPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/master-sheet" element={<MasterSheetPage />} />
        <Route path="/adp-schemes/new" element={<AdpSchemeFormPage />} />
        <Route path="/adp-schemes/:id/edit" element={<AdpSchemeFormPage />} />
        <Route path="/adp-schemes/:id/costing" element={<AdpSchemeCostingPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/pipeline/:id" element={<PipelineDetailPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </BrowserRouter>
  );
}