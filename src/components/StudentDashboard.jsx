import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';
import {
    GraduationCap,
    BookOpen,
    Star,
    UserCircle
} from 'lucide-react';

const StudentDashboard = () => {
    const [studentData, setStudentData] = useState({
        student: {},
        grades: [],
        averageGrade: 0,
        totalCourses: 0
    });

    // Utiliser le contexte pour récupérer l'userId
    const { user } = useUserContext();
    useEffect(() => {
        console.log("useEffect triggered");
        const fetchStudentStats = async () => {
            try {


                // Vérifier si userId est disponible
                if (!user) {
                    console.error('User ID not found!');
                    return;
                }

                // Envoie de la requête avec le userId dans les params
                const response = await axios.get('http://localhost:8010/api/student/stats', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    params: { userId: user.id } // `params` permet d'envoyer les données dans la query string
                });

                setStudentData(response.data);
            } catch (error) {
                console.error('Error fetching student statistics:', error);
            }
        };

        // Si userId est défini, on fait la requête API
        if (user) {
            fetchStudentStats();
        }
    }, [user]); // La requête sera refaite à chaque changement de userId

    const statCards = [
        {
            title: "Student Name",
            value: studentData.student?.firstName || 'N/A', // Utiliser firstName ici
            icon: UserCircle,
            colorClass: "text-primary"
        },
        {
            title: "Average Grade",
            value: studentData.averageGrade?.toFixed(2) || 'N/A',
            icon: Star,
            colorClass: "text-success"
        },
        {
            title: "Total Courses",
            value: studentData.grades.length,
            icon: BookOpen,
            colorClass: "text-purple"
        }
    ];

    return (
        <div className="container-fluid p-4">
            <div className="d-flex align-items-center mb-4">
                <GraduationCap className="me-2" size={24} />
                <h1 className="h3 mb-0">My Student Dashboard</h1>
            </div>

            <div className="row g-4 mb-4">
                {statCards.map((stat, index) => (
                    <div key={index} className="col-12 col-md-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="card-subtitle text-muted">{stat.title}</h6>
                                    <stat.icon className={`${stat.colorClass}`} size={16} />
                                </div>
                                <h2 className="card-title mb-0">
                                    {stat.value?.toLocaleString() || 'N/A'}
                                </h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <h5 className="card-title mb-3">
                        <BookOpen className="me-2" size={20} />
                        My Grades
                    </h5>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentData.grades?.map((grade, index) => (
                                    <tr key={index}>
                                        <td>{grade.course?.name || 'Unknown Course'}</td>
                                        <td>{grade.grade?.toFixed(2) || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
