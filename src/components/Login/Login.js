import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './stylesLogin.css';

const LoginRegistro = ({ onLogin }) => {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [formLogin, setFormLogin] = useState({
    Email: '',
    Clave: ''
  });

  const [formRegistro, setFormRegistro] = useState({
    Nombre: '',
    Telefono: '',
    Email: '',
    Usuario: '',
    Clave: '',
    Rol: '',
    NumeroCedula: '',
    TipoDocumento: '',
    Direccion: ''
  });

  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  // Cargar roles
  useEffect(() => {
    axios.get('http://localhost:5002/api/obtenerRoles')
      .then(res => {
        setRoles(res.data);
        if (res.data.length > 0) {
          setFormRegistro(prev => ({ ...prev, Rol: res.data[0].id }));
        }
      })
      .catch(err => console.error('Error al obtener roles:', err));
  }, []);

  // Cambios en formulario de login
  const handleLoginChange = (e) => {
    setFormLogin({ ...formLogin, [e.target.name]: e.target.value });
  };

  // Cambios en formulario de registro
  const handleRegistroChange = (e) => {
    setFormRegistro({ ...formRegistro, [e.target.name]: e.target.value });
  };

  // Enviar login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/api/login', {
        email: formLogin.Email,
        password: formLogin.Clave,
      });

      if (response.data.success) {
        alert('Inicio de sesión exitoso');
        onLogin();
        navigate('/menu');
      } else {
        alert('Correo o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Ocurrió un error al iniciar sesión');
    }
  };

  // Enviar registro (tu código tal cual)
  const handleRegistroSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5002/api/usuarios', formRegistro)
      .then(res => alert('Usuario registrado correctamente.'))
      .catch(err => alert('Error al registrar: ' + (err.response?.data?.error || 'Error desconocido')));
  };

  const toggleForm = () => {
    setIsLoginActive(!isLoginActive);
  };

  return (
    <div className={`container ${isLoginActive ? '' : 'right-panel-active'}`}>
      {/* REGISTRO */}
      <div className="form-container sign-up-container">
        <form onSubmit={handleRegistroSubmit}>
          <h1>Crear Cuenta</h1>
          <input type="text" name="Nombre" placeholder="Nombre" onChange={handleRegistroChange} required />
          <input type="text" name="Telefono" placeholder="Teléfono" onChange={handleRegistroChange} required />
          <input type="email" name="Email" placeholder="Correo" onChange={handleRegistroChange} required />
          <input type="text" name="Usuario" placeholder="Usuario" onChange={handleRegistroChange} required />
          <input type="password" name="Clave" placeholder="Contraseña" onChange={handleRegistroChange} required />
          <input type="text" name="NumeroCedula" placeholder="Cédula" onChange={handleRegistroChange} required />
          <input type="text" name="TipoDocumento" placeholder="Tipo de documento" onChange={handleRegistroChange} required />
          <input type="text" name="Direccion" placeholder="Dirección" onChange={handleRegistroChange} required />

          <select name="Rol" value={formRegistro.Rol} onChange={handleRegistroChange} required>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>{rol.nombreRol}</option>
            ))}
          </select>

          <button type="submit">Registrar</button>
        </form>
      </div>

      {/* LOGIN */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleLoginSubmit}>
          <h1>Iniciar Sesión</h1>
          <input type="email" name="Email" placeholder="Correo" value={formLogin.Email} onChange={handleLoginChange} required />
          <input type="password" name="Clave" placeholder="Contraseña" value={formLogin.Clave} onChange={handleLoginChange} required />
          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>

      {/* PANELES PARA CAMBIAR */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h2>¿Ya tienes cuenta?</h2>
            <p>Inicia sesión con tus datos</p>
            <button className="ghost" onClick={toggleForm}>Iniciar Sesión</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h2>¡Hola!</h2>
            <p>¿No tienes cuenta? Regístrate ahora</p>
            <button className="ghost" onClick={toggleForm}>Registrarse</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegistro;

