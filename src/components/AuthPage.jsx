import React, { useState } from "react";
import Login from "./Login";
import RegisterPanel from "./RegisterPanel";
import RegistrationForm from "./RegistrationForm";
import "./AuthPage.css";

const AuthPage = () => {

    const [isRegistering, setIsRegistering] = useState(false);

    const handleStartRegistration = () => {
        setIsRegistering(true);
    };

    const handleCancelRegistration = () => {
        setIsRegistering(false);
    };

    const renderRegistrationContent = () => {
        if (isRegistering) {
            // 🛑 Mostrar el Formulario completo
            return <RegistrationForm onCancel={handleCancelRegistration} isEmbedded={true} />;
        } else {
            // 🛑 Mostrar el Panel informativo por defecto
            return <RegisterPanel onStartRegistration={handleStartRegistration} />;
        }
    };

    return (
        <div className="auth-page-container">
            <h1 className="auth-page-title">Iniciar sesión o crear una cuenta</h1>
            <div className="auth-forms-wrapper">

                {/* Columna de Cliente Existente (Login) */}
                <div className="auth-form-column existing-customer">
                    <h2 className="column-title">Cliente existente</h2>
                    {/* El componente Login se encargará de su propio contenido */}
                    <Login isEmbedded={true} /> {/* Pasamos una prop para indicar que está incrustado */}
                </div>
            
                {/* Columna de Crear una Cuenta (Register) */}
                <div className="auth-form-column create-account">
                    {renderRegistrationContent()}
                    {/* 🛑 CORRECCIÓN CLAVE: Renderizar la función dinámica aquí */}
                </div> 
            </div>

        </div>
    )
}

export default AuthPage;