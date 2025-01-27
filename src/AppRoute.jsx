import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";
import Login from "./pages/auth/Login";
import Etudiant from "./pages/gestion/Etudiant";
import Grade from "./pages/gestion/Grade";

const AppRoute = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "users", element: <Users /> },
      { path: "settings", element: <Settings /> },
      { path: "etudiants", element: <Etudiant /> },
      { path: "classes", element: <Grade /> },
    ],
  },
]);

export default AppRoute;