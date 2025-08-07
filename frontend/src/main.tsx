import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { Version } from './pages/Version.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Layout from './layourts/layout.tsx';
import Vehicles from './pages/Vehicles.tsx';

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/vehicles" element={<Layout><Vehicles /></Layout>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
