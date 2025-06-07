import React, { useEffect } from 'react'
import { useLogOut } from '../../hooks/useLogOut'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useState } from 'react'
import { User } from 'lucide-react'

export default function Header() {

  const { user, userObject } = useAuthContext();
  
  const { logout } = useLogOut()
  const handleLogout = () => {
    logout()
  }

  useEffect(()=> {
    console.log("lund: ", userObject);
  }, [userObject])
  return (
  <header className="white font-lexend text-grey-900 shadow-md px-8 py-6">
    <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-center">
      <a href="/"><h1 className="text-3xl font-bold">DormTalk</h1></a>
      <nav className="mt-4 md:mt-0 flex items-center space-x-4">
        <a href="/add-question" className="ttext-grey-900 px-3 hover:text-grey-600 font-medium hidden md:inline">Ask a Question</a>
        <a href="/all-questions" className="text-grey-900 px-3 hover:text-grey-600 font-medium hidden md:inline">Answer Questions</a>

        {!user && (
          <div className="flex items-center space-x-3">
            <a href="/login" className="text-grey-900 px-3 hover:text-grey-600 font-medium">Login</a>
            <a href="/register" className="text-grey-900 px-3 hover:text-grey-600 font-medium">Register</a>
          </div>
        )}

        {user && (
          <div className="flex items-center space-x-3">
            <form>
              <button
                type="submit"
                onClick={handleLogout}
                className="bg-slate-300 hover:bg-red-700 font-medium px-4 py-1.5 rounded-md transition duration-150"
              >
                Log Out
              </button>
            </form>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-300 hover:bg-slate-600 transition duration-150"
              onClick={() => window.location.href = '/profile/' + user.userId}
            >
              <User color='grey'/>
            </button>
          </div>
        )}
      </nav>
    </div>
  </header>
  )
}
