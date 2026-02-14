import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Plus, ChevronDown, ChevronUp, RefreshCw, Trash2 } from 'lucide-react';

export default function TopicDetail() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [qText, setQText] = useState('');
  const [aText, setAText] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadQuestions();
  }, [id]);

  const loadQuestions = async () => {
    try {
      const res = await api.get(`/topics/${id}/questions`);
      setQuestions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/topics/${id}/questions`, { question_text: qText, answer_text: aText });
      setQText('');
      setAText('');
      setIsFormOpen(false);
      loadQuestions();
    } catch (error) {
      alert("Error adding question");
    }
  };

  const handleRevision = async (qid, e) => {
    e.stopPropagation(); // Prevent toggling accordion
    try {
      await api.post(`/questions/${qid}/revise`);
      setQuestions(prev => prev.map(q => 
        q.id === qid ? { ...q, revision_count: q.revision_count + 1 } : q
      ));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (qid) => {
    if(!confirm("Delete question?")) return;
    try {
      await api.delete(`/questions/${qid}`);
      setQuestions(prev => prev.filter(q => q.id !== qid));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen pb-20">
      <div className="mb-8 flex items-center justify-between sticky top-0 bg-slate-50 py-4 z-20">
        <Link to="/" className="flex items-center text-slate-500 hover:text-indigo-600 transition font-medium">
          <ArrowLeft size={20} className="mr-2" /> Back to Topics
        </Link>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-full flex items-center shadow-lg hover:bg-indigo-700 hover:shadow-indigo-200 transition transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus size={20} className="mr-2" /> Add Question
        </button>
      </div>

      {/* Add Question Form */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="font-bold text-lg mb-4 text-slate-800">New Question</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-600 mb-1">Question</label>
              <input 
                className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={qText} 
                onChange={e => setQText(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-600 mb-1">Answer (Markdown Supported)</label>
              <textarea 
                className="w-full border border-slate-300 p-3 rounded-lg h-40 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={aText} 
                onChange={e => setAText(e.target.value)}
                placeholder="## Use Markdown here..."
                required 
              />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setIsFormOpen(false)} className="text-slate-500 hover:text-slate-800 px-4 py-2 cursor-pointer">Cancel</button>
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer">Save Question</button>
            </div>
          </form>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length === 0 && (
          <div className="text-center text-slate-400 py-16 bg-white rounded-2xl border border-dashed border-slate-300">
            <p>No questions here yet.</p>
            <p className="text-sm">Click "Add Question" to start building your knowledge base.</p>
          </div>
        )}

        {questions.map((q) => (
          <div key={q.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
            
            {/* Header */}
            <div 
              className="p-5 flex items-center justify-between cursor-pointer bg-slate-50/50 hover:bg-white transition select-none"
              onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
            >
              <h3 className="font-semibold text-slate-800 text-lg flex-1 pr-4">{q.question_text}</h3>
              <div className="flex items-center gap-4">
                <div 
                  className="flex items-center text-xs font-medium text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-sm"
                  title="Times Revised"
                >
                  <RefreshCw size={12} className="mr-1.5 text-indigo-500" />
                  {q.revision_count}
                </div>
                {expandedId === q.id ? <ChevronUp size={20} className="text-slate-400"/> : <ChevronDown size={20} className="text-slate-400"/>}
              </div>
            </div>

            {/* Answer (Accordion) */}
            {expandedId === q.id && (
              <div className="p-6 border-t border-slate-100 bg-white animate-in slide-in-from-top-2 duration-200">
                <article className="prose prose-slate prose-sm max-w-none prose-headings:text-indigo-900 prose-a:text-indigo-600">
                  <ReactMarkdown>{q.answer_text}</ReactMarkdown>
                </article>
                
                <div className="mt-8 pt-4 border-t border-slate-50 flex justify-between items-center">
                  <button 
                    onClick={() => handleDelete(q.id)}
                    className="text-red-400 hover:text-red-600 flex items-center text-sm transition cursor-pointer"
                  >
                    <Trash2 size={16} className="mr-1"/> Delete
                  </button>

                  <button 
                    onClick={(e) => handleRevision(q.id, e)}
                    className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 hover:shadow-sm transition cursor-pointer"
                  >
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