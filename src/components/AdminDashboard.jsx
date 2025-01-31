import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Users, GraduationCap, Book, Star } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalCourses: 0,
        averageGrades: 0,
        topStudents: [],
        flopStudents: [],
        gradesByCourse: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:8010/api/admin/stats', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            colorClass: "text-primary"
        },
        {
            title: "Total Students",
            value: stats.totalStudents,
            icon: GraduationCap,
            colorClass: "text-success"
        },
        {
            title: "Total Courses",
            value: stats.totalCourses,
            icon: Book,
            colorClass: "text-purple"
        },
        {
            title: "Average Grade",
            value: stats.averageGrades?.toFixed(2) || 'N/A',
            icon: Star,
            colorClass: "text-warning"
        }
    ];

    const courseGradeData = {
        labels: stats.gradesByCourse?.map(course => course.name) || [],
        datasets: [
            {
                label: "Average Grade",
                data: stats.gradesByCourse?.map(course => course.avgGrade) || [],
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }
        ]
    };

    return (
        <div className="container-fluid p-4">
            <div className="d-flex align-items-center mb-4">
                <BarChart className="me-2" size={24} />
                <h1 className="h3 mb-0">Admin Dashboard</h1>
            </div>

            <div className="row g-4">
                {statCards.map((stat, index) => (
                    <div key={index} className="col-12 col-md-6 col-lg-3">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="card-subtitle text-muted">{stat.title}</h6>
                                    <stat.icon className={`${stat.colorClass}`} size={16} />
                                </div>
                                <h2 className="card-title mb-0">{stat.value?.toLocaleString() || 0}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Course Average Grades</h5>
                            <div style={{ height: '300px' }}>
                                <Bar data={courseGradeData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Students */}
            <div className="row mt-4">
                <div className="col-12 col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Top 3 Students</h5>
                            <ul className="list-group">
                                {stats.topStudents.map((student, index) => (
                                    <li key={index} className="list-group-item">
                                        {student?.firstName || "N/A"} {student?.lastName || "N/A"} - {student?.avgGrade?.toFixed(2) || "N/A"}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Flop Students */}
                <div className="col-12 col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Bottom 3 Students</h5>
                            <ul className="list-group">
                                {stats.flopStudents.map((student, index) => (
                                    <li key={index} className="list-group-item">
                                        {student?.firstName || "N/A"} {student?.lastName || "N/A"} - {student?.avgGrade?.toFixed(2) || "N/A"}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default AdminDashboard;
