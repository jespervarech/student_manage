import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUserContext } from "../context/UserContext";

const AdminLayout = () => {
  const { user } = useUserContext(); // Récupérer les infos utilisateur

  if (!user) {
    return <p>Chargement...</p>; // Ou redirigez vers la page de connexion si nécessaire
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar userRole={user.role} />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Dynamic Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout