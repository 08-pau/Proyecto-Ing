// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Menu/stylesMenu.css';

const Sidebar = ({ onLogout }) => {
  return (
    <div className="menu-sidebar">
      <div className="menu-logo">
        <img src="/logo-belltech.png" alt="Logo" className="menu-logo-img" />
            </div>
      <ul className="menu">
        <li><Link to="/inventario"><i className="fas fa-box"></i> Inventario</Link></li>
<li><Link to="/metodopago"><i className="fas fa-credit-card"></i> Método de Pago</Link></li>
<li><Link to="/productos"><i className="fas fa-store"></i> Productos</Link></li>
<li><Link to="/ventas"><i className="fas fa-chart-line"></i> Ventas</Link></li>
<li><Link to="/compras"><i className="fas fa-shopping-cart"></i> Compras</Link></li>
<li><Link to="/ListaSalidas"><i className="fas fa-truck"></i> Salidas</Link></li>
<li><Link to="/roles"><i className="fas fa-user-tag"></i> Roles</Link></li>
<li><Link to="/usuarios"><i className="fas fa-users"></i> Usuarios</Link></li>
<li><Link to="/proveedores"><i className="fas fa-industry"></i> Proveedores</Link></li>
<li><Link to="/clientes"><i className="fas fa-user"></i> Clientes</Link></li>
<li><Link to="/categorías"><i className="fas fa-folder-open"></i> Categorías</Link></li>
 <li><Link to="/ListaEntradas"><i className="fas fa-arrow-down"></i> Entradas</Link></li>

 <li><button onClick={onLogout} className="logout-btn">Cerrar Sesión</button></li>
   
</ul>
    </div>
  );
};

export default Sidebar;
