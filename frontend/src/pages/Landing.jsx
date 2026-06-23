import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Brain, Tag, Search, ArrowRight, Library, Sparkles,
  MessageSquare, Cpu, GitCompare, ScanSearch, BookMarked,
  ShieldCheck, FlaskConical, Lock
} from 'lucide-react';

const Landing = () => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const workflowSteps = [
    { icon: MessageSquare, label: 'Ask Question', color: 'text-brand-400', bg: 'bg-brand-500/10', border: 'border-brand-500/20' },
    { icon: Cpu, label: 'Generate Embedding', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { icon: GitCompare, label: 'Cosine Similarity Search', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { icon: ScanSearch, label: 'Find Similar Questions', color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
    { icon: Tag, label: 'Auto Subject Tagging', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
  ];

  const stats = [
    { icon: Brain, label: 'AI-Powered Semantic Search', color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { icon: FlaskConical, label: '100% Local Embedding Model', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { icon: BookMarked, label: 'Subject Auto-Classification', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: Lock, label: 'Secure User Authentication', color: 'text-teal-400', bg: 'bg-teal-500/10' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#0b0f19] text-white overflow-hidden flex flex-col">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center w-full">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-brand-400 text-xs font-semibold tracking-wider uppercase mb-8 shadow-lg">
          <Sparkles className="h-3.5 w-3.5 text-brand-400 animate-pulse" />
          Powered by Local AI Embedding Models
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 font-sans">
          Find Similar Study Questions
          <span className="block mt-2 bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Instantly
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 mb-10 font-normal leading-relaxed">
          Ask any academic question and let our AI automatically identify its subject and retrieve the most semantically similar questions from previous submissions using local embedding models.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
          <Link
            to="/signup"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-brand-500/20 transition-all text-base group"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800/80 text-slate-200 hover:text-white font-semibold px-8 py-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all text-base shadow-sm"
          >
            Explore Features
          </a>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">How It Works</h2>
          <p className="text-slate-500 mb-12 text-sm">Five-step AI pipeline running entirely on local models</p>

          {/* Steps */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={index}>
                  <div className={`flex flex-col items-center gap-3 p-5 rounded-2xl bg-slate-900/60 border ${step.border} backdrop-blur-sm w-full md:w-40 hover:-translate-y-1 transition-all group`}>
                    <div className={`p-3 ${step.bg} rounded-xl`}>
                      <Icon className={`h-5 w-5 ${step.color}`} />
                    </div>
                    <span className="text-xs font-semibold text-slate-300 text-center leading-snug">{step.label}</span>
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <ArrowRight className="hidden md:block h-4 w-4 text-slate-600 flex-shrink-0" />
                  )}
                  {index < workflowSteps.length - 1 && (
                    <div className="md:hidden text-slate-600 text-lg">↓</div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto mb-24">
          {/* Card 1 - Semantic Matching */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm hover:border-brand-500/30 transition-all group hover:-translate-y-1">
            <div className="p-3 bg-brand-500/10 rounded-2xl w-fit text-brand-400 mb-6 group-hover:bg-brand-500/20 transition-colors">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">Semantic Matching</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Uses sentence embeddings and cosine similarity to discover contextually related questions rather than relying on keyword matching.
            </p>
          </div>

          {/* Card 2 - Auto Subject Tagging */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm hover:border-indigo-500/30 transition-all group hover:-translate-y-1">
            <div className="p-3 bg-indigo-500/10 rounded-2xl w-fit text-indigo-400 mb-6 group-hover:bg-indigo-500/20 transition-colors">
              <Tag className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">Auto Subject Tagging</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automatically categorizes questions into Biology, Physics, Chemistry, Mathematics, or Computer Science using local AI models.
            </p>
          </div>

          {/* Card 3 - Question History */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm hover:border-purple-500/30 transition-all group hover:-translate-y-1">
            <div className="p-3 bg-purple-500/10 rounded-2xl w-fit text-purple-400 mb-6 group-hover:bg-purple-500/20 transition-colors">
              <Library className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">Question History</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Maintain a searchable archive of previously submitted questions, tags, and similarity results.
            </p>
          </div>
        </div>

        {/* Stats / Glassmorphism Section */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">Built for Accuracy & Privacy</h2>
          <p className="text-slate-500 mb-12 text-sm">Everything runs locally — no third-party APIs, no data leaks</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/8 hover:border-white/20 hover:-translate-y-1 transition-all"
                >
                  <div className={`p-4 ${stat.bg} rounded-2xl`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <p className="text-sm font-semibold text-slate-300 text-center leading-snug">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Landing;
