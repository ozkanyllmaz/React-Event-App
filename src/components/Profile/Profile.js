import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // 'userId'yi localStorage'dan alıyoruz
    if (!userId) {
      console.error('User ID bulunamadı!');
      setLoading(false);
      return; // Eğer userId yoksa, bir şey yapmıyoruz
    }

    // Eğer userId varsa, API'den veri almak için bir fetch işlemi yapılabilir
    fetch(`http://localhost:8080/users/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
        setLoading(false); // Veri geldiğinde loading'i kapatıyoruz
      })
      .catch((error) => {
        console.error('User data fetching error:', error);
        setLoading(false); // Hata durumunda da loading'i kapatıyoruz
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Veri yüklenene kadar loading mesajı
  }

  if (!userData) {
    return <div>User not found.</div>; // Eğer kullanıcı verisi alınamadıysa
  }

  return (
    <div>
      <h1>Welcome, {userData.username}!</h1>
      <p>Email: {userData.email}</p>
      {/* Kullanıcıya ait diğer veriler */}
    </div>
  );
};

export default Profile;
