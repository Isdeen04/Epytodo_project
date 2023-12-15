// AuthContext.js
import React, { useContext, createContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // Ajoutez ici la logique pour gérer le token d'authentification et autres informations d'authentification

  const setToken = (token) => {
    // Implémentez la logique pour stocker le token, par exemple dans le state local ou les cookies
    console.log('Token set:', token);
  };

  return (
    <AuthContext.Provider value={{ setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
