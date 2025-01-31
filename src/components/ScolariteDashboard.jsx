import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import {
    GraduationCap,
    BookOpen,
    Trophy,
    Users,
    TrendingUp,
    Award
} from 'lucide-react';

const ScolariteDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCourses: 0,
        gradesByCourse: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:8010/api/scolarite/stats', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setStats(response.data);
                setLoading(false);
            } catch (error) {
                setError('Erreur lors de la récupération des statistiques');
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const barChartData = {
        labels: stats.gradesByCourse.map(course => course.courseName),
        datasets: [{
            label: "Moyenne des Notes",
            data: stats.gradesByCourse.map(course => Number(course.avgGrade) || 0),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1
        }]
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
            </div>
        );
    }

    const getBadgeColor = (value, type) => {
        const numValue = Number(value) || 0;
        if (type === 'grade') {
            if (numValue >= 16) return 'bg-green-100 text-green-800';
            if (numValue >= 14) return 'bg-blue-100 text-blue-800';
            if (numValue >= 12) return 'bg-yellow-100 text-yellow-800';
            return 'bg-red-100 text-red-800';
        }
        return 'bg-gray-100 text-gray-800';
    };

    // Helper function to safely format numbers
    const formatNumber = (value) => {
        const num = Number(value);
        return isNaN(num) ? "0.00" : num.toFixed(2);
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="flex items-center mb-8">
                <GraduationCap className="text-blue-600 mr-3" size={32} />
                <h1 className="text-3xl font-bold text-gray-800">Dashboard Scolarité</h1>
            </div>

            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-gray-500 text-sm font-semibold">Total Étudiants</h2>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalStudents}</p>
                        </div>
                        <Users className="text-blue-500" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-gray-500 text-sm font-semibold">Total Matières</h2>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalCourses}</p>
                        </div>
                        <BookOpen className="text-green-500" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-gray-500 text-sm font-semibold">Meilleure Moyenne</h2>
                            <p className="text-3xl font-bold text-gray-800 mt-1">
                                {stats.gradesByCourse.length > 0
                                    ? formatNumber(Math.max(...stats.gradesByCourse.map(course => Number(course.avgGrade) || 0)))
                                    : "N/A"}
                            </p>
                        </div>
                        <Trophy className="text-yellow-500" size={24} />
                    </div>
                </div>
            </div>

            {/* Graphique */}
            {stats.gradesByCourse.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex items-center mb-4">
                        <TrendingUp className="text-blue-600 mr-2" size={20} />
                        <h2 className="text-xl font-semibold text-gray-800">Moyenne par Matière</h2>
                    </div>
                    <div className="h-[300px]">
                        <Bar data={barChartData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                }
                            }
                        }} />
                    </div>
                </div>
            )}

            {/* Tableau détaillé */}
            {stats.gradesByCourse.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-4">
                        <Award className="text-blue-600 mr-2" size={20} />
                        <h2 className="text-xl font-semibold text-gray-800">Détails par Matière</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matière</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moyenne</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note Max</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note Min</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {stats.gradesByCourse.map((course, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <BookOpen size={16} className="text-gray-400 mr-2" />
                                                <span className="text-sm font-medium text-gray-900">{course.courseName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-sm ${getBadgeColor(course.avgGrade, 'grade')}`}>
                                                {formatNumber(course.avgGrade)}/20
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(course.maxGrade)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(course.minGrade)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                                                {course.totalGrades}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900">Aucune donnée disponible</h3>
                    <p className="mt-1 text-sm text-gray-500">Les statistiques apparaîtront ici une fois disponibles.</p>
                </div>
            )}
        </div>
    );
};

export default ScolariteDashboard;