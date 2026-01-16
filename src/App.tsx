import React, { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Assessment } from './pages/Assessment';
import { Assessments } from './pages/Assessments';
import { Results } from './pages/Results';
import { Scenarios } from './pages/Scenarios';
import { ScenarioDetail } from './pages/ScenarioDetail';
import { FlightLog } from './pages/FlightLog';
import { UserProvider } from './context/UserContext';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components (mapbox, recharts, etc.)
const JourneyMap = lazy(() => import('./pages/JourneyMap').then(module => ({ default: module.JourneyMap })));
const TechStackAudit = lazy(() => import('./pages/TechStackAudit').then(module => ({ default: module.TechStackAudit })));
const Simulator = lazy(() => import('./pages/Simulator').then(module => ({ default: module.Simulator })));
const OperationsCenter = lazy(() => import('./pages/OperationsCenter').then(module => ({ default: module.OperationsCenter })));
const Analytics = lazy(() => import('./pages/Analytics').then(module => ({ default: module.Analytics })));

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
      <p className="text-slate-400">Loading...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
    <UserProvider>
      <HashRouter>
        <Layout>
          <Routes>
            {/* Main Entry Point */}
            <Route path="/" element={<Home />} />
            
              {/* Assessment Routes */}
            <Route path="/assessments" element={<Assessments />} />
              <Route path="/assessment" element={<Assessment type="quick" />} />
            <Route path="/assessment/quick" element={<Assessment type="quick" />} />
            <Route path="/assessment/deep" element={<Assessment type="deep" />} />
            
              {/* Results & Visualization - Protected Routes */}
              <Route 
                path="/results" 
                element={
                  <ProtectedRoute>
                    <Results />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/journey-map" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <JourneyMap />
                  </Suspense>
                } 
              />
            
              {/* Scenarios - Accessible via results page only (no nav link) */}
            <Route path="/scenarios" element={<Scenarios />} />
            <Route path="/scenarios/:id" element={<ScenarioDetail />} />
            
              {/* Flight Log */}
              <Route path="/flight-log" element={<FlightLog />} />
              
              {/* Hidden Routes - Still accessible but not in nav */}
              <Route 
                path="/tech-stack" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <TechStackAudit />
                  </Suspense>
                } 
              />
              <Route 
                path="/simulator" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Simulator />
                  </Suspense>
                } 
              />
              <Route path="/operations" element={<Navigate to="/" replace />} />
              
              {/* Analytics Dashboard - Hidden route */}
              <Route 
                path="/analytics" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Analytics />
                  </Suspense>
                } 
              />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </UserProvider>
    </ErrorBoundary>
  );
};

export default App;
