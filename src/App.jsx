import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Pacientes from './pages/Pacientes'
import Especialidades from './pages/Especialidades'
import Medicos from './pages/Medicos'
import Citas from './pages/Citas'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-center" />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/especialidades" element={<Especialidades />} />
          <Route path="/medicos" element={<Medicos />} />
          <Route path="/citas" element={<Citas />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App;