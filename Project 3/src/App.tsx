import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PatientDetail from './components/PatientDetail';
import { mockPatients } from './mockData';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patient/:patientId" element={<PatientDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


