import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-6 text-indigo-600">
          <BookOpen size={48} />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600">Email</label>
            <input 
              type="email" 
              className="mt-1 w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Password</label>
            <input 
              type="password" 
              className="mt-1 w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium cursor-pointer"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-indigo-600 hover:underline cursor-pointer"
          >
            {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}