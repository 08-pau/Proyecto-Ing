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

  // Cargar datos de usuario si existe
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
    if (!usuario.ID_Usuario) {
      console.error('ID_Usuario no está definido');
      return;
    }

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

  const handleFileChange = (e) => {
    setImagen(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="modal" style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Usuario</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
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
            <label htmlFor="user-phone">Teléfono</label>
            <input type="text" id="user-phone" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="user-email">Correo</label>
            <input type="email" id="user-email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          </div>

          {/* Campos no editables */}
          <div className="form-group">
            <label htmlFor="user-document">Documento</label>
            <select id="user-document" value={documento} disabled>
              <option value="DNI">DNI</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="user-document-number">Número de documento</label>
            <input type="text" id="user-document-number" value={numeroDocumento} disabled />
          </div>

          <div className="form-group">
            <label htmlFor="user-role">Rol</label>
            <input type="text" id="user-role" value={rol} disabled required /> {/* Campo no editable */}
          </div>
          <div className="form-group">
            <label htmlFor="user-username">Nombre de Usuario</label>
            <input type="text" id="user-username" value={usuarioNombre} disabled required /> {/* Campo no editable */}
          </div>
          <div className="form-group">
            <label htmlFor="user-password">Contraseña</label>
            <input type="password" id="user-password" value={password} disabled required /> {/* Campo no editable */}
          </div>
          <button type="submit">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
