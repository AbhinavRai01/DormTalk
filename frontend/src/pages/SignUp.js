import React from 'react'
import { useSignUp } from '../hooks/useSignUp'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const { signUp, isLoading, error } = useSignUp();
    const [errorMessage, setErrorMessage] = useState('');

    const [name, setName] = useState('');
    const [userId, setuserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()

        const res = await signUp(name, userId, password);
        if (res.success) {
            navigate('/');
        }else{
            console.log(res.error);
            setErrorMessage(res.error);
        }
        
    }

  return (
<div class=" flex items-center justify-center px-4">
  <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
    <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h1>
    <form action="/signup" method="POST" class="space-y-5">
    <div>
        <label for="userId" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input type="text" id="userId" name="userId" value={name} required
          class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:outline-none" onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label for="userId" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input type="text" id="userId" name="userId" value={userId} required
          class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:outline-none" onChange={(e) => setuserId(e.target.value)} />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input type="password" id="password" name="password" required value={password}
          class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:outline-none" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium" onClick={handleSubmit}>
        Sign Up
      </button>
      {errorMessage && <div className="mt-4 text-red-500 text-sm">{errorMessage}</div>}
    </form>
    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
  </div>
</div>

  )
}
