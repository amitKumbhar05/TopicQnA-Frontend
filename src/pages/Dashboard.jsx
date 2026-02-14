import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Book, LogOut } from 'lucide-react';
import { auth } from '../firebase';

export default function Dashboard() {
  const [topics, setTopics] = useState([]);
  const [newTopicName, setNewTopicName] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await api.get('/topics/');
      setTopics(res.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTopicName) return;
    try {
      await api.post('/topics/', { name: newTopicName });
      setNewTopicName('');
      setShowModal(false);
      fetchTopics();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if(!window.confirm("Delete this topic and all its questions?")) return;
    try {
      await api.delete(`/topics/${id}`);
      fetchTopics();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">My Study Topics</h1>
        <button 
          onClick={() => auth.signOut()} 
          className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition cursor-pointer"
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add New Card */}
        <button 
          onClick={() => setShowModal(true)}
          className="group border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition h-48 cursor-pointer"
        >
          <div className="bg-slate-100 p-3 rounded-full group-hover:bg-indigo-100 transition mb-3">
            <Plus size={28} />
          </div>
          <span className="font-medium">Create New Topic</span>
        </button>

        {/* Topic Cards */}
        {topics.map((topic) => (
          <Link key={topic.id} to={`/topic/${topic.id}`} className="block group">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition duration-300 h-48 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 transition group-hover:bg-indigo-100"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Book className="text-indigo-500" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 truncate">
                  {topic.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Created {new Date(topic.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex justify-end relative z-10">
                <button 
                  onClick={(e) => handleDelete(topic.id, e)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-slate-800">Add New Topic</h3>
            <form onSubmit={handleCreate}>
              <input
                autoFocus
                className="w-full border border-slate-300 p-3 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. System Design, React Patterns..."
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
                >
                  Create Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}