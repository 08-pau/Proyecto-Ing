import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import './stylesUsuario.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setCargando(true);
    try {
      const response = await axios.get('http://localhost:5002/api/usuarios');
      console.log(response.data); // Verifica aquí que recibes los datos correctos
      setUsers(response.data);
    } catch (error) {
      setMensaje('Error al obtener usuarios.');
      console.error('Error fetching users:', error);
    } finally {
      setCargando(false);
    }
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
      const newState = isActive ? 0 : 1; // Si está activo, lo inactivamos, y viceversa
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

  return (
    <div className="main-content">
      <h1>Listado de Usuarios</h1>
      <button onClick={() => setShowAddModal(true)}>Agregar Usuario</button>

      {mensaje && <p>{mensaje}</p>}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo de documento</th>
            <th>Número de documento</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Correo electrónico</th>
            <th>Usuario</th>
            <th>Contraseña</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => {
              console.log(user); // Verifica la estructura de los datos del usuario
              return (
                <tr key={user.ID_Usuario}>
                  <td>{user.Nombre}</td>
                  <td>{user.TipoDocumento}</td>
                  <td>{user.NumeroCedula}</td>
                  <td>{user.Direccion}</td>
                  <td>{user.Telefono}</td>
                  <td>{user.Email}</td>
                  <td>{user.Usuario}</td>
                  <td>{user.Clave}</td>
                  <td>{user.idRol}</td>
                  <td>
                    <button onClick={() => handleToggleActive(user.ID_Usuario, user.activo)}> 
                      {user.activo ? 'Inactivar' : 'Activar'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => openEditModal(user)}>Editar</button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr><td colSpan="11">No se encontraron usuarios.</td></tr>
          )}
        </tbody>
      </table>

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

