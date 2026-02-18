import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Temples from './pages/Temples';
import TempleDetails from './pages/TempleDetails';
import Events from './pages/Events';
import Donations from './pages/Donations';
import Profile from './pages/Profile';
import Darshan from './pages/Darshan';
import Accommodation from './pages/Accommodation';
import Dashboard from './pages/Dashboard';

import './App.css';

// Layout component to handle conditional rendering of Navbar/Footer
const Layout = ({ children }) => {

  return (
    <div className="app">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/temples" element={<Temples />} />
            <Route path="/temples/:id" element={<TempleDetails />} />
            <Route path="/events" element={<Events />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/darshan" element={<Darshan />} />
            <Route path="/accommodation" element={<Accommodation />} />
            <Route path="/dashboard" element={<ProtectedRoute adminOnly={true}><Dashboard /></ProtectedRoute>} />
          </Routes>
          <Analytics />
          <SpeedInsights />
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
