// Overlay.js
import React from 'react';

const Overlay = ({ onSignInClick, onSignUpClick }) => (
  <div className="overlay-container">
    <div className="overlay">
      <div className="overlay-panel overlay-left">
        <h1>Welcome Back!</h1>
        <p>Para mantenerse conectado con nosotros, inicie sesión con su información personal</p>
        <button className="ghost" onClick={onSignInClick}>Iniciar Sesión</button>
      </div>
      <div className="overlay-panel overlay-right">
        <h1>Hola, Amigo!</h1>
        <p>Introduce tus datos personales y comienza tu viaje con nosotros.</p>
        <button className="ghost" onClick={onSignUpClick}>Crear Cuenta</button>
      </div>
    </div>
  </div>
);

export default Overlay;
