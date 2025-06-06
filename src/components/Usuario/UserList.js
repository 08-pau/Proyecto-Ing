import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import './stylesUsuario.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setCargando(true);
    try {
      const response = await axios.get('http://localhost:5002/api/usuarios');
      setUsers(response.data);
    } catch (error) {
      setMensaje('Error al obtener usuarios.');
      console.error('Error fetching users:', error);
    } finally {
      setCargando(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error al obtener roles:', error);
    }
  };

  const getNombreRol = (idRol) => {
    const rol = roles.find((r) => r.id === idRol);
    return rol ? rol.nombreRol : 'Sin Rol';
  };

  const handleAddUser = async (nuevoUsuario) => {
    try {
      await axios.post('http://localhost:5002/api/usuarios', nuevoUsuario);
      fetchUsers();
      setShowAddModal(false);
      setMensaje('Usuario agregado exitosamente.');
    } catch (error) {
      setMensaje('Error al agregar usuario.');
      console.error('Error adding user:', error.response?.data || error.message);
    }
  };

  const handleEditUser = async (usuarioActualizado) => {
    try {
      await axios.put(`http://localhost:5002/api/usuarios/${usuarioActualizado.ID_Usuario}`, usuarioActualizado);
      fetchUsers();
      setShowEditModal(false);
      setMensaje('Usuario actualizado exitosamente.');
    } catch (error) {
      setMensaje(`Error al actualizar usuario: ${error.response?.data?.error || error.message}`);
      console.error('Error updating user:', error);
    }
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      const newState = isActive ? 0 : 1;
      await axios.put(`http://localhost:5002/api/usuarios/estado/${userId}`, { activo: newState });
      fetchUsers();
      setMensaje(`Usuario ${newState ? 'activado' : 'inactivado'} exitosamente.`);
    } catch (error) {
      setMensaje(`Error al actualizar estado del usuario: ${error.response?.data?.error || error.message}`);
      console.error('Error toggling user state:', error);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const usuariosFiltrados = users.filter(user =>
    user.Nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

return (
  <div className="usuario-main-content">
    <h1 className="usuario-titulo">Listado de Usuarios</h1>

    <div className="usuario-acciones-top">
      <input
        type="text"
        placeholder="Buscar usuario..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="usuario-buscador-input"
      />
      <button className="usuario-btn-agregar" onClick={() => setShowAddModal(true)}>
        Agregar Usuario
      </button>
    </div>

    {mensaje && <p className="usuario-mensaje">{mensaje}</p>}
    <div className="usuario-container">
    <table className="usuario-tabla-metodos">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Tipo Documento</th>
          <th>Número</th>
          <th>Dirección</th>
          <th>Teléfono</th>
          <th>Email</th>
          <th>Contraseña</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuariosFiltrados.length > 0 ? (
          usuariosFiltrados.map(user => (
            <tr key={user.ID_Usuario}>
              <td>{user.Nombre}</td>
              <td>{user.TipoDocumento}</td>
              <td>{user.NumeroCedula}</td>
              <td>{user.Direccion}</td>
              <td>{user.Telefono}</td>
              <td>{user.Email}</td>
              <td>••••••</td>
              <td>{getNombreRol(user.idRol)}</td>
              <td>
                <button
                  className={user.activo ? 'usuario-estado-activo' : 'usuario-estado-inactivo'}
                  onClick={() => handleToggleActive(user.ID_Usuario, user.activo)}
                >
                  {user.activo ? 'Inactivar' : 'Activar'}
                </button>
              </td>
              <td>
                <button className="usuario-btn-editar" onClick={() => openEditModal(user)}>
                  Editar
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr><td colSpan="10">No se encontraron usuarios.</td></tr>
        )}
      </tbody>
    </table>
</div>
    <AddUserModal
      show={showAddModal}
      onClose={() => setShowAddModal(false)}
      onAdd={handleAddUser}
    />
    <EditUserModal
      show={showEditModal}
      onClose={() => setShowEditModal(false)}
      onEdit={handleEditUser}
      usuario={selectedUser}
    />
  </div>
);

};

export default UserList;
