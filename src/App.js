import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import Login from './components/Login/Login';
import SignUp from './components/Login/SignUp';
import Sidebar from './components/Sidebar';
import Inventario from './components/Inventario/Inventario';
import Producto from './components/Productos/Producto';
import UserList from './components/Usuario/UserList';
import RolesSection from './components/Roles/RolesTable';
import Proveedores from './components/Proveedores/Proveedores';
import CategoryList from './components/Categorias/CategoryList';
import Compras from './components/Compras/PurchaseList';
import SalesList from './components/Ventas/SalesList';
import ListaSalidas from './components/Salida/ListaSalidas';
import Clientes from './components/Clientes/Clientes';
import MetodosPagoSection from './components/MetodoPago/MetodosPagoSection';
import './components/Sidebar.css';
import ListaEntradas from './components/Entrada/ListaEntradas';

import './components/Entrada/stylesEntrada.css';
import './components/Login/stylesLogin.css';
import './components/Menu/stylesMenu.css';
import './components/Inventario/App.css';
import './components/Productos/stylesProducto.css';
import './components/Usuario/stylesUsuario.css';
import './components/Roles/stylesRoles.css';
import './components/Proveedores/stylesProveedor.css';
import './components/Categorias/stylesCategorias.css';
import './components/Compras/stylesCompras.css';
import './components/Ventas/stylesVentas.css';
import './components/Promociones/stylesPromos.css';
import './components/Clientes/stylesCliente.css';
import './App.css';
import './components/MetodoPago/stylesMetodo.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div>
      
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/menu" />}
        />
        <Route
          path="/sign-up"
          element={!isAuthenticated ? <SignUp /> : <Navigate to="/menu" />}
        />
<Route
  path="/menu"
  element={
    isAuthenticated ? (
      <div className="menu-container">
        <Sidebar onLogout={handleLogout} />
        <div className="menu-content">
          <div className="menu-card">
            
            {/* Aquí puedes colocar el calendario */}
          </div>
        </div>
      </div>
    ) : (
      <Navigate to="/login" />
    )
  }
/>


        <Route
          path="/inventario"
          element={
            isAuthenticated ? (
              <div className="menu-container">
                <Sidebar onLogout={handleLogout} />
                <Inventario />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/productos"
          element={
            isAuthenticated ? (
              <div className="menu-container">
                <Sidebar onLogout={handleLogout} />
                <Producto />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/usuarios"
          element={
            isAuthenticated ? (
              <div className="menu-container">
                <Sidebar onLogout={handleLogout} />
                <UserList />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/roles"
          element={
            isAuthenticated ? (
              <div className="menu-container">
                <Sidebar onLogout={handleLogout} />
                <RolesSection />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/proveedores"
          element={
            isAuthenticated ? (
              <div className="menu-container">
                <Sidebar onLogout={handleLogout} />
                <Proveedores />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/categorías"
          element={
            isAuthenticated ? (
              <div className="menu-container">
                <Sidebar onLogout={handleLogout} />
                <CategoryList />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/compras"
          element={
            isAuthenticated ? (
              <div className="menu-container">
                <Sidebar onLogout={handleLogout} />
                <Compras />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/ventas"
          element={
            isAuthenticated ? (
              <div className="menu-container">
                <Sidebar onLogout={handleLogout} />
                <SalesList />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/ListaSalidas"
          element={
            isAuthenticated ? (
              <div className="menu-container">
                <Sidebar onLogout={handleLogout} />
                <ListaSalidas />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/metodopago"
          element={
            isAuthenticated ? (
              <div className="menu-container">
                <Sidebar onLogout={handleLogout} />
                <MetodosPagoSection />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/clientes"
          element={
            isAuthenticated ? (
              <div className="menu-container">
                <Sidebar onLogout={handleLogout} />
                <Clientes />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      <Route
    path="/ListaEntradas"
    element={isAuthenticated ? (
      <div className="menu-container">
        <Sidebar onLogout={handleLogout} />
        <ListaEntradas />
      </div>
    ) : (
      <Navigate to="/login" />
    )}
  />

      </Routes>


    </div>
  );
};

export default App;


