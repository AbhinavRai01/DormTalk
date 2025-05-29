import React from 'react';
import { createContext, useReducer } from 'react';
import { useEffect, useState } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload };
        case 'LOGOUT':
            return { user: null };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, {user:null});
    const [userObject, setUserObject] = useState({});

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            dispatch({ type: 'LOGIN', payload: user });

            const fetchUserObject = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/users/' + user.userId);
                if (res.ok) {
                    const data = await res.json();
                    setUserObject(data);
                } else {
                    console.error("Failed to fetch user object");
                }
            } catch (error) {
                console.error("Error fetching user object:", error);
            }
        };

        fetchUserObject();

        }

    }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch, userObject }}>
      {children}
    </AuthContext.Provider>
  )
}
