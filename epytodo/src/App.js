// src/App.js
import React from 'react';
import Auth from './components/Auth'; // Chemin relatif depuis App.js

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Auth />
      </header>
    </div>
  );
}

export default App;
