import React from 'react';
import { motion } from 'framer-motion';
import { Layers, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleWorkspaceClick = () => {
    if (isAuthenticated) {
      navigate('/workspace');
    } else {
      navigate('/auth');
    }
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };
  
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg shadow-black/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Buildify AI</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#demo" className="hover:text-white transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          {isAuthenticated && (
            <button 
              onClick={() => navigate('/dashboard')}
              className="hover:text-white transition-colors"
            >
              Dashboard
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <button
                onClick={handleAuthClick}
                className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
              >
                Sign In
              </button>
              <button
                onClick={handleWorkspaceClick}
                className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 bg-zinc-800/50 rounded-full px-3 py-1.5 border border-white/10">
                {user?.image ? (
                  <img src={user.image || undefined} alt={user.name || 'User'} referrerPolicy="no-referrer" className="w-6 h-6 rounded-full border border-white/20" />
                ) : (
                  <UserIcon className="w-5 h-5 text-zinc-400" />
                )}
                <span className="text-sm font-medium text-white hidden sm:block">{user?.name}</span>
                <button 
                  onClick={() => logout()}
                  className="text-zinc-400 hover:text-white transition-colors ml-1"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={handleWorkspaceClick}
                className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                Workspace
              </button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
