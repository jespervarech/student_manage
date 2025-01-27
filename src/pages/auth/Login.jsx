import React, { useState } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import AuthLayout from "../../components/AuthLayout";

const LoginForm = ({ onRegisterClick }) => {
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

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login attempt", formData);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitleText="Don't have an account?"
      subtitleLink="Sign up"
      onSubtitleLinkClick={onRegisterClick}
    >
      <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
        {/* Champ Email */}
        <div className="w-full flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
          <MdAlternateEmail className="text-gray-500" />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* Champ Mot de passe */}
        <div className="w-full flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 relative">
          <FaFingerprint className="text-gray-500" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-gray-800 placeholder-gray-400"
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
          className="w-full p-2 bg-blue-500 rounded-xl mt-3 hover:bg-blue-600 text-sm md:text-base text-white"
        >
          Login
        </button>
      </form>
    </AuthLayout>
  );
};

export default LoginForm;