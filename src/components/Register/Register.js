import React, { useState } from "react";
import "./Register.css"; // Stil dosyanızı buraya ekleyin

function Register() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    phoneNumber: "",
    gender: "", // Gender'ı ekledik
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Kullanıcı başarıyla kaydedildi:", data);
        window.alert("Kayıt başarılı!"); // Başarı mesajını alert olarak göster
      } else {
        const errorData = await response.json();
        console.error("Kayıt sırasında bir hata oluştu:", errorData);
        window.alert("Kayıt sırasında bir hata oluştu: " + errorData.message); // Hata mesajını alert olarak göster
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
      window.alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="register-container">
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Kullanıcı Adı</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Şifre</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Ad</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Soyad</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Doğum Tarihi</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Telefon Numarası</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Cinsiyet</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Cinsiyet Seçin</option>
            <option value="ERKEK">Erkek</option>
            <option value="KADIN">Kadın</option>
          </select>
        </div>

        <button type="submit" className="register-button">Kayıt Ol</button>
      </form>
    </div>
  );
}

export default Register;
