import React from "react";
import Event from "../Event/Event";
import { Link } from 'react-router-dom';

function Home() {

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <div className="container">
      <h1>Etkinlikler</h1>
      {isLoggedIn ? (
          <Link to="/profile" className="profile-link">Profile</Link> // Giriş yaptıysa profil linki
        ) : (
          <p>Etkinliklere katılmak ve etkinlik oluşturmak için lütfen üye olun.</p> // Giriş yapılmadıysa mesaj
        )}
      <Event />
    </div>
  );
}

export default Home;



