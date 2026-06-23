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
      'Biology': 'bg-green-50 text-green-700 border border-green-200',
      'Physics': 'bg-primary-50 text-primary-800 border border-primary-100',
      'Chemistry': 'bg-amber-50 text-amber-700 border border-amber-200',
      'Mathematics': 'bg-purple-50 text-purple-700 border border-purple-200',
      'Computer Science': 'bg-accent-50 text-accent-700 border border-accent-100',
    };
    return styles[tag] || 'bg-slate-100 text-slate-600 border border-slate-200';
  };

  const toggleRow = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-700 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Blur Circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary-800/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent-700/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-700">Question History</h1>
            <p className="text-slate-500 text-sm mt-1">Review, search, and filter your previously asked study questions</p>
          </div>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Keyword Search Bar */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search your questions by text..."
              className="w-full bg-white border border-slate-200 focus:border-accent-700 focus:ring-1 focus:ring-accent-700 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none transition-all text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Topic Dropdown Filter */}
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-accent-700 focus:ring-1 focus:ring-accent-700 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 focus:outline-none transition-all text-sm appearance-none cursor-pointer shadow-sm"
            >
              {tags.map((tag) => (
                <option key={tag} value={tag} className="bg-white text-slate-900">
                  {tag === 'All' ? 'All Topics' : tag}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200/60 text-red-700 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* History Table */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_1px_3px_rgba(30,58,138,0.1)] hover:shadow-[0_4px_6px_rgba(30,58,138,0.15)] transition-all">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader2 className="h-10 w-10 animate-spin text-primary-800 mb-4" />
              <p className="text-sm font-medium">Fetching history...</p>
            </div>
          ) : filteredQuestions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">Question</th>
                    <th className="py-4 px-6 w-36">Topic</th>
                    <th className="py-4 px-6 w-48">Date Asked</th>
                    <th className="py-4 px-6 w-40 text-center">Similar Matches</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQuestions.map((q, index) => {
                    const isExpanded = expandedRowId === q.id;
                    const matchesCount = q.similarQuestions?.length || 0;
                    const isEven = index % 2 === 0;
                    return (
                      <React.Fragment key={q.id}>
                        {/* Question Row */}
                        <tr
                          onClick={() => toggleRow(q.id)}
                          className={`${
                            isEven ? 'bg-white' : 'bg-slate-50/50'
                          } hover:bg-slate-100/50 transition-colors cursor-pointer text-sm`}
                        >
                          <td className="py-4 px-6 font-medium text-slate-700">
                            <div className="flex items-center gap-3">
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                              )}
                              <span className="line-clamp-2">{q.question}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getTagStyle(q.tag)}`}>
                              {q.tag}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-500">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              {formatDate(q.createdAt)}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                              matchesCount > 0 
                                ? 'bg-primary-50 text-primary-800 border border-primary-100' 
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}>
                              <Sparkles className="h-3 w-3" />
                              {matchesCount} {matchesCount === 1 ? 'match' : 'matches'}
                            </span>
                          </td>
                        </tr>

                        {/* Accordion Expand Details */}
                        {isExpanded && (
                          <tr className="bg-slate-50">
                            <td colSpan="4" className="py-4 px-8 border-t border-slate-200">
                              <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                  <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                                  Semantic Similarity Matches for this question
                                </h4>
                                {matchesCount > 0 ? (
                                  <div className="grid gap-2.5">
                                    {q.similarQuestions.map((match, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white border border-slate-200 shadow-sm"
                                      >
                                        <span className="text-xs text-slate-700 italic">
                                          "{match.question}"
                                        </span>
                                        <span className="shrink-0 text-xs font-bold text-accent-700 bg-accent-50 border border-accent-100 px-2 py-0.5 rounded-full font-mono">
                                          {match.similarity}% similarity
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-slate-400 italic">
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
            <div className="text-center py-20 text-slate-500">
              <HelpCircle className="h-12 w-12 text-slate-350 mx-auto mb-4" />
              <p className="text-sm font-semibold">No questions found matching your criteria.</p>
              <p className="text-xs text-slate-400 mt-1">Try changing filters or submit a question from the dashboard.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
