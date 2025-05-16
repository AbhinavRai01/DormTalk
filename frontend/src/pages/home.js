import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate();
  return (
    
    <div>

        <main class="max-w-7xl mx-auto px-6 py-16">

    <section class="text-center mb-16">
      <h2 class="text-4xl font-bold text-slate-800 mb-4">Welcome to DebugDen</h2>
      <p class="text-lg text-slate-600">A place for developers to ask, answer, and share coding knowledge.</p>
    </section>


    <section class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1"  onClick={() => navigate('/add-question')}>
        <h3 class="text-xl font-semibold text-slate-800 mb-2">Ask Questions</h3>
        <p class="text-slate-600">Get help from the community on programming challenges and errors.</p>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1" onClick={() => navigate('/all-questions')}>
        <h3 class="text-xl font-semibold text-slate-800 mb-2">Share Knowledge</h3>
        <p class="text-slate-600">Answer questions, write tutorials, and contribute to discussions.</p>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1">
        <h3 class="text-xl font-semibold text-slate-800 mb-2">Explore Topics</h3>
        <p class="text-slate-600">Browse posts by tags like JavaScript, Python, C++, Web Dev, and more.</p>
      </div>
    </section>
  </main>
    </div>
  )
}
