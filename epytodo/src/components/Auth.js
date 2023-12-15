import React, { useState } from 'react';
import './Auth.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Auth = () => {
  const [firstname, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [authMode, setAuthMode] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const validateEmail = (email) => {
    // Ajoutez votre logique de validation d'email ici
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    // Ajoutez votre logique de validation de mot de passe ici
    return password.length >= 8;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Validation des champs
      if (!validateEmail(email) || !validatePassword(password)) {
        throw new Error('Email invalide ou mot de passe trop court (minimum 8 caractères)');
      }

      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Erreur lors de la connexion');
      }

      console.log('Login successful', data);
      setSuccessMessage('Connexion réussie!');
    } catch (error) {
      setError(error.message || 'Échec de la connexion. Veuillez réessayer.');
    }
    setEmail('');
    setPassword('');

    // Effacer les messages après 3 secondes
    setTimeout(() => {
      setError(null);
      setSuccessMessage(null);
    }, 3000);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Validation des champs
      if (!validateEmail(email) || !validatePassword(password)) {
        throw new Error('Email invalide ou mot de passe trop court (minimum 8 caractères)');
      }

      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, firstname, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Erreur lors de l\'inscription');
      }

      console.log('Registration successful', data);
      setSuccessMessage('Inscription réussie!');
    } catch (error) {
      setError(error.message || 'Échec de l\'inscription. Veuillez réessayer.');
    }
    setName('');
    setEmail('');
    setUsername('');
    setPassword('');

    // Effacer les messages après 3 secondes
    setTimeout(() => {
      setError(null);
      setSuccessMessage(null);
    }, 3000);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClose = () => {
    setShowButtons(true);
    setAuthMode(null);
  };

  return (
    <div className="auth-container">
      {!showButtons && (
        <button className="close-button" onClick={handleClose}>
          &#10006;
        </button>
      )}

      {showButtons && (
        <div className="auth-buttons">
          <button onClick={() => { setAuthMode('login'); setShowButtons(false); }}>Login</button>
          <button onClick={() => { setAuthMode('signup'); setShowButtons(false); }}>Sign Up</button>
        </div>
      )}

      {authMode === 'login' && (
        <div className="auth-form login-form">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <label>
              Email:
              <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
              Password:
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={handleTogglePassword}
              >
                {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
              </button>
            </label>
            <button type="submit">Login</button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
      )}

      {authMode === 'signup' && (
        <div className="auth-form signup-form">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignUp}>
            <label>
              Email:
              <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
              Name:
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              Username:
              <input type="text" value={firstname} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label>
              Password:
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={handleTogglePassword}
              >
                {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
              </button>
            </label>
            <button type="submit">Sign Up</button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default Auth;
