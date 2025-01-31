import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <div className="particles"></div>
            <div className="content">
                <div className="logo-container">
                    <img src="src/assets/images/logo-emsi.png" alt="EMSI Logo" className="logo" />
                </div>
                <div className="text-content">
                    <h1 className="title">
                        <span className="highlight">Gestion</span> des Étudiants EMSI
                    </h1>
                    <p className="subtitle">
                        Plateforme innovante de gestion académique pour un suivi efficace et personnalisé
                    </p>
                    <div className="features">
                        <div className="feature">
                            <i className="bi bi-shield-check"></i>
                            <span>Sécurisé</span>
                        </div>
                        <div className="feature">
                            <i className="bi bi-lightning"></i>
                            <span>Rapide</span>
                        </div>
                        <div className="feature">
                            <i className="bi bi-graph-up"></i>
                            <span>Efficace</span>
                        </div>
                    </div>
                    <Link to="/login" className="login-button">
                        <span>Accéder à la plateforme</span>
                        <i className="bi bi-arrow-right"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;