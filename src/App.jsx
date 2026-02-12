import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Pacientes from './pages/Pacientes'
import Especialidades from './pages/Especialidades'
import Medicos from './pages/Medicos'
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/especialidades" element={<Especialidades />} />
          <Route path="/medicos" element={<Medicos />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App;