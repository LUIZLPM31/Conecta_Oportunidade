import api from './api'

export const authService = {
  login:    (data) => api.post('/auth/login', data),
  registro: (data) => api.post('/auth/registro', data),
}

export const usuarioService = {
  listar:    ()         => api.get('/usuarios'),
  buscar:    (id)       => api.get(`/usuarios/${id}`),
  atualizar: (id, data) => api.put(`/usuarios/${id}`, data),
  deletar:   (id)       => api.delete(`/usuarios/${id}`),
}

export const vagaService = {
  listarAtivas:  ()         => api.get('/vagas'),
  listarTodas:   ()         => api.get('/vagas/todas'),
  minhasVagas:   ()         => api.get('/vagas/minhas'),
  buscar:        (id)       => api.get(`/vagas/${id}`),
  criar:         (data)     => api.post('/vagas', data),
  atualizar:     (id, data) => api.put(`/vagas/${id}`, data),
  alterarStatus: (id, s)    => api.patch(`/vagas/${id}/status?status=${s}`),
  deletar:       (id)       => api.delete(`/vagas/${id}`),
}

export const capacitacaoService = {
  listar:    ()         => api.get('/capacitacoes'),
  buscar:    (id)       => api.get(`/capacitacoes/${id}`),
  criar:     (data)     => api.post('/capacitacoes', data),
  atualizar: (id, data) => api.put(`/capacitacoes/${id}`, data),
  deletar:   (id)       => api.delete(`/capacitacoes/${id}`),
}

export const candidaturaService = {
  candidatar:      (vagaId)       => api.post(`/candidaturas/vaga/${vagaId}`),
  minhas:          ()             => api.get('/candidaturas/minhas'),
  todas:           ()             => api.get('/candidaturas/todas'),
  porVaga:         (vagaId)       => api.get(`/candidaturas/vaga/${vagaId}`),
  atualizarStatus: (id, status)   => api.patch(`/candidaturas/${id}/status?status=${status}`),
  deletar:         (id)           => api.delete(`/candidaturas/${id}`),
}
