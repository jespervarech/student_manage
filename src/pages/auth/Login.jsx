import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const emsiStyles = {
  emsiGreen: "#009640",
  backgroundContainer: {
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
    minHeight: '100vh',
    padding: '40px 0',
  },
  card: {
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    border: 'none',
  },
  header: {
    background: 'linear-gradient(135deg, #009640 0%, #00b248 100%)',
    padding: '30px 20px',
    position: 'relative',
    overflow: 'hidden',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '600',
    marginBottom: '10px',
    position: 'relative',
  },
  input: {
    border: '2px solid #e8ecef',
    borderRadius: '10px',
    padding: '12px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  },
  inputFocus: {
    borderColor: '#009640',
    boxShadow: '0 0 0 0.2rem rgba(0, 150, 64, 0.15)',
  },
  button: {
    background: 'linear-gradient(135deg, #009640 0%, #00b248 100%)',
    border: 'none',
    borderRadius: '10px',
    padding: '14px',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 150, 64, 0.2)',
  },
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 150, 64, 0.3)',
  },
  footer: {
    background: '#f8f9fa',
    borderTop: '1px solid #eef0f2',
  },
  link: {
    color: '#009640',
    fontWeight: '600',
    transition: 'color 0.3s ease',
  }
};

const LoginForm = ({ onRegisterClick }) => {
  const navigate = useNavigate();
  const { initializeUserFromToken } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8010/auth/google"; // Redirection vers la route backend
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
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
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        initializeUserFromToken(data.token);
        navigate('/admin/home' + data.user.role.toLowerCase());
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError("Une erreur est survenue lors de la connexion");
    }
  };

  return (
    <div style={emsiStyles.backgroundContainer} className="d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div style={emsiStyles.card}>
              <div style={emsiStyles.header}>
                <div style={emsiStyles.headerOverlay}></div>
                <h3 style={emsiStyles.title} className="text-white text-center mb-0">
                  Bienvenue à l'EMSI
                </h3>
                <p className="text-white text-center mb-0 opacity-75">
                  Connectez-vous à votre espace
                </p>
              </div>
              <div className="p-4 p-md-5">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label className="form-label fw-medium mb-2">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={emsiStyles.input}
                      placeholder="exemple@emsi.ma"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-medium mb-2">Mot de passe</label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={emsiStyles.input}
                        placeholder="Votre mot de passe"
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ color: emsiStyles.emsiGreen }}
                      >
                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="d-grid gap-2 mt-5">
                    <button
                      type="submit"
                      style={emsiStyles.button}
                      className="btn btn-lg text-white"
                      onMouseOver={(e) => Object.assign(e.currentTarget.style, emsiStyles.buttonHover)}
                      onMouseOut={(e) => Object.assign(e.currentTarget.style, emsiStyles.button)}
                    >
                      Se connecter
                    </button>
                  </div>
                </form>
              </div>
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
                      src="/src/assets/images/logo-google.png"
                      alt="google-icon"
                      className="w-6 md:w-8"
                    />
                    <span className="text-md font-semibold">Se connecter avec Google</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
