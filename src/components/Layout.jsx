import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { 
  LayoutDashboard, LogOut, User, Menu, 
  BookOpen, Settings as SettingsIcon 
} from 'lucide-react';
import clsx from 'clsx';

export default function Layout() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Added Settings to navigation
  const navItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/30">
          <BookOpen className="text-white" size={18} />
        </div>
        <span className="font-bold text-slate-800 dark:text-white text-lg tracking-tight">Tracker</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={clsx(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <Icon size={20} className={clsx("mr-3", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800 mb-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
            <User size={20} />
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{currentUser?.email}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Free Plan</p>
          </div>
        </div>
        <button
          onClick={() => auth.signOut()}
          className="w-full flex items-center justify-center px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-100 transition-colors cursor-pointer"
        >
          <LogOut size={16} className="mr-2" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans transition-colors duration-300">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 dark:text-slate-300">
            <Menu size={24} />
          </button>
          <span className="font-bold text-slate-800 dark:text-white">Tracker</span>
          <div className="w-8"></div> {/* Spacer for balance */}
        </header>

        {/* Removed the absolute position Theme Toggle button from here */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}