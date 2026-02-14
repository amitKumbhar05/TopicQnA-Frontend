import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Plus, ChevronDown, ChevronUp, RefreshCw, Trash2, FileText } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useQuestions, useCreateQuestion, useDeleteQuestion, useReviseQuestion } from '../hooks/useData';

export default function TopicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: questions, isLoading } = useQuestions(id);
  const createMutation = useCreateQuestion(id);
  const deleteMutation = useDeleteQuestion(id);
  const reviseMutation = useReviseQuestion(id);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [qText, setQText] = useState('');
  const [aText, setAText] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(
      { question_text: qText, answer_text: aText },
      {
        onSuccess: () => {
          setQText('');
          setAText('');
          setIsFormOpen(false);
        }
      }
    );
  };

  const handleRevision = (qid, e) => {
    e.stopPropagation();
    reviseMutation.mutate(qid);
  };

  const handleDelete = (qid) => {
    if(!window.confirm("Delete this question?")) return;
    deleteMutation.mutate(qid);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors font-medium text-sm group"
        >
          <div className="p-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mr-2 group-hover:border-slate-300 dark:group-hover:border-slate-500 transition-colors">
            <ArrowLeft size={16} />
          </div>
          Back to Library
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Questions & Notes</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{questions?.length || 0} items in this collection</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={18} className="mr-2" />
          Add Question
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-indigo-100 dark:border-indigo-900/50 mb-8 overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <div className="px-6 py-4 bg-indigo-50/50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-900/50">
             <h3 className="font-semibold text-indigo-900 dark:text-indigo-300">New Entry</h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Question</label>
              <input 
                autoFocus
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={qText} 
                onChange={e => setQText(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Answer <span className="text-slate-400 font-normal ml-1">(Markdown supported)</span>
              </label>
              <textarea 
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-3 rounded-lg h-48 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-y"
                value={aText} 
                onChange={e => setAText(e.target.value)}
                placeholder="# Key Points..."
                required 
              />
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-50 dark:border-slate-800">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer">Save Entry</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {questions?.map((q) => (
          <div key={q.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
            <div 
              className="px-6 py-5 flex items-start justify-between cursor-pointer group bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors select-none"
              onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
            >
              <h3 className="flex-1 pr-4 text-base font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                  {q.question_text}
              </h3>
              <div className="flex items-center gap-4 shrink-0 mt-0.5">
                <div 
                  className="hidden sm:flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700"
                >
                  <RefreshCw size={12} className="mr-1.5 text-slate-400 dark:text-slate-500" />
                  {q.revision_count}
                </div>
                <div className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400">
                    {expandedId === q.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
            </div>

            {expandedId === q.id && (
              <div className="px-8 pb-8 pt-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 animate-in slide-in-from-top-1 duration-200">
                <article className="prose prose-slate dark:prose-invert prose-sm max-w-none prose-a:text-indigo-600 dark:prose-a:text-indigo-400">
                  <ReactMarkdown>{q.answer_text}</ReactMarkdown>
                </article>
                
                <div className="mt-8 pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-end items-center gap-3">
                  <button onClick={() => handleDelete(q.id)} className="flex items-center text-sm text-slate-400 hover:text-red-600 dark:hover:text-red-400 px-3 py-1.5 cursor-pointer">
                    <Trash2 size={16} className="mr-1.5"/> Delete
                  </button>
                  <button onClick={(e) => handleRevision(q.id, e)} className="flex items-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer">
                    <RefreshCw size={16} className="mr-2" /> Mark as Revised
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}