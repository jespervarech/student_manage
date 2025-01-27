import React from "react";
import { BsApple } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";

const AuthLayout = ({ 
  children, 
  title, 
  subtitleText, 
  subtitleLink, 
  onSubtitleLinkClick 
}) => {
  return (
    <div className="h-screen w-screen fixed top-0 left-0 bg-gradient-to-r from-purple-100 to-blue-100 m-0 p-0 overflow-hidden flex items-center justify-center">
      {/* Formes géométriques */}
      <div className="absolute w-64 h-64 bg-purple-200 rounded-full opacity-20 -top-32 -left-32"></div>
      <div className="absolute w-96 h-96 bg-blue-200 rounded-full opacity-20 -bottom-48 -right-48"></div>
      <div className="absolute w-48 h-48 bg-purple-300 rounded-lg opacity-20 rotate-45 top-1/4 left-1/4"></div>
      <div className="absolute w-64 h-64 bg-blue-300 rounded-lg opacity-20 rotate-12 bottom-1/4 right-1/4"></div>

      {/* Carte du formulaire */}
      <div className="w-[90%] max-w-sm md:max-w-md lg:max-w-md p-5 bg-white flex-col flex items-center gap-3 rounded-xl shadow-lg z-10">
        {/* Logo de l'application */}
        <img src="src/assets/images/logo-emsi.png" alt="logo" className="w-20 md:w-24" />

        {/* Titre */}
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h1>

        {/* Texte secondaire */}
        <p className="text-xs md:text-sm text-gray-500 text-center">
          {subtitleText}{" "}
          <span 
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={onSubtitleLinkClick}
          >
            {subtitleLink}
          </span>
        </p>

        {children}

        {/* Séparateur "Or" */}
        <div className="relative w-full flex items-center justify-center py-3">
          <div className="w-2/5 h-[2px] bg-gray-200"></div>
          <h3 className="font-lora text-xs md:text-sm px-4 text-gray-500">Or</h3>
          <div className="w-2/5 h-[2px] bg-gray-200"></div>
        </div>

        {/* Boutons tiers */}
        <div className="w-full flex items-center justify-evenly md:justify-between gap-2">
          {/* Apple */}
          <div className="p-2 md:px-6 lg:px-10 bg-gray-50 cursor-pointer rounded-xl border border-gray-200 hover:bg-gray-100">
            <BsApple className="text-lg md:text-xl text-gray-800" />
          </div>

          {/* Google */}
          <div className="p-1 md:px-6 lg:px-10 bg-gray-50 cursor-pointer rounded-xl border border-gray-200 hover:bg-gray-100">
            <img
              src="/src\assets\images\logo-google.png"
              alt="google-icon"
              className="w-6 md:w-8"
            />
          </div>

          {/* Twitter */}
          <div className="p-2 md:px-6 lg:px-10 bg-gray-50 cursor-pointer rounded-xl border border-gray-200 hover:bg-gray-100">
            <FaXTwitter className="text-lg md:text-xl text-gray-800" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;