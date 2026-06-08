import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollReveal from './components/ScrollReveal';

// Pages
import Home from './pages/Home';
import TimInti from './pages/TimInti';
import Divisi from './pages/Divisi';
import Galeri from './pages/Galeri';
import Rekrutasi from './pages/Rekrutasi';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <ScrollReveal />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tim-inti" element={<TimInti />} />
            <Route path="/divisi" element={<Divisi />} />
            <Route path="/galeri" element={<Galeri />} />
            <Route path="/rekrutasi" element={<Rekrutasi />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
