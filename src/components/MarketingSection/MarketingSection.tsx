import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import fundoImg from '@/assets/images/fundo.png';
import iconImg from '@/assets/images/icon.png';
import icon2Img from '@/assets/images/icon2.png';
import illustration1 from '/home/stella_karolina/.gemini/antigravity/brain/d001437f-33a3-4351-a72a-1cdc550ca0d7/ecosystem_connection_illustration_1777143672957.png';
import illustration2 from '/home/stella_karolina/.gemini/antigravity/brain/d001437f-33a3-4351-a72a-1cdc550ca0d7/app_development_illustration_1777143333893.png';

const slides = [
  {
    id: 'solution_1',
    visual: 'ecosystem',
    accent: "#96d268",
    glow: "rgba(150, 210, 104, 0.25)"
  },
  {
    id: 'solution_2',
    visual: 'insights',
    accent: "#455a85",
    glow: "rgba(69, 90, 133, 0.35)"
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
    }, 12000);
    return () => clearInterval(timer);
  }, [autoplay]);

  const handleManualNav = (index: number) => {
    setCurrent(index);
    setAutoplay(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8 sm:px-12 font-sans overflow-hidden text-white bg-cover bg-center transition-all duration-1000" style={{ backgroundImage: `url(${fundoImg})` }}>
      
      {/* Dynamic Ambient Light */}
      <motion.div
        animate={{ 
          backgroundColor: active.glow,
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] blur-[180px] rounded-full pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center h-full justify-center py-12">
        <div className="w-full h-[620px] relative flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {active.visual === 'ecosystem' && <VisualCard 
                  tagline="GESTÃO MULTIDISCIPLINAR"
                  title={<>Transforme o Desenvolvimento <br /> Atípico com Dados, não <br /> Apenas Intuição.</>}
                  illustration={illustration1}
                  icon={icon2Img}
                />}
                {active.visual === 'insights' && <VisualCard 
                  tagline="INTELIGÊNCIA CLÍNICA"
                  title={<>Dados que Geram <br /> Insights automáticos.</>}
                  illustration={illustration2}
                  icon={iconImg}
                />}
              </motion.div>
            </AnimatePresence>
        </div>

        {/* Cinematic Pagination */}
        <div className="absolute bottom-12 flex justify-center gap-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => handleManualNav(i)}
              className="group relative h-3 bg-transparent flex items-center"
            >
              <div className={`h-1.5 rounded-full transition-all duration-700 ${current === i ? 'w-16 bg-white' : 'w-4 bg-white/20 group-hover:bg-white/40'}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- PREMIUM VISUAL CARD ---

const VisualCard = ({ tagline, title, illustration, icon }: any) => (
  <div className="relative w-full max-w-[620px] h-[600px] flex items-center justify-center select-none group">
    
    {/* Outer Glow / Halo Effect */}
    <div className="absolute inset-0 bg-white/5 blur-3xl rounded-[4rem] group-hover:bg-white/10 transition-colors duration-700" />
    
    {/* Main Glass Vessel */}
    <div className="relative w-full h-full bg-white/[0.08] backdrop-blur-[40px] rounded-[4rem] border border-white/20 overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.4)] flex flex-col items-center pt-16">
      
      {/* Inner Rim Light */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      
      {/* Premium Header Container */}
      <div className="relative z-20 px-12 w-full text-center mb-10">
        <motion.span 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] font-black tracking-[0.4em] text-white/40 uppercase mb-4 block"
        >
          {tagline}
        </motion.span>
        <h3 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
          {title}
        </h3>
      </div>

      {/* Elegant Illustration Container */}
      <div className="relative z-10 w-full flex-1 flex items-end justify-center px-6 pb-2">
        {/* Soft Shadow Base for Illustration */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-20 bg-black/10 blur-[50px] rounded-full" />
        
        <motion.img 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          src={illustration} 
          alt="Illustration" 
          className="max-w-[105%] w-[105%] h-auto object-contain transform translate-y-4 mix-blend-lighten contrast-125 brightness-110 drop-shadow-2xl" 
        />
      </div>

      {/* 3D Action Floating Icon */}
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-32 left-10 size-14 bg-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden p-3 z-40 transition-transform active:scale-95"
      >
        <img src={icon} alt="Action Icon" className="w-full h-full object-contain" />
        {/* Shine highlight */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
      </motion.div>
    </div>
  </div>
);

export default MarketingSection;
