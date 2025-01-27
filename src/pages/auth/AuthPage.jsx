import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <LoginForm onRegisterClick={() => setIsLogin(false)} />
  ) : (
    <RegisterForm onLoginClick={() => setIsLogin(true)} />
  );
};

export default AuthPage;