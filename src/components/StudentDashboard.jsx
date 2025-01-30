// src/components/StudentDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/student/stats', {
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mon Dossier</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Mes Notes</h2>
        <ul>
          {stats.grades?.map((grade, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Cours : {grade.courseId?.name}</span>
              <span className="text-gray-900 font-bold">Note : {grade.score}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;