import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../context/UserContext';  // Importe le contexte utilisateur
import { Avatar, Typography, Paper, Grid } from '@mui/material';

const Profile = () => {
    const { user } = useUserContext();  // Utilise le contexte pour accéder aux données de l'utilisateur
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (user) {
            // Récupère les informations de l'utilisateur à partir du contexte
            setUserInfo({
                displayName: user.displayName,
                email: user.email,
                picture: user.picture,
                role: user.role,  // Ajoute le rôle
            });
        }
    }, [user]);

    if (!userInfo) {
        return <div>Chargement...</div>; // Affiche un message pendant le chargement des données
    }

    return (
        <Paper style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Grid container spacing={3} alignItems="center" direction="column" justifyContent="center">
                <Grid item>
                    <Avatar
                        src={userInfo.picture || "https://via.placeholder.com/150"}
                        alt="Profile"
                        style={{ width: '120px', height: '120px', marginBottom: '20px' }} // Image centrée et plus grande
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom align="center">
                        {userInfo.displayName}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1" color="textSecondary" align="center">
                        Email: {userInfo.email}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1" color="textSecondary" align="center">
                        Rôle: {userInfo.role} {/* Affichage du rôle */}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Profile;
