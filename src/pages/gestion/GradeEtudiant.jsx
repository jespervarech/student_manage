import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from "../../context/UserContext";
import {
    GraduationCap,
    Award,
    BookOpen,
    AlertTriangle,
    XCircle
} from 'lucide-react';

function GradeEtudiant() {
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        average: 0,
        passed: 0,
        failed: 0,
        total: 0
    });
    const { user } = useUserContext();

    const studentId = user.id;

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/stats`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    params: { userId: studentId }
                });

                const gradesData = response.data.grades || [];
                setGrades(gradesData);

                // Calculer les statistiques
                const total = gradesData.length;
                const passed = gradesData.filter(grade => grade.grade >= 10).length;
                const average = gradesData.reduce((acc, curr) => acc + (curr.grade || 0), 0) / total;

                setStats({
                    average: average.toFixed(2),
                    passed: passed,
                    failed: total - passed,
                    total: total
                });

                setLoading(false);
            } catch (err) {
                setError('Erreur lors de la récupération des notes');
                setLoading(false);
            }
        };

        fetchGrades();
    }, [studentId]);

    const getBadgeAndIcon = (grade) => {
        if (grade >= 17) {
            return {
                badge: <span className="badge bg-success">Validé avec mention</span>,
                icon: <Award size={20} className="text-success" />
            };
        } else if (grade >= 10) {
            return {
                badge: <span className="badge bg-primary">Validé</span>,
                icon: <AlertTriangle size={20} className="text-primary" />
            };
        } else if (grade >= 8) {
            return {
                badge: <span className="badge bg-warning">Rattrapage</span>,
                icon: <AlertTriangle size={20} className="text-warning" />
            };
        } else {
            return {
                badge: <span className="badge bg-danger">Échoué</span>,
                icon: <XCircle size={20} className="text-danger" />
            };
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        );
    }

    return (
        <div className="container-fluid p-4">
            <div className="d-flex align-items-center mb-4">
                <GraduationCap className="me-2" size={24} />
                <h1 className="h3 mb-0">Relevé de Notes</h1>
            </div>

            {/* Statistiques */}
            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted">Moyenne Générale</h6>
                                    <h3 className="mb-0">{stats.average}/20</h3>
                                </div>
                                <Award size={24} className="text-primary" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted">Matières Validées</h6>
                                    <h3 className="mb-0">{stats.passed}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted">Matières Échouées</h6>
                                    <h3 className="mb-0">{stats.failed}</h3>
                                </div>
                                <AlertTriangle size={24} className="text-danger" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="text-muted">Total Matières</h6>
                                    <h3 className="mb-0">{stats.total}</h3>
                                </div>
                                <BookOpen size={24} className="text-secondary" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tableau des notes */}
            <div className="card shadow-sm">
                <div className="card-body">
                    {grades.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Matière</th>
                                        <th>Note</th>
                                        <th>Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grades.map((grade) => {
                                        const { badge, icon } = getBadgeAndIcon(grade.grade);
                                        return (
                                            <tr key={grade._id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        {icon}
                                                        <span className="ms-2">{grade.course?.name || 'Cours Inconnu'}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <strong>{grade.grade?.toFixed(2) || 'N/A'}</strong>
                                                    <span className="text-muted">/20</span>
                                                </td>
                                                <td>{badge}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center p-5">
                            <BookOpen size={48} className="text-secondary mb-3" />
                            <h4 className="text-secondary">Aucune note disponible</h4>
                            <p className="text-muted">Les notes seront affichées ici une fois qu'elles seront disponibles.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GradeEtudiant;