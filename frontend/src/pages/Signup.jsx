import React, { useState, useContext } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, KeyRound, Mail, AlertCircle, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const { user, signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is already authenticated, redirect to Dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Field and confirmation validations
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(name, email, password, confirmPassword);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Registration failed. Please check details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative Blur Sphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white border border-slate-200/80 p-8 rounded-3xl shadow-xl relative z-10 my-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Create Account</h2>
          <p className="text-slate-500 text-sm">Join StudyAI and start finding study solutions</p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200/60 text-red-750 text-sm animate-shake">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name input */}
          <div>
            <label className="block text-xs font-semibold text-slate-550 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-xl py-3.5 pl-11 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none transition-all text-sm"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Email input */}
          <div>
            <label className="block text-xs font-semibold text-slate-555 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                required
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-xl py-3.5 pl-11 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none transition-all text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-xs font-semibold text-slate-555 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-slate-55/60 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-xl py-3.5 pl-11 pr-12 text-slate-900 placeholder-slate-405 focus:outline-none transition-all text-sm"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password input */}
          <div>
            <label className="block text-xs font-semibold text-slate-555 uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                className="w-full bg-slate-55/60 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-xl py-3.5 pl-11 pr-12 text-slate-900 placeholder-slate-405 focus:outline-none transition-all text-sm"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655">
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-3"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Sign Up
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Link to login */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 hover:underline font-semibold font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
