import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, LogOut, History, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-lg shadow-glow-sky group-hover:scale-105 transition-transform">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-brand-400 bg-clip-text text-transparent font-sans">
                StudyAI
              </span>
            </Link>
          </div>

          {/* Navigation Links and User Controls */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive('/dashboard')
                        ? 'bg-slate-800/80 text-brand-400 border border-slate-700/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/history"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive('/history')
                        ? 'bg-slate-800/80 text-brand-400 border border-slate-700/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
                    }`}
                  >
                    <History className="h-4 w-4" />
                    History
                  </Link>
                </div>

                {/* Mobile Menu Icons */}
                <div className="flex md:hidden items-center gap-1.5">
                  <Link
                    to="/dashboard"
                    className={`p-2 rounded-lg transition-all ${
                      isActive('/dashboard') 
                        ? 'bg-slate-800 text-brand-400 border border-slate-700/40' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
                    }`}
                    title="Dashboard"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/history"
                    className={`p-2 rounded-lg transition-all ${
                      isActive('/history') 
                        ? 'bg-slate-800 text-brand-400 border border-slate-700/40' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
                    }`}
                    title="History"
                  >
                    <History className="h-5 w-5" />
                  </Link>
                </div>

                {/* Profile and Logout Section */}
                <div className="flex items-center gap-3 border-l border-slate-850 pl-4">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-sm font-semibold text-slate-200">{user.name}</span>
                    <span className="text-xs text-slate-500 font-medium">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-red-950/20 to-slate-950 hover:from-red-950/40 hover:to-slate-900 text-red-400 border border-red-900/30 hover:border-red-800/50 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer shadow-sm hover:shadow-red-950/20"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-slate-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-glow-sky hover:shadow-brand-500/10 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
