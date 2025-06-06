import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalAgregarRol from './ModalAgregarRol';
import ModalEditarRol from './ModalEditarRol';
import './stylesRoles.css';

const RolesSection = () => {
  const [roles, setRoles] = useState([]);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchRoles();
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
      fetchRoles();
      setShowAgregarModal(false);
      setMensaje('Agregado exitosamente el Rol.');
    } catch (error) {
      setMensaje('Error al agregar rol.');
    }
  };

  const toggleActivoRol = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 1 ? 0 : 1;
    try {
      await axios.put(`http://localhost:5002/api/roles/${id}/status`, { activo: nuevoEstado });
      fetchRoles();
      setMensaje(nuevoEstado ? 'Rol activado exitosamente.' : 'Rol desactivado exitosamente.');
    } catch (error) {
      setMensaje('Error al actualizar el estado del rol.');
    }
  };

  const handleEditarRol = async (rolActualizado) => {
    try {
      await axios.put(`http://localhost:5002/api/roles/${rolActualizado.id}`, rolActualizado);
      fetchRoles();
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

  const rolesFiltrados = roles.filter((rol) =>
    rol.nombreRol.toLowerCase().includes(busqueda.toLowerCase())
  );

return (
  <div className="roles-main-content">
    <h1 className="roles-titulo-pago">Roles</h1>

    <div className="roles-acciones-top">
      <input
        type="text"
        placeholder="Buscar rol..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="roles-buscador-input"
      />
      <button className="roles-btn-agregar" onClick={() => setShowAgregarModal(true)}>
        Agregar Rol
      </button>
    </div>

    {mensaje && <p className="roles-mensaje">{mensaje}</p>}

    <table className="roles-tabla-metodos">
      <thead>
        <tr>
          <th>Nombre del Rol</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {rolesFiltrados.length > 0 ? (
          rolesFiltrados.map((rol) => (
            <tr key={rol.id}>
              <td>{rol.nombreRol}</td>
              <td>{rol.descripcion}</td>
              <td>
                <button
                  className={rol.activo ? 'roles-estado-activo' : 'roles-estado-inactivo'}
                  onClick={() => toggleActivoRol(rol.id, rol.activo)}
                >
                  {rol.activo ? 'Inactivar' : 'Activar'}
                </button>
              </td>
              <td>
                <button className="roles-btn-editar" onClick={() => abrirModalEditar(rol)}>
                  Editar
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4">No se encontraron roles.</td>
          </tr>
        )}
      </tbody>
    </table>

    {/* Aquí se renderiza el modal con sus props */}
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
