import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Stil dosyasını dahil ediyoruz

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = {
      userName: username,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Login successful:', userData);

    
        
        // Kullanıcıyı localStorage'a kaydediyoruz
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', userData.username); // Burada userData.username kullanıyoruz
        
        // Başarılı giriş sonrası anasayfaya yönlendir
        navigate('/');
      } else {
        const errorData = await response.text();
        console.error('Login failed:', errorData);
        setErrorMessage(errorData);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      {/* Forgot password link */}
      <div className="forgot-password">
        <a href="/forgot-password">Forgot your password?</a>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default Login;
