import React from 'react';

import Sidebar from './sidebar/Sidebar'
import MainContent from './mainContent/MainContent'

import './App.css';

function App() {
  return (
    <div className="App">
      <Sidebar />
      <MainContent />
    </div>
  );
}

export default App;
