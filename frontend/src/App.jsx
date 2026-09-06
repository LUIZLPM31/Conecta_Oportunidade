import Navbar    from './components/Navbar/Navbar'
import Footer    from './components/Footer/Footer'
import AppRoutes from './routes/AppRoutes'
import { useLocation } from 'react-router-dom'

const SEM_LAYOUT = ['/login', '/registro']

export default function App() {
  const { pathname } = useLocation()
  const semLayout = SEM_LAYOUT.includes(pathname)

  return (
    <div className="d-flex flex-column min-vh-100">
      {!semLayout && <Navbar />}
      <main className="flex-grow-1">
        <AppRoutes />
      </main>
      {!semLayout && <Footer />}
    </div>
  )
}
