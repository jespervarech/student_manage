import React, { useState } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import AuthLayout from "../../components/AuthLayout";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
const LoginForm = ({ onRegisterClick }) => {
  const navigate = useNavigate();
  const { initializeUserFromToken } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();  // Empêche la soumission du formulaire par défaut

    const { email, password } = event.target;

    try {
      const response = await fetch('http://localhost:8010/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: email.value, password: password.value })
      });

      const data = await response.json();

      if (data.token) {
        // Stocke les informations dans localStorage
        localStorage.setItem('token', data.token);
        console.log(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Initialisez l'utilisateur à partir du token
        initializeUserFromToken(data.token);

        // Utilise navigate pour rediriger vers /admin/dashboard
        navigate('/admin/dashboard');
      } else {
        // Gérez l'erreur
        setError(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };




  return (
    <AuthLayout
      title="Bienvenue sur notre plateforme"
      subtitleText="Vous n'avez pas de compte ?"
      subtitleLink="Inscrivez-vous"
      onSubtitleLinkClick={onRegisterClick}
    >
      <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
        {/* Champ Email */}
        <div className="w-full flex items-center gap-4 bg-white p-4 rounded-xl shadow-lg border-2 border-gray-300">
          <MdAlternateEmail className="text-gray-500 text-2xl" />
          <input
            type="email"
            name="email"
            placeholder="Votre email"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-transparent border-0 w-full outline-none text-lg text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* Champ Mot de passe */}
        <div className="w-full flex items-center gap-4 bg-white p-4 rounded-xl shadow-lg border-2 border-gray-300 relative">
          <FaFingerprint className="text-gray-500 text-2xl" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Votre mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
            className="bg-transparent border-0 w-full outline-none text-lg text-gray-800 placeholder-gray-400"
          />
          {showPassword ? (
            <FaRegEyeSlash
              className="absolute right-5 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <FaRegEye
              className="absolute right-5 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        {/* Bouton de connexion */}
        <button
          type="submit"
          className="w-full p-4 bg-blue-600 rounded-xl mt-6 hover:bg-blue-700 transition-all duration-300 text-lg text-white font-semibold"
        >
          Se connecter
        </button>
      </form>
    </AuthLayout>
  );
};

export default LoginForm;