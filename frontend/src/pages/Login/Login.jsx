import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authService } from '../../services/services'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', senha: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await authService.login(form)
      login(data)
      toast.success(`Bem-vindo, ${data.nome}!`)

      if (data.tipoUsuario === 'ADMIN')    navigate('/admin')
      else if (data.tipoUsuario === 'EMPRESA') navigate('/empresa')
      else navigate('/candidato')
    } catch (err) {
      toast.error(err.response?.data?.erro || 'Credenciais inválidas.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center py-5" style={{ background: '#f8fafc' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="mb-3">
              <Link 
                to="/" 
                className="text-decoration-none text-secondary d-inline-flex align-items-center gap-2 fw-semibold small px-3 py-1.5 rounded-pill bg-white shadow-sm border"
                style={{ transition: 'all 0.2s' }}
              >
                <i className="bi bi-arrow-left"></i> Voltar ao início
              </Link>
            </div>

            <div className="card p-4 p-sm-5 shadow-sm border-0 rounded-4">
              <div className="text-center mb-4">
                <span className="fs-1">🔑</span>
                <h2 className="fw-bold mt-2 text-slate-900">Entrar</h2>
                <p className="text-muted small">Acesse sua conta Conecta Oportunidades</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">E-mail</label>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    className="form-control"
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Senha</label>
                  <input
                    type="password"
                    id="login-senha"
                    name="senha"
                    className="form-control"
                    placeholder="••••••"
                    value={form.senha}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  id="btn-login"
                  className="btn btn-primary w-100 fw-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                  )}
                  Entrar
                </button>
              </form>

              <p className="text-center mt-3 mb-0 small">
                Não tem conta?{' '}
                <Link to="/registro" className="text-primary fw-semibold">Cadastre-se</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
