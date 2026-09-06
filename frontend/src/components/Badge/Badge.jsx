export default function Badge({ tipo, valor }) {
  const cls = `badge rounded-pill px-3 py-1 badge-${tipo}-${valor}`
  const labels = {
    PRESENCIAL: '🏢 Presencial',
    REMOTO:     '💻 Remoto',
    HIBRIDO:    '🔀 Híbrido',
    ATIVA:      '✅ Ativa',
    ENCERRADA:  '🔴 Encerrada',
    PENDENTE:   '⏳ Pendente',
    APROVADO:   '✅ Aprovado',
    REJEITADO:  '❌ Rejeitado',
  }
  return <span className={cls}>{labels[valor] ?? valor}</span>
}
