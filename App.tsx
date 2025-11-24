
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Landing from './pages/Landing';
import LiveNexus from './pages/LiveNexus';
import VisualForge from './pages/VisualForge';
import IntelCore from './pages/IntelCore';
import Integrations from './pages/Integrations';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/live" element={<LiveNexus />} />
          <Route path="/visual" element={<VisualForge />} />
          <Route path="/intel" element={<IntelCore />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
