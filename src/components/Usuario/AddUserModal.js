import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddUserModal = ({ show, onClose, onAdd }) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [documento, setDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (show) {
      const fetchRoles = async () => {
        try {
          const response = await axios.get('http://localhost:5002/api/obtenerRoles');
          console.log('Roles obtenidos:', response.data);

          if (Array.isArray(response.data)) {
            setRoles(response.data);
          } else {
            console.error('La respuesta de roles no es un array:', response.data);
            setRoles([]);
          }
        } catch (error) {
          console.error('Error al obtener los roles:', error);
          setError('No se pudieron cargar los roles.');
        }
      };

      fetchRoles();
    }

    return () => {
      setNombre('');
      setDireccion('');
      setDocumento('');
      setNumeroDocumento('');
      setTelefono('');
      setEmail('');
      setRol('');
      setUsuario('');
      setPassword('');
      setError('');
      setRoles([]);
    };
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !telefono || !email || !usuario || !password || !rol || !numeroDocumento || !direccion) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    const nuevoUsuario = {
      Nombre: nombre,
      Direccion: direccion,
      TipoDocumento: documento,
      NumeroCedula: numeroDocumento,
      Telefono: telefono,
      Email: email,
      Rol: rol,
      Usuario: usuario,
      Clave: password
    };

    console.log('Usuario a agregar:', nuevoUsuario);

    try {
      await onAdd(nuevoUsuario);
      onClose();
    } catch (error) {
      console.error('Error al agregar usuario:', error.response ? error.response.data : error.message);
      setError('Error al agregar usuario.');
    }
  };

  return (
    <div className="usuario-modal" style={{ display: show ? 'block' : 'none' }}>
  <div className="usuario-modal-content">
    <div className="usuario-modal-header">
      <h2>Agregar Usuario</h2>
      <span className="usuario-close" onClick={onClose}>&times;</span>
    </div>
    {error && <p className="usuario-error">{error}</p>}
    <form onSubmit={handleSubmit}>
      <div className="usuario-form-group">
        <label htmlFor="user-name">Nombre</label>
        <input type="text" id="user-name" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>

      <div className="usuario-form-group">
        <label htmlFor="user-address">Dirección</label>
        <input type="text" id="user-address" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
      </div>

      <div className="usuario-form-group">
        <label htmlFor="user-document">Tipo de documento</label>
        <input type="text" id="user-document" value={documento} onChange={(e) => setDocumento(e.target.value)} required />
      </div>

      <div className="usuario-form-group">
        <label htmlFor="user-document-number">Número de documento</label>
        <input type="text" id="user-document-number" value={numeroDocumento} onChange={(e) => setNumeroDocumento(e.target.value)} required />
      </div>

      <div className="usuario-form-group">
        <label htmlFor="user-phone">Teléfono</label>
        <input type="tel" id="user-phone" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
      </div>

      <div className="usuario-form-group">
        <label htmlFor="user-email">Correo electrónico</label>
        <input type="email" id="user-email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className="usuario-form-group">
        <label htmlFor="user-role">Rol</label>
        <select
          id="user-role"
          defaultValue=""
          onChange={(e) => setRol(e.target.value)}
          required
        >
          <option value="">Seleccione un rol</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.nombreRol}
            </option>
          ))}
        </select>
      </div>

      <div className="usuario-form-group">
        <label htmlFor="user-username">Usuario</label>
        <input type="text" id="user-username" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
      </div>

      <div className="usuario-form-group">
        <label htmlFor="user-password">Contraseña</label>
        <input type="password" id="user-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <div className="usuario-form-buttons">
        <button type="submit">Guardar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </div>
    </form>
  </div>
</div>
)
};

export default AddUserModal;
