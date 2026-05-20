import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogleCode, loginWithGithubCode } = useAuthStore();
  const hasRun = useRef(false);

  useEffect(() => {
    // Prevent double execution in React StrictMode
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const stateParam = urlParams.get('state');
      
      let provider = urlParams.get('provider');
      
      // If provider is not in query, try to get it from state
      if (!provider && stateParam) {
        try {
          const stateData = JSON.parse(decodeURIComponent(stateParam));
          provider = stateData.provider;
        } catch (e) {
          console.error('Error parsing state:', e);
        }
      }

      if (error) {
        console.error('OAuth error:', error);
        navigate('/auth');
        return;
      }

      if (code) {
        try {
          if (provider === 'google') {
            await loginWithGoogleCode(code);
          } else if (provider === 'github') {
            await loginWithGithubCode(code);
          } else {
            await loginWithGoogleCode(code);
          }
          navigate('/workspace');
        } catch (err) {
          console.error('Authentication error:', err);
          navigate('/auth');
        }
      } else {
        navigate('/auth');
      }
    };

    handleCallback();
  }, [navigate, loginWithGoogleCode, loginWithGithubCode]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#09090b',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        textAlign: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #3b82f6',
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>Signing you in...</h2>
        <p style={{ color: '#a1a1aa', margin: 0 }}>Please wait while we complete your authentication</p>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthCallback;