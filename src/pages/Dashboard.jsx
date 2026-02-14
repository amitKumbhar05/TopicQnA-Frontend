import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Folder, Calendar } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTopics, useCreateTopic, useDeleteTopic } from '../hooks/useData';

export default function Dashboard() {
  const { data: topics, isLoading, isError } = useTopics();
  const createTopic = useCreateTopic();
  const deleteTopic = useDeleteTopic();

  const [newTopicName, setNewTopicName] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTopicName) return;
    createTopic.mutate(newTopicName, {
      onSuccess: () => {
        setNewTopicName('');
        setShowModal(false);
      }
    });
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!window.confirm("Delete this topic?")) return;
    deleteTopic.mutate(id);
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div className="text-red-500">Failed to load topics.</div>;

  return (
    <div>
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Library</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your study topics.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={18} className="mr-2" />
          New Topic
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics?.map((topic) => (
          <Link key={topic.id} to={`/topic/${topic.id}`} className="group block">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                  <Folder className="text-indigo-600 dark:text-indigo-400" size={24} />
                </div>
                <button
                  onClick={(e) => handleDelete(topic.id, e)}
                  className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {topic.name}
              </h3>
              
              <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                <Calendar size={14} className="mr-1.5" />
                <span>Created {new Date(topic.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
              <h3 className="font-semibold text-slate-900 dark:text-white">Create New Topic</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <Plus size={20} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Topic Name</label>
              <input
                autoFocus
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
              />
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTopic.isPending}
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
                >
                  {createTopic.isPending ? 'Creating...' : 'Create Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}