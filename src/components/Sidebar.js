// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Menu/stylesMenu.css';
import logo from '../images/img.png';


const Sidebar = ({ onLogout }) => {
  return (
    <div className="menu-sidebar">
     <div className="menu-logo">
        <img src={logo} alt="Logo" />
        Super BellTech
      </div>
      <ul className="menu">
        <li><Link to="/inventario">Inventario</Link></li>
        <li><Link to="/metodopago">Metodo de Pago</Link></li>
        <li><Link to="/productos">Productos</Link></li>
        <li><Link to="/ventas">Ventas</Link></li>
        <li><Link to="/compras">Compras</Link></li>
        <li><Link to="/ListaSalidas">Salidas</Link></li>
        <li><Link to="/roles">Roles</Link></li>
        <li><Link to="/usuarios">Usuarios</Link></li>
        <li><Link to="/proveedores">Proveedores</Link></li>
        <li><Link to="/clientes">Clientes</Link></li>
        <li><Link to="/categorías">Categorías</Link></li>
        <li><button onClick={onLogout}>Cerrar Sesión</button></li>
      </ul>
    </div>
  );
};

export default Sidebar;
