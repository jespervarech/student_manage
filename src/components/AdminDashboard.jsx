// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BarChart from './Charts/BarChart';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats', {
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Administrateur</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Nombre total d'utilisateurs</h2>
          <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Nombre total d'étudiants</h2>
          <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Nombre total de cours</h2>
          <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
        </div>
      </div>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Moyenne des notes par cours</h2>
        <BarChart data={stats.averageGrades} />
      </div>
    </div>
  );
};

export default AdminDashboard;