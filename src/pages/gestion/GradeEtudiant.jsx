import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from "../../context/UserContext";
import { BounceLoader } from 'react-spinners';  // Import de react-spinners (spinner)

function GradeEtudiant() {
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useUserContext();

    const studentId = user.id;

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                // Envoie la requête GET avec l'ID de l'étudiant dans l'URL
                const response = await axios.get(`http://localhost:8010/api/gradesstudents/${studentId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Si tu utilises un token pour l'authentification
                    }
                });

                // Si la requête réussit, met à jour l'état grades
                setGrades(response.data);
                setLoading(false);
            } catch (err) {
                // Gérer les erreurs et afficher un message d'erreur
                setError('Erreur lors de la récupération des notes');
                setLoading(false);
            }
        };

        fetchGrades();
    }, [studentId]); // La requête est refaite lorsque le studentId change

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <BounceLoader color="#36d7b7" size={60} />
                <p>Chargement des notes...</p>
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Notes de l'Étudiant</h2>
            <table>
                <thead>
                    <tr>
                        <th>Cours</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>
                    {grades.length > 0 ? (
                        grades.map((grade) => (
                            <tr key={grade._id}>
                                <td>{grade.course}</td>
                                <td>{grade.grade}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2">
                                <div style={{ textAlign: 'center', fontSize: '18px', color: '#999' }}>
                                    <p>Aucune note disponible pour l'instant.</p>
                                    <BounceLoader color="#36d7b7" size={30} />
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default GradeEtudiant;
