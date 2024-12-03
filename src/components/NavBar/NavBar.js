import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

const Navbar = () => {
  // Giriş yapılıp yapılmadığını localStorage'dan kontrol et
  const isLoggedIn = localStorage.getItem('isLoggedIn'); // Giriş yapıldığında 'true' olmalı
  const navigate = useNavigate();

  const handleLogout = () => {
    // Çıkış yapıldığında localStorage'dan isLoggedIn bilgisini sil
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username'); // Giriş yapılan kullanıcı bilgisini de sil
    navigate('/'); // Ana sayfaya (veya giriş sayfasına) yönlendir
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">LOGO</div>
      <ul className="navbar-links">
        <li><a href="/">Anasayfa</a></li>
        {isLoggedIn ? (
          <>
            <li><a href="/profile">Profil</a></li>
            <li><a href="/event">Etkinlik Oluştur</a></li>
            <li><button className="logout-button" onClick={handleLogout}>Çıkış</button></li>
          </>
        ) : (
          <>
            <li><a href="/giris">Giriş</a></li>
            <li><a href="/kayitol">Kayıt Ol</a></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
