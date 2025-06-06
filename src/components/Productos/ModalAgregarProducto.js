import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalAgregarPromocion from '../Promociones/ModalAgregarPromocion';

const ModalAgregarProducto = ({ show, onClose, onAdd }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
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
    } catch (error) {
      console.error('Error al obtener promociones:', error);
    }
  };

  // 🔢 Función para generar código único
  const generarCodigo = () => {
    const timestamp = Date.now().toString().slice(-6); // últimos dígitos del timestamp
    const random = Math.random().toString(36).substring(2, 6).toUpperCase(); // aleatorio
    return `PRD-${timestamp}-${random}`; // ejemplo: PRD-513442-X7H2
  };

  useEffect(() => {
    if (show) {
      setCodigo(generarCodigo()); // generar al abrir el modal

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
      setNombre('');
      setPrecio('');
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

    if (!nombre || !precio || !idCategoria || !idImpuesto) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    const nuevoProducto = {
      nombre,
      precio,
      codigo,
      idCategoria,
      idImpuesto,
      stock: 0, // 🔧 aquí se asegura que inicie en cero
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
if (!show) return null; 
  return (
  <div className="producto-modal" style={{ display: show ? 'flex' : 'none' }}>
    <div className="producto-modal-content">
      <div className="producto-modal-header">
        <h2>Agregar Producto</h2>
        <span className="producto-close" onClick={onClose}>&times;</span>
      </div>

      {error && <p className="producto-error">{error}</p>}
      {successMessage && <p className="producto-success">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="producto-form-group">
          <label>Nombre del Producto:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="producto-form-group">
          <label>Precio:</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
            step="0.01"
          />
        </div>

        <div className="producto-form-group">
          <label>Código (generado automáticamente):</label>
          <input
            type="text"
            value={codigo}
            readOnly
            style={{ backgroundColor: '#f3f3f3' }}
          />
        </div>

        <div className="producto-form-group">
          <label>Categoría:</label>
          <select
            value={idCategoria}
            onChange={(e) => setIdCategoria(e.target.value)}
            required
          >
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
        </div>

        <div className="producto-form-group">
          <label>Impuesto:</label>
          <select
            value={idImpuesto}
            onChange={(e) => setIdImpuesto(e.target.value)}
            required
          >
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
        </div>

        <div className="producto-form-buttons">
          <button type="submit">Agregar Producto</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>

      {showPromotionOption && (
        <div className="producto-form-buttons" style={{ justifyContent: 'center', marginTop: '30px' }}>
          <p style={{ width: '100%', textAlign: 'center', fontWeight: '600', marginBottom: '15px' }}>
            ¿Desea agregar una promoción al producto?
          </p>
          <button type="button" onClick={handleAddPromotion}>Sí, Agregar Promoción</button>
          <button type="button" onClick={onClose}>Salir</button>
        </div>
      )}
    </div>

      <ModalAgregarPromocion
        show={showPromotionModal}
        onClose={() => setShowPromotionModal(false)}
        fetchPromociones={fetchPromociones}
        onAdd={(nuevaPromocion) => {
          console.log('Promoción agregada:', nuevaPromocion);
          setShowPromotionModal(false);
        }}
      />
    </div>
  );
};

export default ModalAgregarProducto;
