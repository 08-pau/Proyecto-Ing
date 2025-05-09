import React, { useState } from 'react';
import axios from 'axios';

const ModalAgregarPromocion = ({ show, onClose, fetchPromociones }) => {
    const [descripcion, setDescripcion] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [tipoPromocion, setTipoPromocion] = useState('');
    const [productoGratisId, setProductoGratisId] = useState('');
    const [productoComboId, setProductoComboId] = useState('');
    const [porcentajeIngresado, setPorcentajeIngresado] = useState('');
    const [montoIngresado, setMontoIngresado] = useState('');
    const [precioComboIngresado, setPrecioComboIngresado] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [promocionGuardada, setPromocionGuardada] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    
    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!isSaved) {
            const nuevaPromocion = { 
                tipoPromocion, 
                descripcion, 
                fechaInicio: formatDate(fechaInicio), 
                fechaFin: formatDate(fechaFin) 
            };
          
            try {
                const respuestaPromocion = await axios.post('http://localhost:5002/api/promocion', nuevaPromocion);
                
                // Verifica la respuesta de la API
                console.log("Respuesta de la promoción:", respuestaPromocion.data);
                
                // Asegúrate de que la respuesta contenga el id
                if (respuestaPromocion.data && respuestaPromocion.data.id) {
                    setPromocionGuardada(respuestaPromocion.data); // Almacena la promoción guardada
                    setIsSaved(true);
                    setMensaje('Promoción agregada exitosamente. Ahora puede agregar detalles adicionales.');
                } else {
                    setError('No se recibió el ID de la promoción.'); // Manejo de errores
                }
            } catch (error) {
                console.error('Error al agregar promoción:', error.response ? error.response.data : error.message);
                setError('Error al agregar promoción. Asegúrese de que todos los datos sean correctos.');
            }
        } else {
            try {
                const idPromocion = promocionGuardada.id; // Cambia a 'id' aquí
                if (!idPromocion) {
                    throw new Error('ID de promoción no disponible');
                }
    
                if (tipoPromocion === 'descuento') {
                    const descuento = {
                        ID_Promocion: idPromocion,
                        ID_Producto: productoComboId,
                        Porcentaje_Descuento: porcentajeIngresado,
                        Monto_descuento: montoIngresado,
                    };
                    await axios.post('http://localhost:5002/api/descuentos', descuento);
                } else if (tipoPromocion === 'productoCombo') {
                    const productoCombo = {
                        ID_Promocion: idPromocion,
                        ID_Producto: productoComboId,
                        PrecioCombo: precioComboIngresado,
                    };
                    await axios.post('http://localhost:5002/api/productos_combo', productoCombo);
                } else if (tipoPromocion === 'productoGratis') {
                    const productoGratis = {
                        ID_Promocion: idPromocion,
                        Producto_Gratis_ID: productoGratisId,
                    };
                    console.log("Datos del producto gratis a enviar:", productoGratis);
                    await axios.post('http://localhost:5002/api/promociones_producto_gratis', productoGratis);
                }
    
                if (fetchPromociones) {
                    fetchPromociones();
                }
                setMensaje('Detalles de promoción agregados exitosamente.');
                onClose();
            } catch (error) {
                console.error('Error al agregar detalles de promoción:', error.response ? error.response.data : error.message);
                setError('Error al agregar detalles de promoción. Asegúrese de que todos los datos sean correctos.');
            }
        }
    };
    

    return (
        <div className="modal" style={{ display: show ? 'block' : 'none' }}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Agregar Promoción</h2>
                    <span className="close" onClick={onClose}>&times;</span>
                </div>
                {error && <p className="error">{error}</p>}
                {mensaje && <p className="success">{mensaje}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción</label>
                        <input
                            type="text"
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaInicio">Fecha de Inicio</label>
                        <input
                            type="date"
                            id="fechaInicio"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaFin">Fecha de Fin</label>
                        <input
                            type="date"
                            id="fechaFin"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tipoPromocion">Tipo de Promoción</label>
                        <select
                            id="tipoPromocion"
                            value={tipoPromocion}
                            onChange={(e) => setTipoPromocion(e.target.value)}
                            required
                        >
                            <option value="">Seleccione</option>
                            <option value="descuento">Descuento</option>
                            <option value="productoCombo">Producto Combo</option>
                            <option value="productoGratis">Producto Gratis</option>
                        </select>
                    </div>

                    {isSaved && (
                        <div className="detalles-promocion">
                            <h3>Detalles de la Promoción</h3>
                            {tipoPromocion === 'descuento' && (
                                <>
                                    <div className="form-group">
                                        <label htmlFor="porcentajeIngresado">Porcentaje de Descuento</label>
                                        <input
                                            type="number"
                                            id="porcentajeIngresado"
                                            value={porcentajeIngresado}
                                            onChange={(e) => setPorcentajeIngresado(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="montoIngresado">Monto de Descuento</label>
                                        <input
                                            type="number"
                                            id="montoIngresado"
                                            value={montoIngresado}
                                            onChange={(e) => setMontoIngresado(e.target.value)}
                                            required
                                        />
                                    </div>
                                </>
                            )}
                            {tipoPromocion === 'productoCombo' && (
                                <>
                                    <div className="form-group">
                                        <label htmlFor="productoComboId">ID del Producto Combo</label>
                                        <input
                                            type="number"
                                            id="productoComboId"
                                            value={productoComboId}
                                            onChange={(e) => setProductoComboId(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="precioComboIngresado">Precio Combo</label>
                                        <input
                                            type="number"
                                            id="precioComboIngresado"
                                            value={precioComboIngresado}
                                            onChange={(e) => setPrecioComboIngresado(e.target.value)}
                                            required
                                        />
                                    </div>
                                </>
                            )}
                            {tipoPromocion === 'productoGratis' && (
                                <div className="form-group">
                                    <label htmlFor="productoGratisId">ID del Producto Gratis</label>
                                    <input
                                        type="number"
                                        id="productoGratisId"
                                        value={productoGratisId}
                                        onChange={(e) => setProductoGratisId(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <button type="submit">Guardar</button>
                </form>
            </div>
        </div>
    );
};

export default ModalAgregarPromocion;
