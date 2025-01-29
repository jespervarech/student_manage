import { RouterProvider } from "react-router-dom";
import React, { useEffect } from "react";
import AppRoute from "./AppRoute";
import { UserContext, UserProvider, useUserContext } from "./context/UserContext";

/*

function AppContent() {
  const { user, initializeUserFromToken } = useUserContext();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si le token est présent et si l'utilisateur n'a pas encore été initialisé
    if (token && !user) {
      initializeUserFromToken(token); // Initialisez le contexte utilisateur avec le token
    }
  }, [user, initializeUserFromToken]);  // Ajoutez 'user' dans les dépendances

  return <RouterProvider router={AppRoute} />;
}*/


function App() {
  return (
    <UserProvider>  {/* Utilisez UserProvider, pas UserContext.Provider */}
      <RouterProvider router={AppRoute} />
    </UserProvider>


  );
}

export default App;

/** 
<UserProvider>
<AppContent />
</UserProvider>

**/