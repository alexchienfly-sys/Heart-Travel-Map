
import React, { useState } from 'react';
import Quiz from './components/Quiz';
import Dashboard from './components/Dashboard';
import { ArchetypeId } from './types';
import { ARCHETYPES } from './constants';

const App: React.FC = () => {
  const [stage, setStage] = useState<'INTRO' | 'QUIZ' | 'RESULT'>('INTRO');
  const [resultId, setResultId] = useState<ArchetypeId | null>(null);

  const startQuiz = () => setStage('QUIZ');
  const handleQuizComplete = (id: ArchetypeId) => {
    setResultId(id);
    setStage('RESULT');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const reset = () => {
    setStage('INTRO');
    setResultId(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 transition-colors duration-1000 overflow-x-hidden">
      {/* 沉浸式導覽 */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6 md:p-10 flex justify-between items-center pointer-events-none">
        <div className="bg-white/90 backdrop-blur-3xl px-8 py-4 rounded-full shadow-2xl border border-white/40 pointer-events-auto flex items-center gap-4 transition-transform hover:scale-105">
          <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-black tracking-tighter shadow-lg">靈魂</div>
          <span className="text-2xl font-black tracking-tighter">心旅地圖</span>
        </div>
        <div className="hidden md:flex gap-4 pointer-events-auto">
          <div className="bg-stone-900 text-white px-10 py-4 rounded-full shadow-2xl text-[10px] font-black uppercase tracking-[0.6em] border border-white/10">
            台灣秘境指引
          </div>
        </div>
      </nav>

      {stage === 'INTRO' && (
        <div className="min-h-screen flex flex-col items-center justify-center relative px-8 overflow-hidden ambient-gradient">
          <div className="absolute inset-0 z-[-1] opacity-50">
             <img 
               src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2670&auto=format&fit=crop" 
               className="w-full h-full object-cover scale-110 animate-[pulse_20s_ease-in-out_infinite]"
               alt="大自然"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-900/60 to-stone-900" />
          </div>
          
          <div className="max-w-7xl text-center text-white fade-in">
            <span className="inline-block mb-10 px-10 py-3 rounded-full border border-white/20 backdrop-blur-2xl text-[10px] font-black tracking-[1em] uppercase text-stone-300">
              此刻，你的心想去哪裡？
            </span>
            <h1 className="text-[10vw] md:text-[13rem] font-bold mb-16 serif leading-[0.7] tracking-tighter">
              啟程，<br/><span className="italic opacity-60 bg-clip-text text-transparent bg-gradient-to-b from-white to-stone-600">航向靈魂之地</span>
            </h1>
            <p className="text-xl md:text-3xl text-white/40 font-light leading-relaxed mb-24 max-w-4xl mx-auto font-serif italic">
              台灣的秘境，是大地為疲憊者準備的處方箋。<br/>讓【心靈航標】為您指引，發掘隱藏在島嶼角落的平靜。
            </p>
            
            <button 
              onClick={startQuiz}
              className="group relative px-28 py-10 bg-white text-stone-900 rounded-full font-black text-4xl overflow-hidden transition-all hover:scale-110 active:scale-95 shadow-[0_50px_100px_rgba(255,255,255,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-8">
                啟航心靈測驗
                <svg className="w-12 h-12 transform group-hover:translate-x-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
              <div className="absolute inset-0 bg-stone-100 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </button>
          </div>
        </div>
      )}

      {stage === 'QUIZ' && (
        <div className="min-h-screen pt-48 pb-24 px-8 bg-stone-50 flex items-center justify-center relative">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-stone-200 rounded-full blur-[120px] opacity-30 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-stone-300 rounded-full blur-[100px] opacity-20" />
          
          <Quiz onComplete={handleQuizComplete} />
        </div>
      )}

      {stage === 'RESULT' && resultId && (
        <Dashboard archetype={ARCHETYPES[resultId]} onReset={reset} />
      )}

      <footer className="py-24 border-t border-stone-200 text-center px-8 text-stone-400 bg-white">
        <div className="flex justify-center gap-16 mb-12 opacity-20 grayscale hover:opacity-100 transition-all duration-1000">
           <div className="w-12 h-12 rounded-full bg-stone-900" />
           <div className="w-12 h-12 rounded-full bg-stone-900" />
           <div className="w-12 h-12 rounded-full bg-stone-900" />
        </div>
        <p className="text-[12px] mb-4 font-black tracking-[0.6em] uppercase">© 2026 心旅地圖 | 沉浸式秘境探索平台</p>
        <p className="text-[10px] tracking-[1.2em] opacity-30 font-black">由 GEMINI 2.5 FLASH IMAGE 技術驅動</p>
      </footer>
    </div>
  );
};

export default App;
