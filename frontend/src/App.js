import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import AllQuestions from './pages/AllQuestions';
import AddQuestion from './pages/AddQuestion';
import SpecificQuestion from './pages/SpecificQuestion';
import Header
 from './pages/components/Header';
import Footer from './pages/components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-16">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all-questions" element={<AllQuestions />} />
            <Route path="/all-questions/:questionId" element={<SpecificQuestion />} />
            <Route path="/add-question" element={<AddQuestion />} />
          </Routes>
        </Router>
      </main>
      <Footer />
    </div>
     
     
  );
}

export default App;
