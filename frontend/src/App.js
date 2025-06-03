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
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Profile from './pages/ProfilePage';
import EditProfile from './pages/EditProfile';
import NewHome from './pages/NewHome';

function App() {
  return (
    <div className="App" >
      <Header />
      <main className="font-lexend max-w-7xl mx-auto px-3 py-10 sm: px-6">
        <Router>
          <Routes>
            <Route path="/" element={<NewHome />} />
            <Route path="/all-questions" element={<AllQuestions />} />
            <Route path="/all-questions/:questionId" element={<SpecificQuestion />} />
            <Route path="/add-question" element={<AddQuestion />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:userId" element={<Profile/>} />
            <Route path='/edit-profile' element={<EditProfile />} />
            <Route path="/new-home" element={<NewHome />} />
          </Routes>
        </Router>
      </main>
      <Footer />
    </div>
     
     
  );
}

export default App;
