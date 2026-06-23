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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-lg group-hover:scale-105 transition-transform">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-brand-600 bg-clip-text text-transparent font-sans">
                StudyAI
              </span>
            </Link>
          </div>

          {/* Navigation Links and User Controls */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive('/dashboard')
                        ? 'bg-white text-brand-600 border border-slate-200/65 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/history"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive('/history')
                        ? 'bg-white text-brand-600 border border-slate-200/65 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
                        ? 'bg-slate-200 text-brand-600 border border-slate-300' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title="Dashboard"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/history"
                    className={`p-2 rounded-lg transition-all ${
                      isActive('/history') 
                        ? 'bg-slate-200 text-brand-600 border border-slate-300' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title="History"
                  >
                    <History className="h-5 w-5" />
                  </Link>
                </div>

                {/* Profile and Logout Section */}
                <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-sm font-semibold text-slate-800">{user.name}</span>
                    <span className="text-xs text-slate-500 font-medium">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-650 border border-red-100 hover:border-red-200 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer shadow-sm"
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
                  className="text-slate-600 hover:text-slate-950 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-sm px-4 py-2 rounded-xl text-sm font-medium transition-all"
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
