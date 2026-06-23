import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Filter, Calendar, HelpCircle, ChevronDown, ChevronUp, AlertCircle, Loader2, Sparkles } from 'lucide-react';

const History = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedRowId, setExpandedRowId] = useState(null);

  const tags = ['All', 'Biology', 'Physics', 'Chemistry', 'Mathematics', 'Computer Science'];

  const fetchHistory = async (tag) => {
    setLoading(true);
    setError('');
    try {
      // API tag filter integration as requested
      const url = tag && tag !== 'All' ? `/api/questions/history?tag=${tag}` : '/api/questions/history';
      const response = await api.get(url);
      setQuestions(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load question history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(selectedTag);
  }, [selectedTag]);

  // Client-side text filtering
  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTagStyle = (tag) => {
    const styles = {
      'Biology': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Physics': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      'Chemistry': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      'Mathematics': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'Computer Science': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    };
    return styles[tag] || 'bg-slate-500/10 text-slate-400 border-slate-700/20';
  };

  const toggleRow = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0b0f19] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Blur Circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-brand-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 pb-6 border-b border-slate-850">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Question History</h1>
            <p className="text-slate-400 text-sm mt-1">Review, search, and filter your previously asked study questions</p>
          </div>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Keyword Search Bar */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search your questions by text..."
              className="w-full bg-slate-900/50 border border-slate-800 focus:border-brand-500 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none transition-colors text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Topic Dropdown Filter */}
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 focus:border-brand-500 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none transition-colors text-sm appearance-none cursor-pointer"
            >
              {tags.map((tag) => (
                <option key={tag} value={tag} className="bg-slate-900 text-white">
                  {tag === 'All' ? 'All Topics' : tag}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-550 pointer-events-none" />
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2.5 p-4 rounded-xl bg-red-950/20 border border-red-900/30 text-red-400 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* History Table */}
        <div className="bg-slate-900/50 border border-slate-800/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="h-10 w-10 animate-spin text-brand-400 mb-4" />
              <p className="text-sm font-medium">Fetching history...</p>
            </div>
          ) : filteredQuestions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-850 bg-slate-950/30 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">Question</th>
                    <th className="py-4 px-6 w-36">Topic</th>
                    <th className="py-4 px-6 w-48">Date Asked</th>
                    <th className="py-4 px-6 w-40 text-center">Similar Matches</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60">
                  {filteredQuestions.map((q) => {
                    const isExpanded = expandedRowId === q.id;
                    const matchesCount = q.similarQuestions?.length || 0;
                    return (
                      <React.Fragment key={q.id}>
                        {/* Question Row */}
                        <tr
                          onClick={() => toggleRow(q.id)}
                          className="hover:bg-slate-850/20 transition-colors cursor-pointer text-sm"
                        >
                          <td className="py-4 px-6 font-medium text-slate-200">
                            <div className="flex items-center gap-3">
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-slate-500 shrink-0" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                              )}
                              <span className="line-clamp-2">{q.question}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getTagStyle(q.tag)}`}>
                              {q.tag}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-slate-500" />
                              {formatDate(q.createdAt)}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                              matchesCount > 0 
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                                : 'bg-slate-950 text-slate-500 border border-slate-850'
                            }`}>
                              <Sparkles className="h-3 w-3" />
                              {matchesCount} {matchesCount === 1 ? 'match' : 'matches'}
                            </span>
                          </td>
                        </tr>

                        {/* Accordion Expand Details */}
                        {isExpanded && (
                          <tr className="bg-slate-950/20">
                            <td colSpan="4" className="py-4 px-8 border-t border-slate-850">
                              <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                  <HelpCircle className="h-3.5 w-3.5" />
                                  Semantic Similarity Matches for this question
                                </h4>
                                {matchesCount > 0 ? (
                                  <div className="grid gap-2.5">
                                    {q.similarQuestions.map((match, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-900/40 border border-slate-850"
                                      >
                                        <span className="text-xs text-slate-300 italic">
                                          "{match.question}"
                                        </span>
                                        <span className="shrink-0 text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full font-mono">
                                          {match.similarity}% similarity
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-slate-500 italic">
                                    No previously asked questions were available to compare against at the time this question was submitted.
                                  </p>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <HelpCircle className="h-12 w-12 text-slate-650 mx-auto mb-4" />
              <p className="text-sm font-semibold">No questions found matching your criteria.</p>
              <p className="text-xs text-slate-500 mt-1">Try changing filters or submit a question from the dashboard.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
