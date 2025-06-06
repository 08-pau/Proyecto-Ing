import React, { useState } from 'react';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de registro
    console.log('Registro exitoso');
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleSubmit}>
        <h1>Crear Cuenta</h1>
        <div className="social-container">
          <a href="#" className="social"><img src="facebook.png" alt="Facebook" /></a>
          <a href="#" className="social"><img src="CROMO.png" alt="Google" /></a>
        </div>
        <span>o utiliza tu correo electrónico para registrarte</span>
        <input
          type="text"
          id="signup-name" // Atributo id
          name="name" // Atributo name
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name" // Atributo de autocompletado
        />
        <input
          type="email"
          id="signup-email" // Atributo id
          name="email" // Atributo name
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email" // Atributo de autocompletado
        />
        <input
          type="password"
          id="signup-password" // Atributo id
          name="password" // Atributo name
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password" // Atributo de autocompletado
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;

