import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddUserModal = ({ show, onClose, onAdd }) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [documento, setDocumento] = useState(''); // Valor por defecto
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]);

  // Obtener roles al mostrar el modal
  useEffect(() => {
    if (show) {
      const fetchRoles = async () => {
        try {
          const response = await axios.get('http://localhost:5002/api/obtenerRoles');
          console.log('Roles obtenidos:', response.data);
          setRoles(response.data); // Guardar el array de objetos en el estado
          if (response.data.length > 0) {
            setRol(response.data[0].id); // Asigna el ID del primer rol como valor por defecto
          }
        } catch (error) {
          console.error('Error al obtener los roles:', error);
          setError('No se pudieron cargar los roles.');
        }
      };
      fetchRoles();
    }

    
    // Limpiar el estado cuando se cierre el modal
    return () => {
      setNombre('');
      setDireccion('');
      setDocumento(''); // Restablecer a 'DNI'
      setNumeroDocumento('');
      setTelefono('');
      setEmail('');
      setRol(''); // Restablecer rol
      setUsuario('');
      setPassword('');
      setError('');
    };
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
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
      Rol: rol, // Ahora estamos usando el ID del rol
      Usuario: usuario,
      Clave: password
    };
    console.log(nuevoUsuario);  // Verificar los datos enviados

    try {
      // Intentar agregar el nuevo usuario
      await onAdd(nuevoUsuario);
      onClose(); // Cierra el modal después de agregar el usuario
    } catch (error) {
      // Captura el error y muestra un mensaje
      console.error('Error al agregar usuario:', error.response ? error.response.data : error.message);
      setError('Error al agregar usuario.'); // Mostrar mensaje de error en la UI
    }
  };

  return (
    <div className="modal" style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Agregar Usuario</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="user-name">Nombre</label>
            <input type="text" id="user-name" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="user-address">Dirección</label>
            <input type="text" id="user-address" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="user-document">Tipo de documento</label>
            <input
              type="text"
              id="user-document"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="user-document-number">Número de documento</label>
            <input type="text" id="user-document-number" value={numeroDocumento} onChange={(e) => setNumeroDocumento(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="user-phone">Teléfono</label>
            <input type="tel" id="user-phone" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="user-email">Correo electrónico</label>
            <input type="email" id="user-email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="user-role">Rol</label>
            <select id="user-role" value={rol} onChange={(e) => setRol(e.target.value)} required>
              {roles.length > 0 ? (
                roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.nombreRol} (ID: {role.id})
                  </option>
                ))
              ) : (
                <option value="">Cargando roles...</option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="user-username">Usuario</label>
            <input type="text" id="user-username" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="user-password">Contraseña</label>
            <input type="password" id="user-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-buttons">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
