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
    { icon: MessageSquare, label: 'Ask Question', color: 'text-primary-800', bg: 'bg-primary-50', border: 'border-primary-100' },
    { icon: Cpu, label: 'Generate Embedding', color: 'text-accent-700', bg: 'bg-accent-50', border: 'border-accent-100' },
    { icon: GitCompare, label: 'Cosine Similarity Search', color: 'text-primary-800', bg: 'bg-primary-50', border: 'border-primary-100' },
    { icon: ScanSearch, label: 'Find Similar Questions', color: 'text-accent-700', bg: 'bg-accent-50', border: 'border-accent-100' },
    { icon: Tag, label: 'Auto Subject Tagging', color: 'text-accent-800', bg: 'bg-accent-50', border: 'border-accent-100' },
  ];

  const stats = [
    { icon: Brain, label: 'AI-Powered Semantic Search', color: 'text-primary-800', bg: 'bg-primary-50' },
    { icon: FlaskConical, label: '100% Local Embedding Model', color: 'text-accent-700', bg: 'bg-accent-50' },
    { icon: BookMarked, label: 'Subject Auto-Classification', color: 'text-primary-800', bg: 'bg-primary-50' },
    { icon: Lock, label: 'Secure User Authentication', color: 'text-accent-700', bg: 'bg-accent-50' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-700 overflow-hidden flex flex-col">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-800/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-accent-700/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-800/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center w-full">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-800 text-xs font-semibold tracking-wider uppercase mb-8 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-primary-800 animate-pulse" />
          Powered by Local AI Embedding Models
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 font-sans text-slate-700">
          Find Similar Study Questions
          <span className="block mt-2 bg-gradient-to-r from-primary-900 via-primary-800 to-accent-700 bg-clip-text text-transparent">
            Instantly
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-500 mb-10 font-normal leading-relaxed">
          Ask any academic question and let our AI automatically identify its subject and retrieve the most semantically similar questions from previous submissions using local embedding models.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
          <Link
            to="/signup"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-800 hover:bg-primary-900 text-white font-semibold px-8 py-4 rounded-2xl shadow-[0_1px_3px_rgba(30,58,138,0.1)] hover:shadow-[0_4px_6px_rgba(30,58,138,0.15)] transition-all text-base group"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto bg-accent-700 hover:bg-accent-800 text-white font-semibold px-8 py-4 rounded-2xl shadow-[0_1px_3px_rgba(30,58,138,0.1)] hover:shadow-[0_4px_6px_rgba(30,58,138,0.15)] transition-all text-base"
          >
            Explore Features
          </a>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-700 mb-2">How It Works</h2>
          <p className="text-slate-500 mb-12 text-sm">Five-step AI pipeline running entirely on local models</p>

          {/* Steps */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={index}>
                  <div className={`flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-slate-200 shadow-[0_1px_3px_rgba(30,58,138,0.1)] hover:shadow-[0_4px_6px_rgba(30,58,138,0.15)] w-full md:w-40 hover:-translate-y-1 transition-all group`}>
                    <div className={`p-3 ${step.bg} rounded-xl`}>
                      <Icon className={`h-5 w-5 ${step.color}`} />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 text-center leading-snug">{step.label}</span>
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <ArrowRight className="hidden md:block h-4 w-4 text-slate-400 flex-shrink-0" />
                  )}
                  {index < workflowSteps.length - 1 && (
                    <div className="md:hidden text-slate-400 text-lg">↓</div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto mb-24">
          {/* Card 1 - Semantic Matching */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-[0_1px_3px_rgba(30,58,138,0.1)] hover:shadow-[0_4px_6px_rgba(30,58,138,0.15)] hover:border-primary-200 transition-all group hover:-translate-y-1">
            <div className="p-3 bg-primary-55 rounded-2xl w-fit text-primary-800 mb-6 group-hover:bg-primary-100 transition-colors">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-3">Semantic Matching</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Uses sentence embeddings and cosine similarity to discover contextually related questions rather than relying on keyword matching.
            </p>
          </div>

          {/* Card 2 - Auto Subject Tagging */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-[0_1px_3px_rgba(30,58,138,0.1)] hover:shadow-[0_4px_6px_rgba(30,58,138,0.15)] hover:border-accent-200 transition-all group hover:-translate-y-1">
            <div className="p-3 bg-accent-50 rounded-2xl w-fit text-accent-700 mb-6 group-hover:bg-accent-100 transition-colors">
              <Tag className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-3">Auto Subject Tagging</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Automatically categorizes questions into Biology, Physics, Chemistry, Mathematics, or Computer Science using local AI models.
            </p>
          </div>

          {/* Card 3 - Question History */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-[0_1px_3px_rgba(30,58,138,0.1)] hover:shadow-[0_4px_6px_rgba(30,58,138,0.15)] hover:border-primary-200 transition-all group hover:-translate-y-1">
            <div className="p-3 bg-primary-55 rounded-2xl w-fit text-primary-800 mb-6 group-hover:bg-primary-100 transition-colors">
              <Library className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-3">Question History</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Maintain a searchable archive of previously submitted questions, tags, and similarity results.
            </p>
          </div>
        </div>

        {/* Stats / Glassmorphism Section */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-700 mb-2">Built for Accuracy & Privacy</h2>
          <p className="text-slate-500 mb-12 text-sm">Everything runs locally — no third-party APIs, no data leaks</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-[0_1px_3px_rgba(30,58,138,0.1)] hover:shadow-[0_4px_6px_rgba(30,58,138,0.15)] hover:border-slate-350 hover:-translate-y-1 transition-all"
                >
                  <div className={`p-4 ${stat.bg} rounded-2xl`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 text-center leading-snug">{stat.label}</p>
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
