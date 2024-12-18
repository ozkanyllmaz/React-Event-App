import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Backend'den gelen yanıtı kontrol et
      if (response.ok) {
        setMessage('A password reset link has been sent to your email.');
      } else {
        // Eğer yanıt başarısızsa, hata mesajını al ve göster
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || 'An error occurred. Please try again.'}`);
      }
    } catch (error) {
      // Sunucuya bağlantı kurulamazsa veya başka bir hata oluşursa
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
        <label>
          Enter your email address:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
