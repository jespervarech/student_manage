// src/pages/Admin/Dashboard.jsx
import { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";


const Dashboard = () => {
  const { user } = useUserContext();
  useEffect(() => {
    console.log("User context in dashboard:", user);
  }, [user]);
  if (!user) return <div>Loading...</div>;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>
      <p>Bienvenue {user.name} sur le tableau de bord de l'admin.</p>
    </div>
  );
};

export default Dashboard;