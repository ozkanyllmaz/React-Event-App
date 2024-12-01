import React, { useState, useEffect } from "react";
import './Profile.css';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Düzenleme modunu kontrol eden state

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Giriş yapan kullanıcının userId'sini alıyoruz
    
    if (!userId) {
      console.error('User ID bulunamadı!');
      return; // User ID bulunmazsa fetch yapılmaz
    }

    fetch(`http://localhost:8080/users/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': userId, // Authorization başlığına userId'yi gönderiyoruz
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API isteği başarısız: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUserData(data); // Kullanıcı verilerini state'e set ediyoruz
        } else {
          console.error('Kullanıcı verisi alınamadı');
        }
      })
      .catch((error) => {
        console.error('API hatası:', error);
        setError(error); // Hata durumunda error state'ini güncelliyoruz
      });
  }, []); // Yalnızca component mount olduğunda çalışır

  if (error) {
    return <div>Hata: {error.message}</div>;
  }

  if (!userData) {
    return <div>Yükleniyor...</div>; // Kullanıcı verisi gelene kadar loading durumu gösteriyoruz
  }

  const handleEditClick = () => {
    setIsEditing(!isEditing); // Düzenleme moduna geçiş
  };

    const handleSaveClick = () => {
    const userId = localStorage.getItem('userId'); // Giriş yapan kullanıcının userId'sini alıyoruz
    if (!userId) {
      console.error('User ID bulunamadı!');
      return;
    }
  
    // Güncellenen verileri API'ye gönderiyoruz
    fetch(`http://localhost:8080/users/profile/${userId}`, {
      method: 'PUT', // Veriyi güncellemek için PUT isteği
      headers: {
        'Authorization': userId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData), // Güncellenmiş userData'yı JSON formatında gönderiyoruz
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API isteği başarısız: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Profil başarıyla güncellendi:', data);
        // Güncelleme sonrası gelen veriyi kullanarak state'i güncelle
        setUserData(data); // Gelen yeni verilerle userData'yı güncelliyoruz
        setIsEditing(false); // Düzenleme modunu kapatıyoruz
      })
      .catch((error) => {
        console.error('Profil güncelleme hatası:', error);
        setError(error);
      });
  };
  

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={userData.profilePhoto || "default-avatar.png"} // Varsayılan fotoğraf
          alt="Profile"
          className="profile-image"
        />
        <button 
    className="edit-button" 
    onClick={isEditing ? handleSaveClick : handleEditClick}
  >
    {isEditing ? "Save" : "Edit Profile"}
  </button>
      </div>

      <div className="profile-info">
        <div className="info-row">
          <label>First Name</label>
          <input
            type="text"
            value={userData.firstName || ""}
            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
            disabled={!isEditing} // Düzenleme modunda aktif, değilse pasif
          />
        </div>
        <div className="info-row">
          <label>Last Name</label>
          <input
            type="text"
            value={userData.lastName || ""}
            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="info-row">
          <label>Email</label>
          <input
            type="email"
            value={userData.email || ""}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="info-row">
          <label>Contact Number</label>
          <input
            type="text"
            value={userData.phoneNumber || ""}
            onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="info-row">
          <label>Address</label>
          <input
            type="text"
            value={userData.location || ""}
            onChange={(e) => setUserData({ ...userData, location: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="info-row">
          <label>Interests</label>
          <input
            type="text"
            value={userData.interests || ""}
            onChange={(e) => setUserData({ ...userData, interests: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="info-row">
          <label>Birth Date</label>
          <input
            type="date"
            value={userData.birthDate || ""}
            onChange={(e) => setUserData({ ...userData, birthDate: e.target.value })}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
