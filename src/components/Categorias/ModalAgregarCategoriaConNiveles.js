import React, { useState } from 'react';
import axios from 'axios';
import './stylesCategorias.css';

const ModalAgregarCategoriaConNiveles = ({ show, onClose, onAdd }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoFamilia, setTipoFamilia] = useState('');
  const [segmento, setSegmento] = useState('');
  const [subsegmento, setSubsegmento] = useState('');
  const [marcaPreferida, setMarcaPreferida] = useState('');
  const [presentacionProducto, setPresentacionProducto] = useState('');
  const [error, setError] = useState(''); // Estado para manejar errores

  const resetState = () => {
    setNombre('');
    setDescripcion('');
    setTipoFamilia('');
    setSegmento('');
    setSubsegmento('');
    setMarcaPreferida('');
    setPresentacionProducto('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevaCategoria = {
      Nombre: nombre,
      Descripcion: descripcion,
      Tipo_Familia: tipoFamilia,
      Segmento: segmento,
      Subsegmento: subsegmento,
      Marca_Preferida: marcaPreferida,
      Presentacion_Producto: presentacionProducto,
    };

    try {
      await onAdd(nuevaCategoria); // Asumiendo que `onAdd` maneja la llamada al servidor
      resetState(); // Limpiar el estado al agregar exitosamente
      onClose(); // Cierra el modal si se agrega exitosamente
    } catch (error) {
      setError(error.response?.data?.error || 'Error al agregar la categoría.'); // Maneja el error de la respuesta
    }
  };

  const handleClose = () => {
    resetState(); // Limpiar el estado al cerrar
    onClose(); // Cerrar el modal
  };
if (!show) return null; 
  return (
  <div className="categoria-modal" style={{ display: show ? 'flex' : 'none' }}>
    <div className="categoria-modal-content">
      <div className="categoria-modal-header">
        <h2>Agregar Categoría</h2>
        <span className="categoria-close" onClick={handleClose}>&times;</span>
      </div>

      {error && <p className="categoria-error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="categoria-form-group">
          <label htmlFor="categoria-nombre">Nombre</label>
          <input
            type="text"
            id="categoria-nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="categoria-form-group">
          <label htmlFor="categoria-descripcion">Descripción</label>
          <input
            type="text"
            id="categoria-descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div className="categoria-form-group">
          <label htmlFor="tipo-familia">Tipo Familia</label>
          <input
            type="text"
            id="tipo-familia"
            value={tipoFamilia}
            onChange={(e) => setTipoFamilia(e.target.value)}
            required
          />
        </div>

        <div className="categoria-form-group">
          <label htmlFor="segmento">Segmento</label>
          <input
            type="text"
            id="segmento"
            value={segmento}
            onChange={(e) => setSegmento(e.target.value)}
            required
          />
        </div>

        <div className="categoria-form-group">
          <label htmlFor="subsegmento">Subsegmento</label>
          <input
            type="text"
            id="subsegmento"
            value={subsegmento}
            onChange={(e) => setSubsegmento(e.target.value)}
          />
        </div>

        <div className="categoria-form-group">
          <label htmlFor="marca-preferida">Marca Preferida</label>
          <input
            type="text"
            id="marca-preferida"
            value={marcaPreferida}
            onChange={(e) => setMarcaPreferida(e.target.value)}
          />
        </div>

        <div className="categoria-form-group">
          <label htmlFor="presentacion-producto">Presentación Producto</label>
          <input
            type="text"
            id="presentacion-producto"
            value={presentacionProducto}
            onChange={(e) => setPresentacionProducto(e.target.value)}
          />
        </div>

        <div className="categoria-form-buttons">
          <button type="submit">Guardar</button>
          <button type="button" onClick={handleClose}>Cancelar</button>
        </div>
      </form>
    </div>
  </div>
);

};

export default ModalAgregarCategoriaConNiveles;
