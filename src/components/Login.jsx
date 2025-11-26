// src/components/Login.jsx

import React, { useState } from 'react';
import "./Auth.css"; // Importa los estilos comunes
import { Link } from 'react-router-dom';
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";


const Login = ({ isEmbedded = false}) => {
  
  const [rememberMe, setRememberMe] = useState(true);
  //Estado para capturar los valores del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  //Estado para controlar si la contraseña es visible (true) o no (false)
  const [showPassword, setShowPassword] = useState(false);


  //Función para cambiar el estado de visible/oculto
  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  const navigate = useNavigate();

  // Función simulada para manejar el envío
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const persistence = rememberMe ? 'session' : 'temporary';

    console.log("Enviando Email:", email);
    console.log("Enviando Password:", password);

    // 1. Llamar al método de inicio de sesión de Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    }, {
          //Pasar opcion de persistencia
          shouldRemember: persistence === 'session' ? true : false,
    });

    // 2. Manejar la respuesta
    if (error) {
      //Mostrar un error legible al usuario
      setError("Error: Credenciales inválidas o cuenta no verificada");
      console.error("Error de Supabase:", error);
    } else if (data.user) {
      //login exitoso supabase guarda el token
      console.log("Usuario logeado:", data.user);
      //redirige al usuario a la pagina principal
      navigate("/");
    }
  }
  
    //Funcion para inicio de sesion con GOOGLE
    const handleGoogleLogin = async () => {
      setError(null); // Limpiamos errores anteriores

      // La persistencia es opcional, pero ayuda a mantener la sesión
      const persistence = rememberMe ? 'session' : 'temporary';

      const { error } = await supabase.auth.signInWithOAuth({
        //Especificar el proovedor
        provider: "google",
        options: {
          ///Definir URL de redirección
          //Supabase necesita saber al donde devolver al usuario
          redirectTo: window.location.origin + '/',
          /// Establecer persistencia
          redirectTo: window.location.origin + '/',
          redirectTo: window.location.origin + '/'
        }
        
      });

    if (error) {
      console.error("Error al iniciar sesión con Google:", error);
      setError("Error al contactar con Google. Intente nuevamente.");
    }
    //Si es exitoso realiza la redireccion auto

  };

  return (
      <form className="auth-form" onSubmit={handleLogin}>
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
              //se añade: conexión al estado
              onChange={(e) => setEmail(e.target.value)}
              value={email}
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
              //añade conexion al estado
              onChange={(e) => setPassword(e.target.value)}
              value={password}
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

        {/* Mensaje de error (debajo de los campos) */}
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}

        {/* Contenedor Flex para alinear Recordarme e INGRESAR horizontalmente */}

          {/* Checkbox Recordarme */}
          <div className="form-group remember-me-group">
            <input 
              type="checkbox" 
              id="remember-me" 
              name="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
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
          <button
            type="button"
            className="auth-submit-button google-login-btn"
            onClick={handleGoogleLogin}
          >
            <img src="/images/google.png" alt="Google" className="google-icon"/>INGRESAR CON GOOGLE
          </button>
        
        {/*  Ocultar el enlace de "No tienes cuenta" si está incrustado */}

        {!isEmbedded && (
          <p className="auth-switch-link">
            ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a>
          </p>
        )}
      </form>
  );
};

export default Login;