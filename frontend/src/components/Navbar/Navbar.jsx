import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Link as LinkIcon, Briefcase, GraduationCap, LogIn, UserPlus, Menu, X, LayoutDashboard, LogOut } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getDashboardPath = () => {
    if (!user) return '/login'
    if (user.tipoUsuario === 'ADMIN')    return '/admin'
    if (user.tipoUsuario === 'EMPRESA')  return '/empresa'
    return '/candidato'
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
              <LinkIcon className="w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              Conecta<span className="text-emerald-600">Oportunidades</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/vagas" className="flex items-center gap-2 text-slate-600 font-medium hover:text-emerald-600 transition-colors">
              <Briefcase className="w-5 h-5" />
              Vagas
            </Link>
            <Link to="/cursos" className="flex items-center gap-2 text-slate-600 font-medium hover:text-emerald-600 transition-colors">
              <GraduationCap className="w-5 h-5" />
              Capacitações
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <Link to={getDashboardPath()} className="flex items-center gap-2 text-emerald-600 font-semibold px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors">
                  <LayoutDashboard className="w-5 h-5" />
                  {user.nome.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-rose-600 font-medium px-4 py-2 rounded-lg border border-rose-200 hover:bg-rose-50 hover:border-rose-300 transition-all">
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 text-slate-600 font-semibold px-4 py-2 hover:text-emerald-600 transition-colors">
                  <LogIn className="w-5 h-5" />
                  Entrar
                </Link>
                <Link to="/registro" className="flex items-center gap-2 bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all">
                  <UserPlus className="w-5 h-5" />
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-4 shadow-lg absolute w-full">
          <Link to="/vagas" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-600 font-medium p-3 rounded-lg hover:bg-slate-50">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            Vagas
          </Link>
          <Link to="/cursos" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-600 font-medium p-3 rounded-lg hover:bg-slate-50">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            Capacitações
          </Link>
          
          <div className="border-t border-slate-100 pt-4 mt-2">
            {user ? (
              <div className="space-y-3">
                <Link to={getDashboardPath()} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-emerald-600 font-semibold p-3 rounded-lg bg-emerald-50">
                  <LayoutDashboard className="w-5 h-5" />
                  Painel de {user.nome.split(' ')[0]}
                </Link>
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 text-rose-600 font-medium p-3 rounded-lg border border-rose-200 hover:bg-rose-50">
                  <LogOut className="w-5 h-5" />
                  Sair da conta
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 text-slate-700 font-semibold p-3 rounded-xl border border-slate-200 hover:bg-slate-50">
                  <LogIn className="w-5 h-5" />
                  Entrar
                </Link>
                <Link to="/registro" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold p-3 rounded-xl shadow-md">
                  <UserPlus className="w-5 h-5" />
                  Cadastrar Grátis
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
