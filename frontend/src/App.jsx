import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import InfluencerAnalysis from './pages/InfluencerAnalysis';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
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
            <Route path="/analysis" element={<ProtectedRoute><InfluencerAnalysis /></ProtectedRoute>} />
            <Route path="/report/:id" element={<ProtectedRoute><InfluencerReport /></ProtectedRoute>} />
            <Route path="/brand-match" element={<ProtectedRoute><BrandMatching /></ProtectedRoute>} />
            <Route path="/compare" element={<ProtectedRoute><Comparison /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/ai-insights" element={<ProtectedRoute><AIInsights /></ProtectedRoute>} />
            <Route path="/predictor" element={<ProtectedRoute><FamePredictor /></ProtectedRoute>} />
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
