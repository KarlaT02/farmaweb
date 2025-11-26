
import React, { useState } from 'react';
import './Auth.css'; // Importa los estilos comunes
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = ({ isEmbedded = false, onCancel }) => {
  // Estados para todos los campos del formulario
  const [name, setName] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  //Estado de control y error

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const [showPassword, setShowPassword] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    // 2 Llamada a supabase para registar al usuario
    const { data, error: supabaseError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name:`${name} ${apellidoPaterno} ${apellidoMaterno}`,
          phone: telefono,
        }
      }
    });

    setLoading(false);

    //3 Manejo de la respuesta
    if (supabaseError) {
      //mayoria de errores(email,fomato etc)
        setError(supabaseError.message);      
    } else if (data.user) {
      //Se dio el registro exitoso, se envia el email verificcado
      alert("¡Registro Exitoso! por favor verifica tu correo electronico.");
      navigate("/"); //Redirige a la pagina principal
    }
    //Si email ya existe el superbase lo notifica y devuelve un error
  };

  return (
      <form className="auth-form" onSubmit={handleSubmit}>

        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
        {loading && <p style={{ color: 'blue', textAlign: 'center', marginBottom: '15px' }}>Registrando...</p>}

        {/* 🛑 Ocultar el h2 si está incrustado */}
        {!isEmbedded && <h2>Crear Nueva Cuenta</h2>}


        
        {/* Campo de Nombre Completo */}
        <div className="form-group">
          <label htmlFor="register-name">Nombre:<span className="required-star">*</span></label> {/* ID ÚNICO */}
          <input 
            type="text" 
            id="register-name" 
            name="name" 
            placeholder="Nombre/s" 
            required
            value={name} //Hace la conexio con el estado
            onChange={(e) => setName(e.target.value)} //captuta el valor
          />
        </div>
        
        {/* Campo de Apellido Paterno */}
        <div className="form-group">
          <label htmlFor="register-apellido-paterno">Apellido paterno:<span className="required-star">*</span></label> {/* 🛑 ID ÚNICO */}
          <input 
            type="text"
            id="register-apellido-paterno" 
            name="apellidoPaterno"
            placeholder="Apellido"
            required
            value={apellidoPaterno}
            onChange={(e) => setApellidoPaterno(e.target.value)}
          />
        </div>

        {/* Campo de Apellido Materno */}
        <div className="form-group">
          <label htmlFor="register-apellido-materno">Apellido materno:<span className="required-star">*</span></label> {/* 🛑 ID ÚNICO */}
          <input 
            type="text"
            id="register-apellido-materno" 
            name="apellidoMaterno"
            placeholder="Apellido"
            required
            value={apellidoMaterno}
            onChange={(e) => setApellidoMaterno(e.target.value)}
          />
        </div>

        
        {/* Campo de Email */}
        <div className="form-group">
          <label htmlFor="register-email">Correo electrónico:<span className="required-star">*</span></label> {/* ID unico */}
          <input 
            type="email" 
            id="register-email" 
            name="email" 
            placeholder="ejemplo@correo.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

          {/* Campo de Teléfono Móvil */}
        <div className="form-group">
          <label htmlFor="register-telefono">Teléfono móvil:<span className="required-star">*</span></label> {/* ÚNICO */}
          <input 
            type="tel" 
            id="register-telefono" 
            name="telefono" 
            placeholder="492-222-222" 
            required
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        {/* Campo de Contraseña */}
        <div className="form-group">
          
          <label htmlFor="register-password">Contraseña:<span className="required-star">*</span></label> {/* 🛑 ID ÚNICO */}
          <div className='input-with-button'>
            <input 
              type={showPassword ? "text" : "password"}
              id="register-password" 
              name="password" 
              placeholder="Mínimo 6 caracteres" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <p className="password-hint">Las contraseñas deben tener al menos 6 caracteres y un número.</p>
        </div>

        {/* Campo de Confirmación de Contraseña */}
        <div className="form-group">
          <label htmlFor="register-confirm-password">Confirmar contraseña:<span className="required-star">*</span></label> {/* 🛑 ID ÚNICO */}
          <input 
            type="password" 
            id="register-confirm-password" 
            name="confirmPassword" 
            placeholder="Repite tu contraseña" 
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <p className="password-match-hint">Este campo debe coincidir con la contraseña.</p>
        </div>

        {/* Sección de Términos y Condiciones */}
        <div className="form-group terms-conditions-group">
          <input type="checkbox" id="accept-terms" name="acceptTerms" required />
          <label htmlFor="accept-terms">
            Estoy de acuerdo con la <Link to="/politica-privacidad">Política de privacidad</Link> y los <Link to="/terminos-condiciones">Términos y Condiciones</Link> de FarmaWeb, así como el envío de noticias y promociones exclusivas.
          </label>
        </div>

        {/* Botones de Acción */}

        <div className="register-actions">
          {/* El botón Cancelar vuelve al panel */}
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="auth-submit-button main-action-btn"
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'CREAR CUENTA'}
          </button>
        </div>

        {/* Ocultar el enlace de "Ya tienes cuenta" si está incrustado */}
        {!isEmbedded && (
          <p className="auth-switch-link">
            ¿Ya tienes cuenta? <a href="/login">Inicia Sesión aquí</a>
          </p>
        )}
      </form>
  );
};

export default RegistrationForm;