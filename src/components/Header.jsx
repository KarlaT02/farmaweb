

import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"

// src/components/Header.jsx (Estructura Corregida para Escritorio)


const Header = ({ cartItemCount = 0 }) => {
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
        {/* Link de la Cuenta */}
        <Link to={"/login"} className="nav-item account-item">
          <img src="/images/cuenta.png" alt="Icono de cuenta" className="nav-icon"/>
          <div className="account-text-container">
            <span className="account-welcome">¡Bienvenido</span>
            <span className="account-link">Regístrate / Identifícate</span>
          </div>
        </Link>
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