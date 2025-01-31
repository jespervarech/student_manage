import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  MenuItem
} from "@mui/material";
import {
  Email as EmailIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
    firstName: "",
    lastName: "",
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGeneratePassword = () => {
    const generatedPassword = Math.random().toString(36).slice(-6);
    setFormData(prev => ({
      ...prev,
      password: generatedPassword,
      confirmPassword: generatedPassword
    }));
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
    <Box
      component="form"
      onSubmit={handleRegister}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        maxWidth: 400,
        margin: 'auto' // Center the entire form
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Créer un compte
      </Typography>

      <TextField
        fullWidth
        label="Nom d'utilisateur"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Adresse email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        select
        label="Rôle"
        name="role"
        value={formData.role}
        onChange={handleChange}
      >
        <MenuItem value="STUDENT">Étudiant</MenuItem>
        <MenuItem value="SCOLARITE">SCOLARITE</MenuItem>
      </TextField>

      {formData.role === "STUDENT" && (
        <>
          <TextField
            fullWidth
            label="Prénom"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Nom"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </>
      )}

      <TextField
        fullWidth
        label="Mot de passe"
        name="password"
        type={showPassword.password ? "text" : "password"}
        value={formData.password}
        onChange={handleChange}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(prev => ({
                  ...prev,
                  password: !prev.password
                }))}
                edge="end"
              >
                {showPassword.password ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Confirmer le mot de passe"
        name="confirmPassword"
        type={showPassword.confirmPassword ? "text" : "password"}
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(prev => ({
                  ...prev,
                  confirmPassword: !prev.confirmPassword
                }))}
                edge="end"
              >
                {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="outlined"
        onClick={handleGeneratePassword}
        sx={{ mb: 1 }}
      >
        Générer mot de passe
      </Button>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
      >
        Créer un compte
      </Button>
    </Box>
  );
};

export default RegisterForm;

