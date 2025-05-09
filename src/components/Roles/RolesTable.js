import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalAgregarRol from './ModalAgregarRol'; // Modal para agregar rol
import ModalEditarRol from './ModalEditarRol'; // Modal para editar rol

const RolesSection = () => {
  const [roles, setRoles] = useState([]);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetchRoles(); // Llamar a la función para obtener roles
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleAgregarRol = async (nuevoRol) => {
    try {
      await axios.post('http://localhost:5002/api/roles', nuevoRol);
      fetchRoles(); // Actualiza la lista de roles
      setShowAgregarModal(false);
      setMensaje('Agregado exitosamente el Rol.');
    } catch (error) {
      setMensaje('Error al agregar rol.');
    }
  };

  const toggleActivoRol = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 1 ? 0 : 1; // Cambia de activo a inactivo y viceversa
    try {
      await axios.put(`http://localhost:5002/api/roles/${id}/status`, { activo: nuevoEstado });
      fetchRoles(); // Actualiza la lista de roles
  
      if (nuevoEstado === 1) {
        setMensaje('Rol activado exitosamente.');
      } else {
        setMensaje('Rol desactivado exitosamente.');
      }
    } catch (error) {
      setMensaje('Error al actualizar el estado del rol.');
    }
  };
  

  const handleEditarRol = async (rolActualizado) => {
    try {
      const response = await axios.put(`http://localhost:5002/api/roles/${rolActualizado.id}`, rolActualizado);
      fetchRoles(); // Actualiza la lista de roles después de la edición
      setShowEditarModal(false);
      setMensaje('Rol actualizado exitosamente.');
    } catch (error) {
      setMensaje('Error al actualizar rol.');
    }
  };

  const abrirModalEditar = (rol) => {
    setRolSeleccionado(rol);
    setShowEditarModal(true);
  };

  return (
    <div className="main-content">
      <h1>Roles</h1>
      <button onClick={() => setShowAgregarModal(true)}>Agregar Rol</button>
      {mensaje && <p>{mensaje}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Rol</th>
            <th>Descripción</th>
            <th>Estado</th> {/* Nueva columna para estado */}
            <th>Acciones</th> {/* Nueva columna para acciones */}
          </tr>
        </thead>
        <tbody>
          {roles.length > 0 ? (
            roles.map((rol) => (
              <tr key={rol.id}>
                <td>{rol.id}</td>
                <td>{rol.nombreRol}</td>
                <td>{rol.descripcion}</td>
                <td>
                  <button onClick={() => toggleActivoRol(rol.id, rol.activo)}>
                    {rol.activo ? 'Inactivar' : 'Activar'}
                  </button>
                </td>
                <td>
                  <button onClick={() => abrirModalEditar(rol)}>Editar</button>
                 </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No se encontraron roles.</td>
            </tr>
          )}
        </tbody>
      </table>
      <ModalAgregarRol
        show={showAgregarModal}
        onClose={() => setShowAgregarModal(false)}
        onAdd={handleAgregarRol}
      />
      <ModalEditarRol
        show={showEditarModal}
        onClose={() => setShowEditarModal(false)}
        rol={rolSeleccionado}
        onEdit={handleEditarRol}
      />
    </div>
  );
};

export default RolesSection;

