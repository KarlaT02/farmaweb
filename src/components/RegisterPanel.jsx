
import React from 'react';
import { Link } from 'react-router-dom';
import "./Auth.css";
import "./AuthPage.css"; // Usamos el CSS del contenedor AuthPage


// Este componente ahora es el Panel Informativo para el Cliente Nuevo.
const RegisterPanel = ({ onStartRegistration }) => { 
  return (
    <div className="registration-panel">
      <h2 className="column-title">Cliente nuevo</h2> 
      
      {/* Mensaje principal */}
      <p className="registration-subtitle">
        Al registrarte obtendrás servicios adicionales, como:
      </p>

      {/* Lista de beneficios */}
      <ul className="benefits-list">
        <li>Checkout exprés</li>
        <li>Lista de Deseos</li>
        <li>Aviso anticipado de promociones</li>
        <li>Estatus de Pedidos</li>
        <li>Lista de Direcciones</li>
      </ul>

      {/* Call to Action */}
      <div className="registration-cta-section">
        <p className="cta-text">
          ¡Únete a nosotros **hoy**!
        </p>
        
        {/* 🛑 BOTÓN DE ACCIÓN: Aquí usaremos la función para iniciar el registro */}
        <button 
          className="auth-submit-button create-account-btn"
          onClick={onStartRegistration} 
        >
          CREAR UNA CUENTA
        </button>
      </div>
    </div>
  );
};

export default RegisterPanel; // Asegúrate de exportar RegisterPanel o cambiar el nombre a Register