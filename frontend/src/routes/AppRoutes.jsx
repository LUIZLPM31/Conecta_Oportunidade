import { Routes, Route, Navigate } from 'react-router-dom'
import Home               from '../pages/Home/Home'
import Login              from '../pages/Login/Login'
import Registro           from '../pages/Registro/Registro'
import Vagas              from '../pages/Vagas/Vagas'
import Cursos             from '../pages/Cursos/Cursos'
import DashboardCandidato from '../pages/Dashboard/DashboardCandidato'
import DashboardEmpresa   from '../pages/Dashboard/DashboardEmpresa'
import DashboardAdmin     from '../pages/Dashboard/DashboardAdmin'
import PrivateRoute       from './PrivateRoute'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/"        element={<Home />} />
      <Route path="/vagas"   element={<Vagas />} />
      <Route path="/cursos"  element={<Cursos />} />
      <Route path="/login"   element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      {/* Candidato */}
      <Route path="/candidato" element={
        <PrivateRoute roles={['CANDIDATO']}>
          <DashboardCandidato />
        </PrivateRoute>
      } />

      {/* Empresa */}
      <Route path="/empresa" element={
        <PrivateRoute roles={['EMPRESA']}>
          <DashboardEmpresa />
        </PrivateRoute>
      } />

      {/* Admin */}
      <Route path="/admin" element={
        <PrivateRoute roles={['ADMIN']}>
          <DashboardAdmin />
        </PrivateRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
