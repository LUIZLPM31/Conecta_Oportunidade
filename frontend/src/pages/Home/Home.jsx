import { Link } from 'react-router-dom'
import { Briefcase, GraduationCap, Users, ArrowRight, Zap, Target, Sparkles, Rocket } from 'lucide-react'
import heroWorkerImage from '../../assets/hero_trabalhador.jpg'

const ODS = [
  { num: '8',  cor: 'bg-emerald-600', texto: 'Trabalho Decente e Crescimento Econômico' },
  { num: '10', cor: 'bg-violet-600', texto: 'Redução das Desigualdades' },
]

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-emerald-500/30">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-24">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto relative z-10 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 font-medium text-sm mb-6 shadow-xl">
                <Sparkles className="w-4 h-4" />
                Programa Transforma Futuros
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                Conecte-se a <br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">
                  oportunidades reais
                </span>
                <span className="inline-flex items-center justify-center ml-2.5 p-2 md:p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 align-middle shadow-lg shadow-emerald-500/20 backdrop-blur-md hover:scale-110 transition-transform duration-300">
                  <Rocket className="w-6 h-6 md:w-8 md:h-8 -rotate-12 hover:rotate-0 transition-transform duration-300" />
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
                Uma plataforma que aproxima adultos em busca de emprego a vagas justas
                e cursos de capacitação gratuitos — porque talento não tem CEP.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start">
                <Link to="/vagas" className="group flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-400 hover:shadow-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 text-lg">
                  <Briefcase className="w-5 h-5" />
                  Ver Vagas
                </Link>
                <Link to="/registro" className="group flex items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 text-lg">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  Cadastre-se Grátis
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end relative mt-6 lg:mt-0">
              {/* Moldura moderna e humanizada com a foto do trabalhador */}
              <div className="relative group max-w-md lg:max-w-lg w-full">
                {/* Glow decorativo de fundo */}
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/30 to-teal-400/20 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-500"></div>
                
                {/* Container da foto com cantos arredondados e borda translúcida */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-white/15 shadow-2xl shadow-emerald-950/50 bg-slate-800">
                  <img 
                    src={heroWorkerImage} 
                    alt="Trabalhador capacitado segurando notebook e sorrindo feliz" 
                    className="w-full h-[380px] sm:h-[460px] object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                  {/* Gradiente suave na base da foto para contraste */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none"></div>

                  {/* Card flutuante institucional inferior no estilo Senac/Recode */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/15 flex items-center justify-between shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm leading-tight mb-0.5">Capacitação Gratuita</p>
                        <p className="text-emerald-400 text-xs font-medium mb-0">Cursos com certificação</p>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-500/30">
                      Oportunidades
                    </span>
                  </div>
                </div>

                {/* Badge flutuante superior com ícone de brilho */}
                <div className="absolute -top-4 -left-3 sm:-left-5 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-white shadow-xl shadow-slate-950/30 flex items-center gap-3 z-30 animate-pulse">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 leading-none">Novas Turmas</div>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">100% Gratuitas</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 -mt-10 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Briefcase, val: 'Vagas', desc: 'Oportunidades de emprego', corIcone: 'text-emerald-600', bgIcone: 'bg-emerald-50', hover: 'hover:border-emerald-200' },
              { icon: GraduationCap, val: 'Cursos', desc: 'Capacitações gratuitas', corIcone: 'text-violet-600', bgIcone: 'bg-violet-50', hover: 'hover:border-violet-200' },
              { icon: Users, val: 'Conexões', desc: 'Candidatos e empresas', corIcone: 'text-amber-600', bgIcone: 'bg-amber-50', hover: 'hover:border-amber-200' },
            ].map((s, idx) => (
              <div key={idx} className={`group flex flex-col items-center text-center rounded-2xl bg-white p-8 shadow-lg shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${s.hover}`}>
                <div className={`mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${s.bgIcone} transition-transform duration-300 group-hover:scale-110`}>
                  <s.icon className={`w-8 h-8 ${s.corIcone}`} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{s.val}</h3>
                <p className="text-slate-500 font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ODS Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Nosso Impacto Social</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Alinhados às Metas Globais da ONU para um futuro mais próspero e igualitário.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto">
            {ODS.map((o) => (
              <div key={o.num} className="group flex flex-col items-center text-center rounded-3xl bg-white p-10 border border-slate-100 shadow-md shadow-slate-200/40 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 text-white text-3xl font-black shadow-lg ${o.cor} transition-transform duration-500 group-hover:rotate-[360deg]`}>
                  {o.num}
                </div>
                <h5 className="text-xl font-bold text-slate-800 mb-3">Objetivo {o.num}</h5>
                <p className="text-slate-600 leading-relaxed font-medium">{o.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-emerald-900/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto text-center relative z-10 max-w-3xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md mb-8 border border-white/10">
            <Target className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Pronto para dar o próximo passo?
          </h2>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">
            Seja candidato buscando uma nova oportunidade ou empresa em busca de talentos. Junte-se a nós hoje.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/registro" className="group flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-400 hover:shadow-emerald-500/40 text-lg">
              Criar conta gratuita
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link to="/cursos" className="group flex items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 text-lg">
              Explorar cursos
            </Link>
          </div>
        </div>
      </section>
      
      {/* Add keyframes for float animation in index.css or via Tailwind arbitrary variants, 
          but Tailwind doesn't have float out of the box, we can add it to tailwind.config.js or style it inline.
          I'll just add it to tailwind config or keep standard transition. 
          Actually, I used `animate-[float_6s_ease-in-out_infinite]`, I should update tailwind.config.js. */}
    </div>
  )
}
