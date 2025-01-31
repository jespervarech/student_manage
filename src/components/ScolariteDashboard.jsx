// src/components/ScolariteDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PieChart from './Charts/PieChart';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ScolariteDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCourses: 0,
        gradesByCourse: [],
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:8010/api/scolarite/stats', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                console.log("API Response:", response.data); // Debugging
                setStats(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des statistiques:', error);
            }
        };

        fetchStats();
    }, []);

    // Données pour le graphique en barres
    const barChartData = {
        labels: stats.gradesByCourse.map(course => course.courseName),
        datasets: [
            {
                label: "Moyenne des Notes",
                data: stats.gradesByCourse.map(course => course.avgGrade),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }
        ]
    };

    const pieChartData = {
        labels: stats.gradesByCourse.map(course => course.courseName),
        datasets: [
            {
                data: stats.gradesByCourse.map(course => course.avgGrade),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
            }
        ]
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Dashboard Scolarité</h1>

            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Total des étudiants */}
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Total des étudiants</h2>
                    <p className="text-4xl font-bold text-blue-600">{stats.totalStudents}</p>
                </div>

                {/* Total des matières */}
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Total des matières</h2>
                    <p className="text-4xl font-bold text-green-600">{stats.totalCourses}</p>
                </div>

                {/* Cours avec la meilleure moyenne */}
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Meilleure matière</h2>
                    <p className="text-xl font-bold text-purple-600">
                        {stats.gradesByCourse.length > 0
                            ? stats.gradesByCourse.reduce((prev, current) => (prev.avgGrade > current.avgGrade ? prev : current)).courseName
                            : "N/A"}
                    </p>
                </div>
            </div>

            {/* Tableau des statistiques par matière */}
            {stats.gradesByCourse.length > 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">📘 Statistiques par matière</h2>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2">Matière</th>
                                    <th className="border border-gray-300 px-4 py-2">Moyenne</th>
                                    <th className="border border-gray-300 px-4 py-2">Meilleure Note</th>
                                    <th className="border border-gray-300 px-4 py-2">Pire Note</th>
                                    <th className="border border-gray-300 px-4 py-2">Total des Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.gradesByCourse.map((course, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="border border-gray-300 px-4 py-2">{course.courseName}</td>
                                        <td className="border border-gray-300 px-4 py-2">{course.avgGrade}</td>
                                        <td className="border border-gray-300 px-4 py-2">{course.maxGrade}</td>
                                        <td className="border border-gray-300 px-4 py-2">{course.minGrade}</td>
                                        <td className="border border-gray-300 px-4 py-2">{course.totalGrades}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 text-center mt-6">Aucune donnée disponible pour les matières.</p>
            )}

            {/* Graphique des moyennes des matières */}
            {stats.gradesByCourse.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">📊 Moyenne des Notes par Matière</h2>
                    <div style={{ height: '300px' }}>
                        <Bar data={barChartData} />
                    </div>
                </div>
            )}

        </div>


    );
};


export default ScolariteDashboard;
