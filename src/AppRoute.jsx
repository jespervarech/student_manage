import { createBrowserRouter } from "react-router-dom";

import Matiere from "./pages/gestion/Matiere";

import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";
import Login from "./pages/auth/Login";
import Etudiant from "./pages/gestion/Etudiant";
import Grade from "./pages/gestion/Grade";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Logout from "./pages/auth/Logout";
import Profile from "./pages/admin/Profile";
import AdminDashboard from "./components/AdminDashboard";
import ScolariteDashboard from "./components/ScolariteDashboard";
import StudentDashboard from "./components/StudentDashboard";
import GradeEtudiant from "./pages/gestion/GradeEtudiant";

const AppRoute = createBrowserRouter([
  {
    path: "/", element: <Home />
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element:
      <AdminLayout />,
    children: [
      { path: "homeadmin", element: <AdminDashboard /> },
      { path: "gradesstudents", element: <GradeEtudiant /> },
      { path: "homestudent", element: <StudentDashboard /> },
      { path: "homescolarite", element: <ScolariteDashboard /> },
      { path: "register", element: <Register /> },
      { path: "grades", element: <Grade /> },
      { path: "matiere", element: <Matiere /> },
      { path: "users", element: <Users /> },
      { path: "settings", element: <Settings /> },
      { path: "etudiants", element: <Etudiant /> },
      { path: "logout", element: <Logout /> },
      { path: "users", element: <Users /> },
      { path: "profile", element: <Profile /> },
    ],
  },

]);

export default AppRoute;