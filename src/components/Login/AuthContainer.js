import React, { useState } from 'react';
import './Auth.css';

const Auth = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  return (
    <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
      {/* Sign Up Form */}
      <div className="form-container sign-up-container">
        <form>
          <h1>Create Account</h1>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Sign Up</button>
        </form>
      </div>

      {/* Sign In Form */}
      <div className="form-container sign-in-container">
        <form>
          <h1>Sign In</h1>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Sign In</button>
        </form>
      </div>

      {/* Overlay */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To stay connected, please login with your personal info</p>
            <button className="ghost" onClick={() => setIsRightPanelActive(false)}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your details and start your journey with us</p>
            <button className="ghost" onClick={() => setIsRightPanelActive(true)}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
