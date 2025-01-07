import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

function App() {
  return (
    <div>
      <h1>this is app.jsx</h1>
      <br/><br/><br/>

      <div><Link to="/First">First pages</Link></div><br/>
      <div><Link to="/Second">Second pages</Link></div><br/>
            
            
      
    </div>
  );
}

export default App;
