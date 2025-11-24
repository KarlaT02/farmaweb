

import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"

// src/components/Header.jsx (Estructura Corregida para Escritorio)


const Header = ({ cartItemCount = 0, session, onLogout }) => {

  const renderAccountStatus = () => {
    if (session) {
      
      // USUARIO LOGEADO: Muestra Nombre y Opción de Cerrar Sesión
      const rawName = session.user?.user_metadata?.full_name || session.user.email;
      const firstName = rawName.split(' ')[0];

      return(
        <div className="nav-item account-item logged-in">
          <img src="/images/cuenta.png" alt="Icono de cuenta" className="nav-icon"/>
          <div className="account-text-container">
              <span className="account-welcome">Hola, {firstName}!</span>
              <span
                className="account-link logout-link"
                onClick={onLogout} // 🛑 Llama a la función de cierre de sesión
              >
                Cerrar Sesión
              </span>
          </div>
        </div>
      );
    } else {

      // 🛑 USUARIO NO LOGEADO: Muestra el enlace a Login/Registro
      return (
        <Link to={"/login"} className="nav-item account-item">
          <img src="/images/cuenta.png" alt="Icono de cuenta" className="nav-icon"/>
          <div className="account-text-container">
            <span className="account-welcome">¡Bienvenido</span>
            <span className="account-link">Regístrate / Identifícate</span>
          </div>
        </Link>
      );
    }
  };

  ///logica confidicional para la cuenta
  return (
    <header className="main-header">
      
      {/* 1. LOGO Y MARCA (Primer elemento) */}
      <div className="header-brand logo-text-full">
        <Link to={"/"} className="logo-link">
          <img 
            src="/images/favicon.png"
            alt="Logo de Tienda FarmaWeb"
            className="header-logo" 
          />
          <span className="text-logo">FarmaWeb</span>
        </Link>
      </div>

      {/* 2. NAVEGACIÓN (Segundo elemento, justo después del logo) */}
      <nav className="header-nav">

        {renderAccountStatus()}

        {/* Link del Carrito */}
        <Link to={"/carrito"} className="nav-item cart-item-full">
          <div className="cart-icon-container">
            <img src="/images/carrito.png" alt="Icono del carro" className="nav-icon"/>
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </div>
          <span className="cart-text">Cesta</span>
        </Link>
      </nav>

      {/* 3. BARRA DE BÚSQUEDA (Tercer y último elemento) */}
      <div className="header-search">
        <input 
          type="text" 
          placeholder="Buscar..." 
          className="search-input"
        />
        
        <img
          src="/images/buscar.png"
          alt="Icono de buscar"
          className="search-logo"
        />
                
      </div>
      
    </header>
  );
};

export default Header;