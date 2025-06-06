import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Envuelve App en BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Si quieres comenzar a medir el rendimiento de tu aplicación, pasa una función
// para registrar los resultados (por ejemplo: reportWebVitals(console.log))
// o envíalos a un endpoint de analíticas. Aprende más: https://bit.ly/CRA-vitals
reportWebVitals();
