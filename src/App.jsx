import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Temples from './pages/Temples';

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

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/temples" element={<Temples />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
