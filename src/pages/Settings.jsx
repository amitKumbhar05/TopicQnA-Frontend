import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Moon, Sun, Monitor, LogOut, User, Shield } from 'lucide-react';
import { auth } from '../firebase';

export default function Settings() {
  const { theme, setTheme } = useTheme(); // Updated to expose setTheme directly
  const { currentUser } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Settings</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Manage your account and preferences.</p>

      {/* Appearance Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Monitor size={18} /> Appearance
          </h2>
        </div>
        
        <div className="p-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Interface Theme</label>
          <div className="grid grid-cols-3 gap-4">
            
            {/* Light Option */}
            <button
              onClick={() => setTheme('light')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                theme === 'light' 
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500'
              }`}
            >
              <Sun size={24} className="mb-2" />
              <span className="text-sm font-medium">Light</span>
            </button>

            {/* Dark Option */}
            <button
              onClick={() => setTheme('dark')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                theme === 'dark' 
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500'
              }`}
            >
              <Moon size={24} className="mb-2" />
              <span className="text-sm font-medium">Dark</span>
            </button>

            {/* System Option (Manual Implementation) */}
            {/* For simplicity we stick to manual toggles, but you could add System here later */}
          </div>
        </div>
      </section>

      {/* Account Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <User size={18} /> Account
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <div className="flex items-center text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="flex-1">{currentUser?.email}</span>
              <Shield size={16} className="text-green-500 ml-2" />
            </div>
            <p className="text-xs text-slate-500 mt-2">Managed via Firebase Authentication</p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => auth.signOut()}
              className="flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors cursor-pointer"
            >
              <LogOut size={16} className="mr-2" />
              Sign out of your account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}