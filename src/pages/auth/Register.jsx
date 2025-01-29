import React, { useState } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash, FaUser } from "react-icons/fa";
import AuthLayout from "../../components/AuthLayout";
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ onLoginClick }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT", // Par défaut le rôle est 'STUDENT'
    firstName: "",
    lastName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleGeneratePassword = () => {
    const generatedPassword = Math.random().toString(36).slice(-6); // Générer un mot de passe aléatoire de 6 caractères
    setFormData({ ...formData, password: generatedPassword, confirmPassword: generatedPassword });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    const userData = {
      email: formData.email,
      password: formData.password,
      username: formData.username,
      role: formData.role,
      firstName: formData.firstName,
      lastName: formData.lastName,
    };

    try {
      const response = await fetch("http://localhost:8010/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful", data);
      navigate('/admin/users');
    } catch (error) {
      console.error("Registration error:", error.message);
    }
  };

  return (
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

      {/* Champ Sélection du rôle */}
      <div className="w-full flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-gray-800"
        >
          <option value="STUDENT">Étudiant</option>
          <option value="SCOLARITE">SCOLARITE</option>
        </select>
      </div>

      {/* Si le rôle est "STUDENT", afficher les champs nom et prénom */}
      {formData.role === "STUDENT" && (
        <>
          <div className="w-full flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
            <input
              type="text"
              name="firstName"
              placeholder="Prénom"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-gray-800 placeholder-gray-400"
            />
          </div>

          <div className="w-full flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
            <input
              type="text"
              name="lastName"
              placeholder="Nom"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base text-gray-800 placeholder-gray-400"
            />
          </div>
        </>
      )}

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

      {/* Bouton générer le mot de passe */}
      <button
        type="button"
        onClick={handleGeneratePassword}
        className="w-full p-2 bg-gray-300 rounded-xl mt-3 hover:bg-gray-400 text-sm md:text-base text-black"
      >
        Générer mot de passe
      </button>

      {/* Bouton d'inscription */}
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 rounded-xl mt-3 hover:bg-blue-600 text-sm md:text-base text-white"
      >
        Créer un compte
      </button>
    </form>
  );
};

export default RegisterForm;
