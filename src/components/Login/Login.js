import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Stil dosyasını dahil ediyoruz

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null); // reCAPTCHA token'ı
  const navigate = useNavigate();

  useEffect(() => {
    // reCAPTCHA scripti yüklendiğinde, ready() fonksiyonu çağrılacak
    window.grecaptcha.enterprise.ready(() => {
      // reCAPTCHA'yı hazır hale getirme
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // reCAPTCHA token'ını alıyoruz
    try {
      const token = await window.grecaptcha.enterprise.execute('6LeCMJIqAAAAAGSk5edLcKIuKxVLvY-0dgByoiCP', {
        action: 'LOGIN',
      });
      setRecaptchaToken(token); // Token'ı state'e kaydediyoruz

      // Giriş verilerini hazırlıyoruz
      const loginData = {
        userName: username,
        password: password,
        recaptchaToken: token,  // reCAPTCHA token'ını da ekliyoruz
      };

      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Login successful:', userData);  // Backend'den gelen yanıtı loglayın
        
        if (userData && userData.id) {
          // Kullanıcıyı localStorage'a kaydediyoruz
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userId', userData.id);  // id'yi kaydediyoruz
          navigate('/'); // Başarılı giriş sonrası anasayfaya yönlendir
        } else {
          console.error('UserId (id) is missing in the response');
          setErrorMessage('User ID is missing in the response');
        }
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
