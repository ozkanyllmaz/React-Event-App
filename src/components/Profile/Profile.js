import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Edit mode
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    phoneNumber: '',
    location: '',
    interests: '',
    gender: '',
    profilePhoto: '', // Profil fotoğrafı
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    console.log('User ID:', userId);

    if (!userId) {
      console.error('User ID bulunamadı!');
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/users/profile/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Kullanıcı verisi alınırken bir hata oluştu.');
        }
        return response.json();
      })
      .then((data) => {
        if (!data) {
          console.error('Kullanıcı verisi boş geldi');
          setLoading(false);
          return;
        }
        setUserData(data);
        setFormData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('User data fetching error:', error);
        setLoading(false);
      });
  }, []);

  const handleEditClick = () => {
    setIsEditing(true); // Düzenleme moduna geç
  };

  const handleSaveClick = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:8080/users/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        console.error('Profile update failed');
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Resim değişikliklerini yönetme
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Seçilen ilk dosya
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        profilePhoto: URL.createObjectURL(file), // Geçici önizleme URL'si
      }));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>User not found.</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-image">
        {formData.profilePhoto ? (
          <img src={formData.profilePhoto} alt="Profile" />
        ) : (
          <img src="default-avatar.png" alt="Default Profile" />
        )}
      </div>
      
      <div className="profile-form">
        <div className="profile-field">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="profile-field">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="profile-field">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="profile-field">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="profile-field">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="profile-field">
          <label>Interests:</label>
          <input
            type="text"
            name="interests"
            value={formData.interests || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="profile-field">
          <label>Gender:</label>
          <input
            type="text"
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        {/* Resim Yükleme Butonu */}
        <div className="profile-field">
          <label>Profile Photo:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange || ""}
            disabled={!isEditing}
          />
        </div>

        <button onClick={handleSaveClick} disabled={!isEditing}>Save</button>
      </div>
      
      <button onClick={handleEditClick}>Edit Profile</button>
    </div>
  );
};

export default Profile;
