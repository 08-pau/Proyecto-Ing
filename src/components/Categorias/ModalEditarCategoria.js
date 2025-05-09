import React, { useState, useEffect } from 'react'; 
import './stylesCategorias.css'; 

const ModalEditarCategoria = ({ show, onClose, onEdit, categoria }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoFamilia, setTipoFamilia] = useState('');
  const [segmento, setSegmento] = useState('');
  const [subsegmento, setSubsegmento] = useState('');
  const [marcaPreferida, setMarcaPreferida] = useState('');
  const [presentacionProducto, setPresentacionProducto] = useState('');

  // Cargar los datos de la categoría cuando se abre el modal
  useEffect(() => {
    if (categoria) {
      setNombre(categoria.Nombre);
      setDescripcion(categoria.Descripcion);
      setTipoFamilia(categoria.Tipo_Familia);
      setSegmento(categoria.Segmento);
      setSubsegmento(categoria.Subsegmento);
      setMarcaPreferida(categoria.Marca_Preferida);
      setPresentacionProducto(categoria.Presentacion_Producto);
    }
  }, [categoria]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoria.ID_Categoria) {
      console.error('ID_Categoria no está definido');
      return;
    }
    const updatedCategoria = {
      ID_Categoria: categoria.ID_Categoria, // Asegúrate de incluir el ID
      Nombre: nombre,
      Descripcion: descripcion,
      Tipo_Familia: tipoFamilia,
      Segmento: segmento,
      Subsegmento: subsegmento,
      Marca_Preferida: marcaPreferida,
      Presentacion_Producto: presentacionProducto
    };
    onEdit(updatedCategoria);  // Pasar la categoría actualizada
  };

  return (
    <div className="modal" style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Editar Categoría</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category-name">Nombre</label>
            <input 
              type="text" 
              id="category-name" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="category-description">Descripción</label>
            <input 
              type="text" 
              id="category-description" 
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="tipo-familia">Tipo Familia</label>
            <input 
              type="text" 
              id="tipo-familia" 
              value={tipoFamilia} 
              onChange={(e) => setTipoFamilia(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="segmento">Segmento</label>
            <input 
              type="text" 
              id="segmento" 
              value={segmento} 
              onChange={(e) => setSegmento(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="subsegmento">Subsegmento</label>
            <input 
              type="text" 
              id="subsegmento" 
              value={subsegmento} 
              onChange={(e) => setSubsegmento(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="marca-preferida">Marca Preferida</label>
            <input 
              type="text" 
              id="marca-preferida" 
              value={marcaPreferida} 
              onChange={(e) => setMarcaPreferida(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="presentacion-producto">Presentación Producto</label>
            <input 
              type="text" 
              id="presentacion-producto" 
              value={presentacionProducto} 
              onChange={(e) => setPresentacionProducto(e.target.value)} 
              required 
            />
          </div>
          <button type="submit">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarCategoria;
