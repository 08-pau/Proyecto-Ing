import React from 'react';
import './App.css';

function Section({ id, title, children }) {
  return (
    <div id={id} className="section active">
      <h1>{title}</h1>
      <div className="product-grid">
        {children}
      </div>
    </div>
  );
}

export default Section;
