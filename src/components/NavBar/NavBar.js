import React from "react";
import "./NavBar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">LOGO</div>
      <ul className="navbar-links">
        <li><a href="/">Anasayfa</a></li>
        <li><a href="/giris">Giriş</a></li>
        <li><a href="/kayitol">Kayıt Ol</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
