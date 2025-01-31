// src/components/ScolariteDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PieChart from './Charts/PieChart';

const ScolariteDashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/scolarite/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Scolarité</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Répartition des notes par cours</h2>
        <PieChart data={stats.gradesByCourse} />
      </div>
    </div>
  );
};

export default ScolariteDashboard;