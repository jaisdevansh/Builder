import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Layout, 
  Clock, 
  ChevronRight, 
  MoreVertical,
  FolderOpen,
  Edit2,
  Trash2
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { useAuthStore } from '../store/useAuthStore';

interface Project {
  id: string;
  title: string;
  prompt: string;
  updated_at: string;
  theme: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for tracking which dropdown is open
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/projects?limit=100`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenDropdownId(null);
    
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleEdit = async (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setOpenDropdownId(null);

    const newTitle = window.prompt('Enter new project name:', project.title);
    if (!newTitle || newTitle === project.title) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title: newTitle })
      });
      
      if (res.ok) {
        setProjects(prev => prev.map(p => p.id === project.id ? { ...p, title: newTitle } : p));
      }
    } catch (error) {
      console.error('Failed to rename project:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back, {user?.name?.split(' ')[0]}</h1>
            <p className="text-zinc-400">Manage your AI-powered projects and build something amazing.</p>
          </div>
          
          <button 
            onClick={() => navigate('/workspace')}
            className="flex items-center gap-2 bg-primary px-6 py-3 rounded-xl font-bold text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>

        {/* Stats & Search */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="text"
              placeholder="Search projects by title or prompt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4 text-sm font-medium text-zinc-400 bg-zinc-900/50 border border-white/10 rounded-2xl px-6 py-3.5">
            <Layout className="w-4 h-4" />
            <span>{projects.length} Projects Total</span>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-3xl bg-zinc-900/30 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" ref={dropdownRef}>
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                onClick={() => navigate(`/workspace?project=${project.id}`)}
                className="group relative bg-zinc-900/40 border border-white/5 rounded-3xl p-6 hover:border-primary/30 transition-all cursor-pointer hover:bg-zinc-900/60 flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                    <FolderOpen className="w-6 h-6 text-primary" />
                  </div>
                  
                  {/* Three Dots Menu Container */}
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(openDropdownId === project.id ? null : project.id);
                      }}
                      className="p-2 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-zinc-800"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {openDropdownId === project.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-zinc-800 border border-white/10 rounded-xl shadow-2xl z-10 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <button 
                          onClick={(e) => handleEdit(e, project)}
                          className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:text-white hover:bg-zinc-700 flex items-center gap-2 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" /> Rename
                        </button>
                        <button 
                          onClick={(e) => handleDelete(e, project.id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 truncate group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-zinc-500 text-sm mb-6 line-clamp-2 italic flex-1">"{project.prompt}"</p>
                
                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(project.updated_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Open <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center mb-8 border border-white/5">
              <Layout className="w-12 h-12 text-zinc-700" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No projects found</h2>
            <p className="text-zinc-500 max-w-sm mb-10 leading-relaxed">
              {searchQuery ? `We couldn't find any projects matching "${searchQuery}".` : "You haven't created any projects yet. Start building your first AI-powered UI today!"}
            </p>
            {!searchQuery && (
              <button 
                onClick={() => navigate('/workspace')}
                className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
              >
                Create Your First Project
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
