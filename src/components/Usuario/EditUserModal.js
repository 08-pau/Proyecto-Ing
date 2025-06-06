import React, { useState, useEffect } from 'react';
import './stylesUsuario.css';

const EditUserModal = ({ show, onClose, onEdit, usuario }) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [documento, setDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [rol, setRol] = useState('');
  const [usuarioNombre, setUsuarioNombre] = useState('');
  const [password, setPassword] = useState('');
  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.Nombre);
      setDireccion(usuario.Direccion);
      setTelefono(usuario.Telefono);
      setCorreo(usuario.Email);
      setDocumento(usuario.Documento);
      setNumeroDocumento(usuario.NumeroCedula);
      setRol(usuario.idRol);
      setUsuarioNombre(usuario.Usuario);
      setPassword(usuario.Clave);
      setImagen(usuario.Imagen || null);
    }
  }, [usuario]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usuario.ID_Usuario) return;

    const updatedUsuario = {
      ID_Usuario: usuario.ID_Usuario,
      Nombre: nombre,
      Direccion: direccion,
      Telefono: telefono,
      Email: correo,
      Documento: documento,
      NumeroDocumento: numeroDocumento,
      Rol: rol,
      Usuario: usuarioNombre,
      Password: password,
      Imagen: imagen,
    };
    onEdit(updatedUsuario);
  };

  return (
    <div className="usuario-modal" style={{ display: show ? 'flex' : 'none' }}>
      <div className="usuario-modal-content">
        <div className="usuario-modal-header">
          <h2>Editar Usuario</h2>
          <span className="usuario-close" onClick={onClose}>&times;</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="usuario-form-group">
            <label>Nombre</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className="usuario-form-group">
            <label>Dirección</label>
            <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
          </div>
          <div className="usuario-form-group">
            <label>Teléfono</label>
            <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
          </div>
          <div className="usuario-form-group">
            <label>Correo</label>
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          </div>

          <div className="usuario-form-group">
            <label>Documento</label>
            <select value={documento} disabled>
              <option value="DNI">DNI</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>
          <div className="usuario-form-group">
            <label>Número de documento</label>
            <input type="text" value={numeroDocumento} disabled />
          </div>
          <div className="usuario-form-group">
            <label>Rol</label>
            <input type="text" value={rol} disabled />
          </div>
          <div className="usuario-form-group">
            <label>Nombre de Usuario</label>
            <input type="text" value={usuarioNombre} disabled />
          </div>
          <div className="usuario-form-group">
            <label>Contraseña</label>
            <input type="password" value={password} disabled />
          </div>

          <div className="usuario-form-buttons">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
