import React from 'react'
import { useLogOut } from '../../hooks/useLogOut'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useState } from 'react'

export default function Header() {

  const { user } = useAuthContext();
  
  const { logout } = useLogOut()
  const handleLogout = () => {
    logout()
  }
  return (
  <header className="bg-slate-900 text-white shadow-md px-8 py-6">
  <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-center">
    <h1 className="text-3xl font-bold">DebugDen</h1>
    <nav className="mt-4 md:mt-0 flex items-center space-x-4">
      <a href="/" className="text-slate-300 hover:text-white font-medium">Home</a>
      <a href="/topics" className="text-slate-300 hover:text-white font-medium">Topics</a>

      {!user && (
        <div className="flex items-center space-x-3">
          <a href="/login" className="text-slate-300 hover:text-white font-medium">Login</a>
          <a href="/register" className="text-slate-300 hover:text-white font-medium">Register</a>
        </div>
      )}

      {user && (
        <div className="flex items-center space-x-3">
          <form >
            <button
              type="submit"
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-1.5 rounded-md transition duration-150"
            >
              Log Out
            </button>
          </form>
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-700 hover:bg-slate-600 transition duration-150"
          onClick={() => window.location.href = '/profile'}>
            {/* Example SVG User Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
              strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0" />
            </svg>
          </button>
        </div>
      )}
    </nav>
  </div>
</header>

  )
}
