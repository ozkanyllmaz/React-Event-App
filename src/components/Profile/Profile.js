import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // Çıkış yapıldığında giriş bilgisini sil
    navigate('/login'); // Login sayfasına yönlendir
  };

  return (
    <div>
      <h2>Your Profile</h2>
      <p>Here is your profile information.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
