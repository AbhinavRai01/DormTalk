import React from 'react'

export default function Header() {
  return (
    <header class="bg-slate-900 text-white shadow-md px-8 py-6">
    <div class="w-[100%] mx-auto flex flex-col md:flex-row justify-between items-center">
      <h1 class="text-3xl font-bold">DebugDen</h1>
      <nav class="mt-4 md:mt-0">
        <a href="/" class="text-slate-300 hover:text-white mx-3 font-medium">Home</a>
        <a href="/topics" class="text-slate-300 hover:text-white mx-3 font-medium">Topics</a>
        <a href="/login" class="text-slate-300 hover:text-white mx-3 font-medium">Login</a>
        <a href="/register" class="text-slate-300 hover:text-white mx-3 font-medium">Register</a>
      </nav>
    </div>
  </header>
  )
}
