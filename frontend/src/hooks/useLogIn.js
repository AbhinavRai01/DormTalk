import React from 'react'
import { useAuthContext } from './useAuthContext'
import { useState } from 'react'

export const useLogIn = () => {
    const { dispatch } = useAuthContext()

    const  [error, setError] = useState(null);
    const  [isLoading, setIsLoading] = useState(null);
    
    const logIn = async (userId, password) => {
        const response = await fetch('https://dormtalk.onrender.com/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
        })
    
        const json = await response.json()
    
        if (response.ok) {
        // save the user to local storage
        localStorage.setItem('user', JSON.stringify(json))
    
        // update the auth context
        dispatch({ type: 'LOGIN', payload: json })
        }
    }
    
    return { logIn, isLoading, error};

}

