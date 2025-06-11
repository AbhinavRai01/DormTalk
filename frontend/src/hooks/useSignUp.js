import React from 'react'
import { useAuthContext } from './useAuthContext'
import { useState } from 'react'

export const useSignUp = () => {
    const { dispatch } = useAuthContext()

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const signUp = async (name, userId, password) => {
        const response = await fetch('http://localhost:5000/api/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, userId, password }),
        })

        const json = await response.json()

        if (response.ok) {
            // save the user to local storage
            localStorage.setItem('user', JSON.stringify(json))

            // update the auth context
            dispatch({ type: 'LOGIN', payload: json })
       
            setIsLoading(false);
            return { success: true }; // ✅ return success
        } else {
            setError(json.error);
            setIsLoading(false);
            return { success: false, error: json.error }; // ✅ return error
        }
    }

    return { signUp, isLoading, error };

}

