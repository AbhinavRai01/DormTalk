import React from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogOut = () => {
    const { dispatch } = useAuthContext()

        const logout = () => {
            // remove user from local storage
            localStorage.removeItem('user');
            // update the auth context
            dispatch({ type: 'LOGOUT' });
        }

        return { logout};  
}

