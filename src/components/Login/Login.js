import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './stylesLogin.css';

const LoginRegistro = ({ onLogin }) => {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [isForgotPasswordActive, setIsForgotPasswordActive] = useState(false);
  const [isResetPasswordStage, setIsResetPasswordStage] = useState(false);
  const [emailRecuperacion, setEmailRecuperacion] = useState('');
  const [nuevoPassword, setNuevoPassword] = useState('');
  const [userIdRecuperacion, setUserIdRecuperacion] = useState(null);
  const [formLogin, setFormLogin] = useState({ Email: '', Clave: '' });
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

  // 🧼 Limpiar formularios
  const limpiarFormularioRegistro = () => {
    setFormRegistro(prev => ({
      ...prev,
      Nombre: '',
      Telefono: '',
      Email: '',
      Usuario: '',
      Clave: '',
      NumeroCedula: '',
      TipoDocumento: '',
      Direccion: ''
      // Rol se mantiene
    }));
  };

  const limpiarFormularioLogin = () => {
    setFormLogin({
      Email: '',
      Clave: ''
    });
  };

  const toggleForm = () => {
    setIsLoginActive(!isLoginActive);
    setIsForgotPasswordActive(false);
    setIsResetPasswordStage(false);
    limpiarFormularioLogin();
    limpiarFormularioRegistro();
  };

  const handleLoginChange = (e) => {
    setFormLogin({ ...formLogin, [e.target.name]: e.target.value });
  };

  const handleRegistroChange = (e) => {
    setFormRegistro({ ...formRegistro, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5002/api/login', {
      email: formLogin.Email,
      password: formLogin.Clave,
    })
      .then(response => {
        if (response.data.success) {
          alert('Inicio de sesión exitoso');
          onLogin();
          navigate('/menu');
        } else {
          alert('Correo o contraseña incorrectos');
        }
        limpiarFormularioLogin(); // Limpia incluso si hubo error
      })
      .catch(error => {
        console.error('Error al iniciar sesión:', error);
        alert('Ocurrió un error al iniciar sesión');
        limpiarFormularioLogin();
      });
  };

  const handleRegistroSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5002/api/usuarios', formRegistro)
      .then(res => {
        alert('Usuario registrado correctamente.');
        limpiarFormularioRegistro();
      })
      .catch(err => alert('Error al registrar: ' + (err.response?.data?.error || 'Error desconocido')));
  };

  const handleVerificarCorreo = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5002/api/verificarCorreo', {
      email: emailRecuperacion.trim().toLowerCase()
    })
    .then(response => {
      setUserIdRecuperacion(response.data.userId);
      setIsResetPasswordStage(true);
    })
    .catch(error => {
      alert(error.response?.data?.error || 'Correo no encontrado');
    });
  };

  const handleCambiarClave = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5002/api/cambiarClave', {
      userId: userIdRecuperacion,
      nuevaClave: nuevoPassword,
    })
      .then(response => {
        alert('Contraseña actualizada correctamente');
        setIsForgotPasswordActive(false);
        setIsResetPasswordStage(false);
        setEmailRecuperacion('');
        setNuevoPassword('');
        setUserIdRecuperacion(null);
        limpiarFormularioLogin();
      })
      .catch(error => {
        alert(error.response?.data?.error || 'Error al cambiar la contraseña');
      });
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-image-section">
          <img src="/logo-belltech.png" alt="Belltech Logo" />
          <p>Sistema empresarial para control de inventario moderno y eficiente.</p>
          <button className="switch-btn" onClick={toggleForm}>
            {isLoginActive ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </div>

        <div className="login-form-section">
          <div className="tag">
            {isForgotPasswordActive
              ? isResetPasswordStage
                ? 'Cambiar Contraseña'
                : 'Recuperar Contraseña'
              : isLoginActive
              ? 'Welcome back'
              : 'Únete ahora'}
          </div>

          {isForgotPasswordActive ? (
            isResetPasswordStage ? (
              <form onSubmit={handleCambiarClave}>
                <h3>Ingresa tu nueva contraseña</h3>
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={nuevoPassword}
                  onChange={(e) => setNuevoPassword(e.target.value)}
                  required
                />
                <button type="submit">Actualizar contraseña</button>
                <div className="form-links">
                  <a href="#" onClick={() => {
                    setIsForgotPasswordActive(false);
                    setIsResetPasswordStage(false);
                    setEmailRecuperacion('');
                    setNuevoPassword('');
                    setUserIdRecuperacion(null);
                  }}>Cancelar</a>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerificarCorreo}>
                <h3>Ingresa tu correo</h3>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={emailRecuperacion}
                  onChange={(e) => setEmailRecuperacion(e.target.value.trim())}
                  required
                />
                <button type="submit">Continuar</button>
                <div className="form-links">
                  <a href="#" onClick={() => setIsForgotPasswordActive(false)}>Volver al login</a>
                </div>
              </form>
            )
          ) : isLoginActive ? (
            <form onSubmit={handleLoginSubmit}>
              <h3>Login your account</h3>
              <input type="text" name="Email" placeholder="Username" value={formLogin.Email} onChange={handleLoginChange} required />
              <input type="password" name="Clave" placeholder="Password" value={formLogin.Clave} onChange={handleLoginChange} required />
              <button type="submit">Login</button>
              <div className="form-links">
                <a href="#" onClick={() => setIsForgotPasswordActive(true)}>¿Olvidaste tu contraseña?</a>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegistroSubmit}>
              <h3>Crear Cuenta</h3>
              <input type="text" name="Nombre" placeholder="Nombre" value={formRegistro.Nombre} onChange={handleRegistroChange} required />
              <input type="text" name="Telefono" placeholder="Teléfono" value={formRegistro.Telefono} onChange={handleRegistroChange} required />
              <input type="email" name="Email" placeholder="Correo" value={formRegistro.Email} onChange={handleRegistroChange} required />
              <input type="text" name="Usuario" placeholder="Usuario" value={formRegistro.Usuario} onChange={handleRegistroChange} required />
              <input type="password" name="Clave" placeholder="Contraseña" value={formRegistro.Clave} onChange={handleRegistroChange} required />
              <input type="text" name="NumeroCedula" placeholder="Cédula" value={formRegistro.NumeroCedula} onChange={handleRegistroChange} required />
              <input type="text" name="TipoDocumento" placeholder="Tipo de documento" value={formRegistro.TipoDocumento} onChange={handleRegistroChange} required />
              <input type="text" name="Direccion" placeholder="Dirección" value={formRegistro.Direccion} onChange={handleRegistroChange} required />
              <select name="Rol" value={formRegistro.Rol} onChange={handleRegistroChange} required>
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>{rol.nombreRol}</option>
                ))}
              </select>
              <button type="submit">Registrar</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginRegistro;
