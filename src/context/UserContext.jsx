import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const initializeUserFromToken = (token) => {
    try {
      // Décodage du token
      const decodedToken = jwtDecode(token);
      // Récupération des informations utilisateur stockées
      const storedUser = localStorage.getItem('user');
      const userInfo = storedUser ? JSON.parse(storedUser) : null;

      // Combine les informations
      setUser({
        ...decodedToken,
        ...userInfo
      });
    } catch (error) {
      console.error("Error decoding token", error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      initializeUserFromToken(token);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, initializeUserFromToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext doit être utilisé dans un UserProvider");
  }
  return context;
};