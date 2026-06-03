import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import InfluencerAnalysis from './pages/InfluencerAnalysis';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { 
  InfluencerReport, 
  BrandMatching, 
  Comparison, 
  Leaderboard, 
  AIInsights, 
  FamePredictor, 
  Discovery, 
  SimilarCreators, 
  ReportGenerator, 
  Settings 
} from './pages/placeholders';
import AIAdvisorWidget from './components/AIAdvisorWidget';
import ROIPredictor from './pages/ROIPredictor';
import AudienceSentiment from './pages/AudienceSentiment';
import StockMarket from './pages/StockMarket';
import SimilarityGraph from './pages/SimilarityGraph';

import BackgroundEffects from './components/BackgroundEffects';

function App() {
  return (
    <AuthProvider>
      <BackgroundEffects />
      <Router>
        <MainLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/analysis" element={<ProtectedRoute><InfluencerAnalysis /></ProtectedRoute>} />
            <Route path="/report/:id" element={<ProtectedRoute><InfluencerReport /></ProtectedRoute>} />
            <Route path="/brand-match" element={<ProtectedRoute><BrandMatching /></ProtectedRoute>} />
            <Route path="/compare" element={<ProtectedRoute><Comparison /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/ai-insights" element={<ProtectedRoute><AIInsights /></ProtectedRoute>} />
            <Route path="/predictor" element={<ProtectedRoute><FamePredictor /></ProtectedRoute>} />
            <Route path="/roi-predictor" element={<ProtectedRoute><ROIPredictor /></ProtectedRoute>} />
            <Route path="/audience-sentiment" element={<ProtectedRoute><AudienceSentiment /></ProtectedRoute>} />
            <Route path="/stock-market" element={<ProtectedRoute><StockMarket /></ProtectedRoute>} />
            <Route path="/network-graph" element={<ProtectedRoute><SimilarityGraph /></ProtectedRoute>} />
            <Route path="/discover" element={<ProtectedRoute><Discovery /></ProtectedRoute>} />
            <Route path="/similar" element={<ProtectedRoute><SimilarCreators /></ProtectedRoute>} />
            <Route path="/generate-report" element={<ProtectedRoute><ReportGenerator /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
          <AIAdvisorWidget />
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
