import React from "react";
import { BsApple } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import { Link as RouterLink } from "react-router-dom";

const AuthLayout = ({
  children,
  title,
  subtitleText,
  subtitleLink,
  onSubtitleLinkClick
}) => {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`; // Redirection vers la route backend
  };
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-indigo-300 via-purple-400 to-blue-500 relative">
      {/* Formes géométriques abstraites */}
      <div className="absolute w-96 h-96 bg-gradient-to-b from-purple-300 via-pink-200 to-indigo-400 rounded-full opacity-40 -top-32 -left-32 animate-pulse"></div>
      <div className="absolute w-64 h-64 bg-gradient-to-b from-blue-400 via-teal-200 to-cyan-300 rounded-full opacity-30 -bottom-32 -right-32 animate-pulse"></div>

      {/* Carte du formulaire */}
      <div className="w-[90%] max-w-md p-8 bg-white flex flex-col items-center gap-6 rounded-xl shadow-2xl z-10 transform transition-transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out">
        {/* Logo de l'application */}
        <img
          src="src/assets/images/logo-emsi.png"
          alt="logo"
          className="w-28 md:w-32 mb-6"
        />

        {/* Titre */}
        <h1 className="text-2xl font-semibold text-gray-800 text-center">{title}</h1>

        {/* Texte secondaire */}
        <p className="text-md text-gray-600 text-center">
          {subtitleText}{" "}
          {
            subtitleLink === "Inscrivez-vous" ? (
              <RouterLink
                to="/register"
                className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
              >
                {subtitleLink}
              </RouterLink>
            ) : (
              <RouterLink
                to="/login"
                className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
              >
                {subtitleLink}
              </RouterLink>
            )
          }

        </p>

        {children}

        {/* Séparateur "Ou" */}
        <div className="relative w-full flex items-center justify-center py-4 mt-6">
          <div className="w-2/5 h-[2px] bg-gray-300"></div>
          <h3 className="font-lora text-sm px-4 text-gray-500">Ou</h3>
          <div className="w-2/5 h-[2px] bg-gray-300"></div>
        </div>

        {/* Boutons tiers */}
        <div className="w-full flex items-center justify-evenly gap-4 mt-6">
          {/* Google Login Button */}
          <div className="p-2 bg-gray-100 cursor-pointer rounded-xl border border-gray-200 hover:bg-gray-200 transition duration-200 ease-in-out">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center bg-red-600 text-white rounded-lg px-4 py-2 space-x-2"
            >
              <img
                src="src/assets/images/logo-google.png"
                alt="google-icon"
                className="w-6 md:w-8"
              />
              <span className="text-md font-semibold">Se connecter avec Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;