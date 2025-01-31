import { RouterProvider } from "react-router-dom";
import React, { useEffect } from "react";
import AppRoute from "./AppRoute";
import { UserContext, UserProvider, useUserContext } from "./context/UserContext";


function App() {
  return (
    <UserProvider>
      <RouterProvider router={AppRoute} />
    </UserProvider>


  );
}

export default App;

