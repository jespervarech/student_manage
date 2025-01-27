import React, { useState } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash, FaUser } from "react-icons/fa";
import AuthLayout from "../../components/AuthLayout";

const RegisterForm = ({ onLoginClick }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    console.log("Registration attempt", formData);
  };

  return (
    <AuthLayout
      title="Create an Account"
      subtitleText="Already have an account?"
      subtitleLink="Login"
      onSubtitleLinkClick={onLoginClick}
    >
      <form onSubmit={handleRegister} className="w-full flex flex-col gap-3">
        {/* Champ Nom d'utilisateur */}
        <div className="w-full flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
          <FaUser className="text-gray-500" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-gray-800 placeholder-gray-400"
          />
        </div>

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

        {/* Champ Confirmation de mot de passe */}
        <div className="w-full flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 relative">
          <FaFingerprint className="text-gray-500" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-gray-800 placeholder-gray-400"
          />
          {showConfirmPassword ? (
            <FaRegEyeSlash
              className="absolute right-5 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(false)}
            />
          ) : (
            <FaRegEye
              className="absolute right-5 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(true)}
            />
          )}
        </div>

        {/* Bouton d'inscription */}
        <button 
          type="submit" 
          className="w-full p-2 bg-blue-500 rounded-xl mt-3 hover:bg-blue-600 text-sm md:text-base text-white"
        >
          Create Account
        </button>
      </form>
    </AuthLayout>
  );
};

export default RegisterForm;