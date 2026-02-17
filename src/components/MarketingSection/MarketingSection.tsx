import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Monitor, Target, Settings, User, Globe, LayoutDashboard, TrendingUp, Activity, ClipboardList, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, Star } from 'lucide-react';


const slides = [
  {
    id: 'hero',
    tagline: "GESTÃO MULTIDISCIPLINAR",
    headline: <span>Transforme o Desenvolvimento Atípico com <span className="text-primary italic">Dados</span>, não Apenas Intuição.</span>,
    subheadline: "A primeira plataforma que conecta Escola, Família e Terapeutas em um ecossistema inteligente.",
    cta: "Solicitar Demonstração",
    visual: 'ecosystem',
    accent: "var(--primary)",
    glow: "rgba(35, 121, 188, 0.2)"
  },
  {
    id: 'problem',
    tagline: "O DESAFIO ATUAL",
    headline: <span>A <span className="text-red-400">Desconexão</span> está Travando o Progresso do Aluno?</span>,
    subheadline: "Informações perdidas no WhatsApp, relatórios atrasados e pais sobrecarregados. O tempo é precioso demais para burocracia.",
    cta: "Solicitar Demonstração",
    visual: 'problem',
    accent: "#f87171",
    glow: "rgba(248, 113, 113, 0.15)"
  },
  {
    id: 'solution_1',
    tagline: "UMA ÚNICA VERDADE",
    headline: <span>Dashboards em <span className="text-emerald-400">Tempo Real</span> para Decisões Precisas.</span>,
    subheadline: "Acompanhe a evolução exata dia após dia. Ajuste intervenções na hora certa com base em evidências, não achismos.",
    cta: "Solicitar Demonstração",
    visual: 'dashboard',
    accent: "#10b981",
    glow: "rgba(16, 185, 129, 0.15)"
  },
  {
    id: 'solution_2',
    tagline: "INTELIGÊNCIA CLÍNICA",
    headline: <span>Dados que Geram <span className="text-blue-400">Insights</span> Automáticos.</span>,
    subheadline: "Nossa IA analisa padrões de comportamento e sugere ajustes no PEI, economizando horas de análise manual.",
    cta: "Solicitar Demonstração",
    visual: 'analytics',
    accent: "#60a5fa",
    glow: "rgba(96, 165, 250, 0.15)"
  },
  {
    id: 'social_proof',
    tagline: "RESULTADOS COMPROVADOS",
    headline: <span>Junte-se às Clínicas Mais <span className="text-orange-400">Inovadoras</span> do Brasil.</span>,
    subheadline: "+1.200 Vidas Impactadas. 94% de Engajamento Familiar. 30% Menos Trabalho Administrativo.",
    cta: "Solicitar Demonstração",
    visual: 'proof',
    accent: "#f97316",
    glow: "rgba(249, 115, 22, 0.15)"
  }
];

const MarketingSection: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const active = slides[current];

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 12000); // 12s per slide for reading time
    return () => clearInterval(timer);
  }, [autoplay]);

  const handleManualNav = (index: number) => {
    setCurrent(index);
    setAutoplay(false); // Stop autoplay on user interaction
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#020617] px-8 sm:px-12 font-sans overflow-hidden text-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

      {/* Animated Glow Spot */}
      <motion.div
        animate={{ backgroundColor: active.glow }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[150px] rounded-full transition-colors duration-1000 opacity-60 pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center h-full justify-between py-12">



        {/* Main Content Area - Split Layout inside the pane */}
        <div className="flex-1 flex flex-col items-center justify-center w-full relative">

          {/* Visual Component */}
          <div className="w-full h-[380px] sm:h-[450px] flex items-center justify-center mb-8 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {active.visual === 'ecosystem' && <EcosystemRadar />}
                {active.visual === 'problem' && <ProblemVisual />}
                {active.visual === 'dashboard' && <DashboardBars color={active.accent} />}
                {active.visual === 'analytics' && <AnalyticsChart color={active.accent} />}
                {active.visual === 'proof' && <SocialProofVisual />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Text Content */}
          <div className="text-center max-w-2xl mx-auto relative z-20">
            <motion.div
              key={`text-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: active.accent }}></span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">{active.tagline}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                {active.headline}
              </h2>

              <p className="text-slate-400 text-lg leading-relaxed mb-8 font-medium">
                {active.subheadline}
              </p>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => window.open('https://vinculotea.com/demo', '_blank')}
                  className="group relative px-8 py-4 bg-white text-[#0f172a] rounded-xl font-bold text-sm uppercase tracking-wider overflow-hidden hover:scale-105 transition-transform duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {active.cta} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 w-full" />
                </button>

                {current === 0 && (
                  <button className="px-6 py-4 text-slate-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors">
                    Saiba Mais
                  </button>
                )}
              </div>
            </motion.div>
          </div>

        </div>

        {/* Bottom Navigation / Progress */}
        <div className="w-full flex justify-center gap-2 mt-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => handleManualNav(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${current === i ? 'w-12 bg-white' : 'w-2 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-2">
            <ShieldCheck size={12} />
            DADOS CRIPTOGRAFADOS E SEGUROS (LGPD/HIPAA)
          </p>
        </div>

      </div>
    </div>
  );
};

// --- VISUAL COMPONENTS ---

const EcosystemRadar = () => {
  // Reusing the sophisticated radar but optimized
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute w-[500px] h-[500px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
      <div className="absolute w-[350px] h-[350px] border border-white/10 rounded-full border-dashed animate-[spin_40s_linear_infinite_reverse]" />

      {/* Central Hub */}
      <div className="relative z-10 w-32 h-32 bg-primary/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-primary/50 shadow-[0_0_50px_rgba(20,57,109,0.3)]">
        <div className="w-20 h-20 bg-primary/80 rounded-full flex items-center justify-center text-white shadow-inner">
          <User size={32} />
        </div>
        {/* Connecting lines */}
        <div className="absolute top-1/2 left-1/2 w-[180px] h-[1px] bg-gradient-to-r from-primary to-transparent -translate-y-1/2 rotate-0 origin-left" />
        <div className="absolute top-1/2 left-1/2 w-[180px] h-[1px] bg-gradient-to-r from-primary to-transparent -translate-y-1/2 rotate-90 origin-left" />
        <div className="absolute top-1/2 left-1/2 w-[180px] h-[1px] bg-gradient-to-r from-primary to-transparent -translate-y-1/2 rotate-180 origin-left" />
        <div className="absolute top-1/2 left-1/2 w-[180px] h-[1px] bg-gradient-to-r from-primary to-transparent -translate-y-1/2 rotate-270 origin-left" />
      </div>

      {/* Orbiting Elements */}
      <Node icon={<Monitor size={20} />} label="ESCOLA" color="#10b981" angle={0} delay={0} />
      <Node icon={<Users size={20} />} label="FAMÍLIA" color="#0ea5e9" angle={90} delay={0.5} />
      <Node icon={<Settings size={20} />} label="CLÍNICA" color="#8b5cf6" angle={180} delay={1} />
      <Node icon={<ClipboardList size={20} />} label="PEI" color="#f59e0b" angle={270} delay={1.5} />
    </div>
  );
};

const Node = ({ icon, label, color, angle, delay }: any) => (
  <motion.div
    className="absolute"
    initial={{ rotate: angle }}
    animate={{ rotate: angle + 360 }}
    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
    style={{ width: '350px', height: '350px' }} // Orbit diameter
  >
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <motion.div
        className="relative group"
        style={{ transform: `rotate(-${angle}deg)` }} // Counter-rotate to keep icon upright? complex in this simple rig
      >
        <div className="w-16 h-16 bg-[#0f172a] border border-white/10 rounded-2xl flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group-hover:scale-110 transition-transform cursor-default">
          <div className="absolute inset-0 opacity-20" style={{ backgroundColor: color }} />
          <div style={{ color: color }} className="mb-1">{icon}</div>
          <span className="text-[9px] font-bold text-white/80">{label}</span>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

const ProblemVisual = () => {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
      {/* Chaos Visualization */}
      <div className="absolute inset-0 bg-red-500/5 rounded-full blur-3xl" />

      <motion.div
        animate={{ x: [0, 5, -5, 0], y: [0, -5, 5, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
        className="relative z-10 bg-red-500/10 p-8 rounded-3xl border border-red-500/20 backdrop-blur-sm"
      >
        <AlertCircle size={64} className="text-red-500 mb-4 mx-auto" strokeWidth={1} />
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-red-200/80 text-sm bg-black/20 p-2 rounded-lg">
            <AlertCircle size={14} /> Relatório Médico não encontrado
          </div>
          <div className="flex items-center gap-3 text-red-200/80 text-sm bg-black/20 p-2 rounded-lg opacity-60">
            <AlertCircle size={14} /> Comunicação escolar falhou
          </div>
          <div className="flex items-center gap-3 text-red-200/80 text-sm bg-black/20 p-2 rounded-lg opacity-40">
            <AlertCircle size={14} /> Intervenção inconsistente
          </div>
        </div>
      </motion.div>

      {/* Disconnected nodes floating around */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-red-500 rounded-full opacity-40"
          initial={{ x: 0, y: 0 }}
          animate={{
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100,
            opacity: [0, 0.5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
    </div>
  );
};

const SocialProofVisual = () => {
  const stats = [
    { label: "Membros da Rede", value: "1250+", color: "text-white" },
    { label: "Engajamento", value: "94%", color: "text-green-400" },
    { label: "Economia de Tempo", value: "30%", color: "text-blue-400" },
  ];

  return (
    <div className="w-full max-w-lg">
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center backdrop-blur-md"
          >
            <div className={`text-2xl sm:text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-[10px] sm:text-xs text-white/50 uppercase font-bold tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative">
        <div className="absolute -top-3 -right-3 bg-yellow-500 text-[#0f172a] p-2 rounded-xl shadow-lg">
          <Star size={20} fill="currentColor" />
        </div>
        <p className="text-white/90 italic font-medium text-lg leading-relaxed mb-4">
          "O VínculoTEA transformou nossa clínica. Antes eu passava 4 horas fazendo relatórios. Hoje, o sistema gera insights que eu nem imaginava."
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold">DR</div>
          <div>
            <div className="font-bold text-white text-sm">Dra. Juliana Mendes</div>
            <div className="text-xs text-slate-500">Neuropsicopedagoga, SP</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusing existing high-quality charts
const AnalyticsChart = ({ color }: { color: string }) => {
  const chartColor = color.startsWith('var') ? '#2379BC' : color;
  return (
    <div className="w-full max-w-lg bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl"><TrendingUp size={22} className="text-emerald-400" /></div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-white/80">Evolução no PEI</div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest">Últimos 30 dias</div>
          </div>
        </div>
        <div className="flex gap-1.5 opacity-50"><div className="w-2 h-2 rounded-full bg-white/20" /><div className="w-2 h-2 rounded-full bg-white/20" /></div>
      </div>
      <div className="relative h-48 w-full">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={chartColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path d="M0,100 L0,80 L15,40 L30,65 L45,25 L60,50 L75,15 L90,45 L100,30 L100,100 Z" fill="url(#chartFill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
          <motion.path d="M0,80 L15,40 L30,65 L45,25 L60,50 L75,15 L90,45 L100,30" fill="none" stroke={chartColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }} />
        </svg>
      </div>
    </div>
  );
};

const DashboardBars = ({ color }: { color: string }) => {
  const barColor = color.startsWith('var') ? '#2379BC' : color;
  return (
    <div className="relative w-full max-w-lg flex flex-col items-center justify-center">
      <div className="w-full bg-white/[0.02] backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">1.240</span>
            <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Interações Totais</span>
          </div>
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold">+12%</div>
        </div>
        <div className="flex items-end justify-between h-32 gap-3">
          {[40, 70, 45, 90, 60, 80, 65].map((h, i) => (
            <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.1, duration: 0.8 }} className="w-full rounded-t-lg opacity-80" style={{ background: `linear-gradient(to top, ${barColor}, transparent)` }} />
          ))}
        </div>
      </div>

      {/* Floating Card */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-6 -right-6 bg-[#0f172a] border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-4 pr-8"
      >
        <div className="p-3 bg-green-500 rounded-xl text-white"><CheckCircle2 size={24} /></div>
        <div>
          <div className="text-xs text-slate-400 font-bold uppercase">Meta Atingida</div>
          <div className="text-white font-bold">Comunicação Verbal</div>
        </div>
      </motion.div>
    </div>
  );
};

export default MarketingSection;

