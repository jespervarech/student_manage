import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();  // Hook pour la navigation avec React Router

    const handleLogout = async () => {
        try {
            // Appel à ton API de déconnexion côté serveur
            const response = await fetch('http://localhost:8010/auth/logout', {
                method: 'GET', // ou 'POST' selon ton backend
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Optionnel: Vérification si la déconnexion côté serveur a réussi
            if (!response.ok) {
                throw new Error('Erreur lors de la déconnexion serveur');
            }

            // Effacer le JWT et les autres informations locales (localStorage, cookies)
            localStorage.removeItem('token');
            localStorage.removeItem('user'); // Si tu stockes les données utilisateur dans le localStorage

            // Supprimer également les cookies si nécessaires (par exemple, pour une session)
            document.cookie = 'connect.sid=; Max-Age=0; path=/';

            // Rediriger vers la page de connexion ("/login")
            navigate('/'); // Utilisation de useNavigate pour la redirection React Router
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    React.useEffect(() => {
        // Appeler handleLogout dès que ce composant est monté
        handleLogout();
    }, []);

    return null; // Ce composant ne rend rien, il effectue juste la déconnexion et redirige
};

export default Logout;
