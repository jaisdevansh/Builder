import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';

// Lazy load the pages
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const AuthCallback = React.lazy(() => import('./pages/AuthCallback'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const Workspace = React.lazy(() => import('./pages/Workspace'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-white">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <div className="text-zinc-400 font-medium animate-pulse">Loading Application...</div>
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route 
                path="/workspace" 
                element={
                  <ProtectedRoute>
                    <Workspace />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
