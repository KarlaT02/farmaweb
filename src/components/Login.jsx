// src/components/Login.jsx

import React, { useState } from 'react';
import "./Auth.css"; // Importa los estilos comunes
import { Link } from 'react-router-dom';


const Login = ({ isEmbedded = false}) => {
  // 🛑 SE AÑADE: Estado para controlar si la contraseña es visible (true) o no (false)
  const [showPassword, setShowPassword] = useState(false);


  // 🛑 SE AÑADE: Función para cambiar el estado de visible/oculto
  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  // Función simulada para manejar el envío
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Intento de inicio de sesión...');
    // Aquí iría la lógica de autenticación real
  };

  return (
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* 🛑 Ocultar el h2 si está incrustado y ya hay un título general */}
        {!isEmbedded && <h2>Iniciar Sesión</h2>}
        
        {/* Campo de Email */}
        <div className="form-group">
          <label htmlFor="login-email">Correo Electrónico</label>
          <input 
            type="email" 
            id="login-email" 
            name="email" 
            placeholder="ejemplo@correo.com" 
            required 
          />
        </div>

        {/* Campo de Contraseña */}
        <div className="form-group">
          <label htmlFor="login-password">Contraseña</label>
          <div className='input-with-button'>
            <input 
              type={showPassword ? "text" : "password"}
              id="login-password" 
              name="password" 
              placeholder="Introduce tu contraseña" 
              required 
            />
            {/* Aquí puedes añadir el botón "Mostrar" contraseña si lo deseas */}
            <button 
              type="button" 
              className="show-password-btn"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

        {/* Contenedor Flex para alinear Recordarme e INGRESAR horizontalmente */}

          {/* Checkbox Recordarme */}
          <div className="form-group remember-me-group">
            <input type="checkbox" id="remember-me" name="rememberMe" />
            <label htmlFor="remember-me">Recordarme</label>
          </div>

          {/* Enlace de "Olvidaste tu contraseña?" */}
          <p className="forgot-password-link">
            <Link to="/olvide-contrasena">¿Olvidaste tu contraseña?</Link>
          </p>

          {/* Botón de Ingreso */}
          <button type="submit" className="auth-submit-button main-action-btn full-width-btn">
            INGRESAR
          </button>


        {/* Botón de Google+ */}
        <button type="button" className="auth-submit-button google-login-btn">
          <img src="/images/google.png" alt="Google" className="google-icon"/>INGRESAR CON GOOGLE+
        </button>

        
        {/* 🛑 Ocultar el enlace de "No tienes cuenta" si está incrustado */}
        {!isEmbedded && (
          <p className="auth-switch-link">
            ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a>
          </p>
        )}
      </form>
  );
};

export default Login;