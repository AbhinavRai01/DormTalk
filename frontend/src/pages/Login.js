import React from 'react'
import { useState } from 'react'
import { useLogIn } from '../hooks/useLogIn'
import {useNavigate} from 'react-router-dom'

export default function Login() {

  const navigate = useNavigate();

  const { logIn, isLoading, error } = useLogIn();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await logIn(userId, password);

    if (!error) {
      navigate('/');
    }
  }

  return (
    <div class="flex items-center justify-center px-4">
  <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
    <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Log In</h1>
    <form action="/login" method="POST" class="space-y-5">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input type="text" id="username" name="username" required
          class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
          onChange={(e) => setUserId(e.target.value)} value={userId}
          />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input type="password" id="password" name="password" required
          class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:outline-none" 
          onChange={(e) => setPassword(e.target.value)} value={password} />
      </div>
      <button type="submit" onClick={handleSubmit} 
        class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium">
        Log In
      </button>
    </form>
    {error && <div class="mt-4 text-red-500 text-sm">{error}</div>}
  </div>
</div>

  )
}
