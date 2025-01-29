import React from 'react';
import './Home.css'; // On va garder le fichier CSS avec des modifications

const Home = () => {
    return (
        <div className="home-container">
            <div className="content">
                <img src="src/assets/images/logo-emsi.png" alt="Emsi Logo" className="logo" />
                <h1 className="title"> Gestion d'Étudiant</h1>
                <p className="subtitle">Une solution simple et efficace pour gérer vos étudiants</p>
                <a href="/login" className='login-button'>Se connecter</a>
            </div>
        </div>
    );
};

export default Home;
