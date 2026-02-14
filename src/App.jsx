import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TopicDetail from './pages/TopicDetail';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={<PrivateRoute><Dashboard /></PrivateRoute>} 
          />
          <Route 
            path="/topic/:id" 
            element={<PrivateRoute><TopicDetail /></PrivateRoute>} 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;