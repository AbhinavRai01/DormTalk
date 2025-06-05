import React from 'react'
import { useAuthContext } from './useAuthContext'
import { useState } from 'react'

export const useLogIn = () => {
    const { dispatch } = useAuthContext()

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const logIn = async (userId, password) => {
        const response = await fetch('https://dormtalk.onrender.com/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, password }),
        })

        const json = await response.json()

        if (response.ok) {
            // save the user to local storage
            console.log("login successful:", json);
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

    return { logIn, isLoading, error };

}

