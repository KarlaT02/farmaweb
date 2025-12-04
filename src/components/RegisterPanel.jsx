
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import "./Auth.css";
import "./AuthPage.css"; // Usamos el CSS del contenedor AuthPage
import { supabase } from '../supabaseClient';


// Este componente ahora es el Panel Informativo para el Cliente Nuevo.
const RegisterPanel = ({ onStartRegistration }) => { 
  //Se añade estado de control y error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  ///Inicio de flujo del google
  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + '/',
      }
    });

    setLoading(false);

    if (supabaseError) {
      console.error("Error al iniciar sesión con Google:", supabaseError);
      setError("Error al contactar con Google. Intente nuevamente.");
    }

  };


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
        
        {/* Aquí usamos la función para iniciar el registro */}
        <button 
          className="auth-submit-button create-account-btn"
          onClick={onStartRegistration} 
        >
          CREAR UNA CUENTA
        </button>

        <button 
          type='button'
          className= "auth-submit-button google-login-btn"
          onClick={handleGoogleLogin}
        >
          <img src="/images/google.png" alt="Google" className="google-icon"/>REGISTRATE CON GOOGLE
        </button>

      </div>
    </div>
  );
};

export default RegisterPanel;