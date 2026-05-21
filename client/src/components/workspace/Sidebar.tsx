import React from 'react';
import { FileCode, FileJson, Settings, Home, LayoutTemplate, User as UserIcon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { files, activeFile, setActiveFile } = useStore();
  const { user, logout } = useAuthStore();

  return (
    <div className="w-64 bg-zinc-950 border-r border-white/5 h-full flex flex-col">
      <div className="p-4 border-b border-white/5 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
          <LayoutTemplate className="w-4 h-4 text-primary" />
        </div>
        <span className="font-bold text-sm text-white">Project Files</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 mb-2">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2">Explorer</p>
        </div>
        <div className="space-y-1 px-2">
          {Object.entries(files).map(([path, file]) => {
            const isActive = activeFile === path;
            const Icon = path.endsWith('.css') ? FileJson : FileCode;
            
            return (
              <button
                key={path}
                onClick={() => setActiveFile(path)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {file.name}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 border-t border-white/5 space-y-2 relative">
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </button>

        {/* Profile / Settings Popup Menu */}
        <div className="relative group">
          {/* Hidden by default, shown on group hover/focus-within */}
          <div className="absolute bottom-full left-0 right-0 pb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-bottom z-50">
            <div className="bg-zinc-900 border border-white/10 rounded-xl shadow-xl overflow-hidden">
              <div className="p-3 border-b border-white/5 flex flex-col gap-1">
                <span className="text-sm font-bold text-white truncate">{user?.name || 'User Account'}</span>
                <span className="text-xs text-zinc-500 truncate">{user?.email || 'Logged in'}</span>
              </div>
              <div className="p-1">
                <button 
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <button className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors">
            <div className="flex items-center gap-2">
              {user?.image ? (
                <img src={user.image} alt={user?.name || 'User'} referrerPolicy="no-referrer" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <UserIcon className="w-4 h-4" />
              )}
              <span className="truncate max-w-[120px] font-medium">{user?.name || 'Settings'}</span>
            </div>
            <Settings className="w-4 h-4 shrink-0 transition-transform group-hover:rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
