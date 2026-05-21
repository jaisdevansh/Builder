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
  Trash2,
  AlertTriangle,
  X,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
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

  // Modal states
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [renameProject, setRenameProject] = useState<Project | null>(null);
  const [newTitle, setNewTitle] = useState('');

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

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenDropdownId(null);
    setDeleteProjectId(id);
  };

  const confirmDelete = async () => {
    if (!deleteProjectId) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${deleteProjectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== deleteProjectId));
        toast.success('Project deleted');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
    } finally {
      setDeleteProjectId(null);
    }
  };

  const handleEditClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setOpenDropdownId(null);
    setRenameProject(project);
    setNewTitle(project.title);
  };

  const confirmRename = async () => {
    if (!renameProject || !newTitle.trim() || newTitle === renameProject.title) {
      setRenameProject(null);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${renameProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title: newTitle })
      });
      
      if (res.ok) {
        setProjects(prev => prev.map(p => p.id === renameProject.id ? { ...p, title: newTitle } : p));
        toast.success('Project renamed');
      }
    } catch (error) {
      console.error('Failed to rename project:', error);
      toast.error('Failed to rename project');
    } finally {
      setRenameProject(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 w-[120vw] -translate-x-1/2 h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-600/15 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-20 z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-sm font-medium mb-6 shadow-inner shadow-white/5">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Dashboard</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
              Manage your AI-powered projects and continue building amazing interfaces with a single prompt.
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/workspace')}
            className="group relative flex items-center gap-2 bg-primary px-8 py-4 rounded-2xl font-bold text-white transition-all shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.7)] hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
            <Plus className="w-5 h-5 relative z-10" />
            <span className="relative z-10">New Project</span>
          </button>
        </div>

        {/* Stats & Search */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
          <div className="relative flex-1 w-full group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input 
                type="text"
                placeholder="Search projects by title or prompt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white placeholder:text-zinc-500 transition-all shadow-inner"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-medium text-zinc-300 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 shadow-inner shadow-white/5 whitespace-nowrap">
            <Layout className="w-5 h-5 text-primary" />
            <span>{projects.length} Projects Total</span>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-72 rounded-3xl bg-zinc-900/50 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" ref={dropdownRef}>
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                onClick={() => navigate(`/workspace?project=${project.id}`)}
                className="group relative bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-1 hover:border-primary/50 transition-all duration-500 cursor-pointer hover:shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)] hover:-translate-y-1 flex flex-col"
              >
                {/* Glow Effect behind card content */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
                
                <div className="relative bg-[#0c0c0e]/80 rounded-[22px] p-6 h-full flex flex-col z-10 border border-white/5">
                  <div className="flex justify-between items-start mb-8">
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-colors shadow-inner">
                      <div className="absolute inset-0 bg-primary/20 blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <FolderOpen className="w-6 h-6 text-zinc-300 group-hover:text-primary transition-colors relative z-10" />
                    </div>
                    
                    {/* Three Dots Menu Container */}
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === project.id ? null : project.id);
                        }}
                        className="p-2 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-white/10"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {openDropdownId === project.id && (
                        <div className="absolute right-0 mt-2 w-44 bg-zinc-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                          <button 
                            onClick={(e) => handleEditClick(e, project)}
                            className="w-full px-4 py-2.5 text-left text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 flex items-center gap-3 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" /> Rename Project
                          </button>
                          <div className="h-px w-full bg-white/5 my-1" />
                          <button 
                            onClick={(e) => handleDeleteClick(e, project.id)}
                            className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> Delete Project
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 truncate text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all">
                    {project.title}
                  </h3>
                  <p className="text-zinc-500 text-sm mb-8 line-clamp-2 leading-relaxed flex-1">
                    "{project.prompt}"
                  </p>
                  
                  <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-auto">
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(project.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary text-sm font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      Open Editor <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center relative">
            <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full w-96 h-96 mx-auto -z-10" />
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center mb-8 border border-white/10 shadow-2xl relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-3xl opacity-50" />
              <Layout className="w-12 h-12 text-zinc-400 relative z-10" />
            </div>
            <h2 className="text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">No projects found</h2>
            <p className="text-zinc-400 max-w-md mx-auto mb-10 leading-relaxed text-lg">
              {searchQuery ? `We couldn't find any projects matching "${searchQuery}".` : "You haven't created any projects yet. Start building your first AI-powered UI today!"}
            </p>
            {!searchQuery && (
              <button 
                onClick={() => navigate('/workspace')}
                className="bg-white text-black px-10 py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] hover:-translate-y-1"
              >
                Create Your First Project
              </button>
            )}
          </div>
        )}
      </main>

      {/* Delete Modal */}
      {deleteProjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fade-in-up relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/50 to-red-600/50" />
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20 relative">
                <div className="absolute inset-0 bg-red-500/20 blur-md rounded-2xl" />
                <AlertTriangle className="w-7 h-7 text-red-500 relative z-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Delete Project</h3>
                <p className="text-zinc-400 text-sm">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteProjectId(null)}
                className="flex-1 px-5 py-3.5 rounded-xl font-bold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors border border-white/5"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-5 py-3.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-[0_0_20px_-5px_rgba(239,68,68,0.4)]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renameProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fade-in-up relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-purple-500/50" />
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-white">Rename Project</h3>
              <button onClick={() => setRenameProject(null)} className="p-2 text-zinc-500 hover:text-white transition-colors hover:bg-zinc-800 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <input 
                type="text" 
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full relative bg-zinc-900 border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all mb-8 font-medium text-lg shadow-inner"
                autoFocus
                onKeyDown={e => e.key === 'Enter' && confirmRename()}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setRenameProject(null)}
                className="px-6 py-3.5 rounded-xl font-bold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors border border-white/5"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRename}
                className="px-6 py-3.5 rounded-xl font-bold text-white bg-primary hover:bg-blue-600 transition-colors shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
