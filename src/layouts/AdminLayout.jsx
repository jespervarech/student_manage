import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useUserContext } from "../context/UserContext";

const AdminLayout = () => {
  const { user, setUser } = useUserContext(); // Récupérer et mettre à jour les infos utilisateur
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'URL contient un token et les données utilisateur après l'authentification Google
    const urlParams = new URLSearchParams(window.location.search);
    const encodedToken = urlParams.get('token');
    const encodedUser = urlParams.get('user');

    if (encodedToken && encodedUser) {
      // Décoder le token et les informations utilisateur de l'URL
      const token = atob(encodedToken); // Décode le token (base64)
      const userInfo = JSON.parse(atob(encodedUser)); // Décode les informations utilisateur (base64)

      // Stocker le token et l'utilisateur dans le localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));

      // Mettre à jour le contexte utilisateur
      setUser(userInfo);

      // Rediriger vers le dashboard ou une autre page
      navigate('/admin/homestudent');
    } else {
      // Si pas de token dans l'URL, vérifier le localStorage pour récupérer les infos de l'utilisateur
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        // Si l'utilisateur est déjà stocké dans le localStorage, on le met dans le contexte
        setUser(JSON.parse(storedUser));
        setLoading(false);
      } else {
        // Si aucune info dans localStorage, rediriger vers la page de connexion
        navigate('/login');
      }
    }
  }, [navigate, setUser]);

  // Attendre que l'utilisateur soit chargé
  if (loading) {
    return <p>Chargement...</p>; // Ou rediriger vers la page de connexion si nécessaire
  }
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar userRole={user.role} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar user={user} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="container mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>

  );
};

export default AdminLayout;
