// src/views/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ui/login.css'; // Asegúrate de que tu archivo CSS esté correctamente importado

const Login = () => {
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const storedUsername = 'admin';
    const storedPassword = 'admin';

    if (inputUsername === storedUsername && inputPassword === storedPassword) {
      // Guardar en localStorage para mantener la autenticación
      localStorage.setItem('isAuthenticated', true);
      navigate('/starter'); // Redirigir al layout principal o home
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div>
        <label>Usuario</label>
        <input
          type="text"
          value={inputUsername}
          onChange={(e) => setInputUsername(e.target.value)}
          placeholder="Username"
          required
        />
      </div>
      <div>
        <label>Contraseña</label>
        <input
          type="password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          placeholder="Password"
          required
        />
      </div>
      <button onClick={handleLogin}>Ingresar</button>
    </div>
  );
};

export default Login;
