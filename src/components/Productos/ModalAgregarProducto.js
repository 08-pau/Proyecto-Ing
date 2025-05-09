import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalAgregarPromocion from '../Promociones/ModalAgregarPromocion';

const ModalAgregarProducto = ({ show, onClose, onAdd }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [codigo, setCodigo] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [idImpuesto, setIdImpuesto] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [impuestos, setImpuestos] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPromotionOption, setShowPromotionOption] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);

  const fetchPromociones = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/obtenerPromociones');
      console.log('Promociones:', response.data);
      // Aquí puedes actualizar algún estado si necesitas usar las promociones
    } catch (error) {
      console.error('Error al obtener promociones:', error);
    }
  };

  useEffect(() => {
    if (show) {
      const fetchCategorias = async () => {
        try {
          const response = await axios.get('http://localhost:5002/api/obtenerCategorias');
          setCategorias(response.data);
          if (response.data.length > 0) {
            setIdCategoria(response.data[0].ID_Categoria);
          }
        } catch (error) {
          console.error('Error al obtener categorías:', error);
          setError('No se pudieron cargar las categorías.');
        }
      };

      const fetchImpuestos = async () => {
        try {
          const response = await axios.get('http://localhost:5002/api/obtenerImpuestos');
          setImpuestos(response.data);
          if (response.data.length > 0) {
            setIdImpuesto(response.data[0].ID_Impuesto);
          }
        } catch (error) {
          console.error('Error al obtener impuestos:', error);
          setError('No se pudieron cargar los impuestos.');
        }
      };

      fetchCategorias();
      fetchImpuestos();
    }

    return () => {
      // Limpiar estado
      setNombre('');
      setPrecio('');
      setStock('');
      setCodigo('');
      setIdCategoria('');
      setIdImpuesto('');
      setError('');
      setSuccessMessage('');
      setShowPromotionOption(false);
      setShowPromotionModal(false);
    };
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !precio || !stock || !idCategoria || !idImpuesto) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    const nuevoProducto = {
      nombre,
      precio,
      stock,
      codigo,
      idCategoria,
      idImpuesto,
    };

    try {
      const response = await axios.post('http://localhost:5002/api/productos', nuevoProducto);
      setSuccessMessage('Producto agregado correctamente');
      setShowPromotionOption(true);
      onAdd(response.data);
    } catch (error) {
      console.error('Error agregando producto:', error);
      setError('Error al agregar producto.');
    }
  };

  const handleAddPromotion = () => {
    setShowPromotionModal(true);
  };

  return (
    <div className="modal" style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Agregar Producto</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        
        <form onSubmit={handleSubmit}>
          <label>Nombre del Producto:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

          <label>Precio:</label>
          <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required step="0.01" />

          <label>Stock:</label>
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />

          <label>Código:</label>
          <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />

          <label>Categoría:</label>
          <select value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)} required>
            {categorias.length > 0 ? (
              categorias.map((cat) => (
                <option key={cat.ID_Categoria} value={cat.ID_Categoria}>
                  {cat.Nombre}
                </option>
              ))
            ) : (
              <option value="">Cargando categorías...</option>
            )}
          </select>

          <label>Impuesto:</label>
          <select value={idImpuesto} onChange={(e) => setIdImpuesto(e.target.value)} required>
            {impuestos.length > 0 ? (
              impuestos.map((imp) => (
                <option key={imp.ID_Impuesto} value={imp.ID_Impuesto}>
                  {imp.Nombre} - {imp.Porcentaje}%
                </option>
              ))
            ) : (
              <option value="">Cargando impuestos...</option>
            )}
          </select>

          <button type="submit">Agregar Producto</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>

        {showPromotionOption && (
          <div className="promotion-options">
            <p>¿Desea agregar una promoción al producto?</p>
            <button onClick={handleAddPromotion}>Sí, Agregar Promoción</button>
            <button onClick={onClose}>Salir</button>
          </div>
        )}
      </div>

      {/* Modal para agregar promoción */}
      <ModalAgregarPromocion
        show={showPromotionModal}
        onClose={() => setShowPromotionModal(false)}
        fetchPromociones={fetchPromociones} // Aquí pasamos fetchPromociones como prop
        onAdd={(nuevaPromocion) => {
            console.log('Promoción agregada:', nuevaPromocion);
            setShowPromotionModal(false);
        }}
      />
    </div>
  );
};

export default ModalAgregarProducto;
