import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Documents from './pages/Documents';
import Contact from './pages/Contact';
import DpoTeam from './pages/DpoTeam';
import SearchResults from './pages/SearchResults';
import Ropa from './pages/Ropa';
import Infographics from './pages/Infographics';
import Videos from './pages/Videos';
import Training from './pages/Training';
import TitleManager from './components/TitleManager';
import ReportForm from './pages/ReportForm';
import Login from './pages/Login';
import DocumentUpload from './pages/admin/DocumentUpload'; 
import InfographicUpload from './pages/admin/InfographicUpload';
import AdminDashboard from './pages/admin/AdminDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <TitleManager />
      <Routes>
        <Route path="/" element={<Layout />}>
          
          {/* === PUBLIC ROUTES === */}
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route path="/contact/report" element={<ReportForm />} />
          <Route path="about/dpo" element={<DpoTeam />} />
          <Route path="/about/documents" element={<Documents />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/about/ropa" element={<Ropa />} />
          <Route path="/services/infographics" element={<Infographics />} />
          <Route path="/services/videos" element={<Videos />} />
          <Route path="/services/training" element={<Training />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/policy-cookie" element={<CookiePolicy />} />
          
          {/* === ADMIN ROUTES === */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<Login />} />

          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/documents/upload" 
            element={
              <ProtectedRoute>
                <DocumentUpload />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/infographics/upload" 
            element={
              <ProtectedRoute>
                <InfographicUpload />
              </ProtectedRoute>
            } 
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;