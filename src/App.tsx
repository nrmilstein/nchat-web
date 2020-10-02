import React from 'react';

import Sidebar from './sidebar/Sidebar'
import ConversationView from './conversationView/ConversationView'

import './App.css';

function App() {
  return (
    <div className="App">
      <Sidebar />
      <ConversationView />
    </div>
  );
}

export default App;
