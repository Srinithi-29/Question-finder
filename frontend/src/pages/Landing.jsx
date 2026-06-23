import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Brain, Tag, Search, ArrowRight, Library, Sparkles } from 'lucide-react';

const Landing = () => {
  const { user } = useContext(AuthContext);

  // If user is already authenticated, redirect them to their dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#0b0f19] text-white overflow-hidden flex flex-col justify-center">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-850 text-brand-400 text-xs font-semibold tracking-wider uppercase mb-8 shadow-glow-sky">
          <Sparkles className="h-3.5 w-3.5 text-brand-400 animate-pulse" />
          Powered by Local AI Models
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 font-sans">
          Find Study Answers
          <span className="block mt-2 bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Semantically & Instantly
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 mb-10 font-normal leading-relaxed">
          Submit your study or homework questions. Our locally hosted AI instantly tags the subjects and matches them against existing materials to find duplicates and related queries.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            to="/signup"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-glow-sky hover:shadow-brand-500/20 transition-all text-base group"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800/80 text-slate-200 hover:text-white font-semibold px-8 py-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all text-base shadow-sm"
          >
            Access Dashboard
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm hover:border-brand-500/30 transition-all group hover:-translate-y-1">
            <div className="p-3 bg-brand-500/10 rounded-2xl w-fit text-brand-400 mb-6 group-hover:bg-brand-500/20 transition-colors">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">Semantic Matching</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Finds contextually similar questions asked by other students. It goes beyond simple keywords to understand the meaning of your text.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm hover:border-indigo-500/30 transition-all group hover:-translate-y-1">
            <div className="p-3 bg-indigo-500/10 rounded-2xl w-fit text-indigo-400 mb-6 group-hover:bg-indigo-500/20 transition-colors">
              <Tag className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">Auto Subject Tagging</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Instantly classifies your questions into Biology, Physics, Chemistry, Mathematics, or Computer Science using SentenceTransformer logic.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm hover:border-purple-500/30 transition-all group hover:-translate-y-1">
            <div className="p-3 bg-purple-500/10 rounded-2xl w-fit text-purple-400 mb-6 group-hover:bg-purple-500/20 transition-colors">
              <Library className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">Private History Log</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Track your queries in a personal dashboard. Filter search archives by subjects, dates, and similarity parameters with ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
