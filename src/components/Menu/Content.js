import React from 'react';
import './stylesMenu.css';

const Content = ({ activeSection }) => {
  return (
    <div className="menu-content">
      <h1>Bienvenido a Mi Negocio</h1>
      <p>Estamos encantados de tenerte aquí.</p>
      <p>Explora las diferentes opciones en el menú lateral para gestionar tu negocio de manera eficiente.</p>
      <p>¡Esperamos que disfrutes de la experiencia!</p>
    </div>
  );
};

export default Content;
