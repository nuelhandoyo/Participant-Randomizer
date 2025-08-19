import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { HomePage } from './components/home/HomePage';
import { PresenterInterface } from './components/presenter/PresenterInterface';
import { ParticipantInterface } from './components/participant/ParticipantInterface';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/presenter" element={<PresenterInterface />} />
          <Route path="/participant" element={<ParticipantInterface />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;