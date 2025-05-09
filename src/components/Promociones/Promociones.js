import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalAgregarPromocion from './ModalAgregarPromocion';

const Promociones = () => {
    const [promociones, setPromociones] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Función para obtener la lista de promociones
    const fetchPromociones = async () => {
        try {
            const response = await axios.get('http://localhost:5002/api/promociones');
            setPromociones(response.data);
        } catch (error) {
            console.error("Error al obtener promociones:", error);
        }
    };

    useEffect(() => {
        fetchPromociones();
    }, []);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <div>
            <h1>Lista de Promociones</h1>
            <button onClick={handleOpenModal}>Agregar Promoción</button>
            <ul>
                {promociones.map(promocion => (
                    <li key={promocion.ID_Promocion}>{promocion.descripcion}</li>
                ))}
            </ul>

            {/* Modal para agregar promoción */}
            <ModalAgregarPromocion
                show={showModal}
                onClose={handleCloseModal}
                fetchPromociones={fetchPromociones} // Pasamos la función fetchPromociones al modal
            />
        </div>
    );
};

export default Promociones;
