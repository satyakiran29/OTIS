import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';
import TermsOfService from './pages/Policies/TermsOfService';
import PrivacyPolicy from './pages/Policies/PrivacyPolicy';
import Temples from './pages/Temples/Temples';
import TempleDetails from './pages/TempleDetails/TempleDetails';
import Events from './pages/Events/Events';
import AdminEvents from './pages/AdminEvents/AdminEvents';
import Donations from './pages/Donations/Donations';
import Profile from './pages/Profile/Profile';
import Darshan from './pages/Darshan/Darshan';
import Dashboard from './pages/Dashboard/Dashboard';

import './App.css';

import Chatbot from './components/Chatbot/Chatbot';

// Layout component to handle conditional rendering of Navbar/Footer
const Layout = ({ children }) => {

  return (
    <div className="app">
      <Navbar />
      <Chatbot />
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

  if (adminOnly && user.role !== 'admin' && user.role !== 'super-admin') {
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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/temples" element={<Temples />} />
            <Route path="/temples/:id" element={<TempleDetails />} />
            <Route path="/events" element={<Events />} />
            <Route path="/admin/events" element={<ProtectedRoute adminOnly={true}><AdminEvents /></ProtectedRoute>} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/darshan" element={<Darshan />} />
            <Route path="/dashboard" element={<ProtectedRoute adminOnly={true}><Dashboard /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
