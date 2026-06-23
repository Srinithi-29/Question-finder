import React, { useState } from 'react';
import api from '../services/api';
import { Sparkles, AlertCircle, HelpCircle, Loader2, Award } from 'lucide-react';

const Dashboard = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    if (question.trim().length < 5) {
      setError('Please enter a question with at least 5 characters.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await api.post('/api/questions/ask', { question: question.trim() });
      setResult(response.data);
      setQuestion(''); // Clear input field
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'An error occurred while analyzing the question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to color similarity badges based on similarity score percentage
  const getSimilarityBadgeColor = (score) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (score >= 60) return 'bg-amber-50 text-amber-700 border border-amber-200';
    return 'bg-slate-100 text-slate-600 border border-slate-200';
  };

  // Helper to get matching tag badge theme color
  const getTagStyle = (tag) => {
    const styles = {
      'Biology': 'bg-green-50 text-green-700 border border-green-200',
      'Physics': 'bg-sky-50 text-sky-700 border border-sky-200',
      'Chemistry': 'bg-amber-50 text-amber-700 border border-amber-200',
      'Mathematics': 'bg-purple-50 text-purple-700 border border-purple-200',
      'Computer Science': 'bg-pink-50 text-pink-700 border border-pink-200',
    };
    return styles[tag] || 'bg-slate-100 text-slate-600 border border-slate-200';
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-brand-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Page title and description */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-slate-900">
            Ask Your Study Question
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto font-medium text-sm sm:text-base">
            Get instant topic tagging and search across existing library materials for duplicates or similar questions.
          </p>
        </div>

        {/* Ask Question Card */}
        <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-md mb-8">
          {error && (
            <div className="mb-6 flex items-start gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200/60 text-red-750 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <textarea
                required
                rows="4"
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-2xl p-4 text-slate-900 placeholder-slate-400 focus:outline-none transition-all resize-none text-base"
                placeholder="Type your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold px-6 py-3.5 rounded-xl cursor-pointer shadow-sm hover:shadow-brand-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing Question...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Find Similar Questions
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Similar Questions Results Card */}
        {result && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-md">
              {/* Question text and Auto-assigned tag badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Your Question
                  </span>
                  <p className="text-lg font-semibold text-slate-900 mt-1">
                    "{result.question}"
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Assigned Tag:</span>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getTagStyle(result.tag)}`}>
                    {result.tag}
                  </span>
                </div>
              </div>

              {/* Top 3 Similar Questions list */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
                  <Award className="h-4 w-4 text-brand-650" />
                  Top 3 Similar Questions
                </h3>

                {result.similarQuestions && result.similarQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {result.similarQuestions.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-55 hover:bg-slate-100/50 border border-slate-200/80 hover:border-slate-300 transition-all"
                      >
                        <div className="flex gap-3">
                          <HelpCircle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                          <p className="text-sm text-slate-800 leading-relaxed font-medium">
                            {item.question}
                          </p>
                        </div>
                        <span className={`inline-flex shrink-0 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${getSimilarityBadgeColor(item.similarity)}`}>
                          {item.similarity}% similarity
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                    <p className="text-sm text-slate-500 font-medium">
                      No previously stored questions found to compare similarity.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
