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
    <nav className="sticky top-0 z-50 bg-primary-900 border-b border-primary-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-accent-700 rounded-lg group-hover:scale-105 transition-transform">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white font-sans tracking-wide">
                StudyAI
              </span>
            </Link>
          </div>

          {/* Navigation Links and User Controls */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-1.5 bg-primary-950/40 p-1 rounded-xl border border-primary-800/80">
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive('/dashboard')
                        ? 'bg-accent-700 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-primary-800/40'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/history"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive('/history')
                        ? 'bg-accent-700 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-primary-800/40'
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
                        ? 'bg-accent-700 text-white' 
                        : 'text-slate-300 hover:text-white hover:bg-primary-800/40'
                    }`}
                    title="Dashboard"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/history"
                    className={`p-2 rounded-lg transition-all ${
                      isActive('/history') 
                        ? 'bg-accent-700 text-white' 
                        : 'text-slate-300 hover:text-white hover:bg-primary-800/40'
                    }`}
                    title="History"
                  >
                    <History className="h-5 w-5" />
                  </Link>
                </div>

                {/* Profile and Logout Section */}
                <div className="flex items-center gap-3 border-l border-primary-800 pl-4">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-sm font-semibold text-white">{user.name}</span>
                    <span className="text-xs text-slate-400 font-medium">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 bg-primary-950/40 hover:bg-primary-850 text-slate-200 hover:text-white border border-primary-800 hover:border-primary-700 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer shadow-sm"
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
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-accent-700 hover:bg-accent-800 text-white shadow-sm px-4 py-2 rounded-xl text-sm font-medium transition-all"
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
