
import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { ArchetypeId } from '../types';

interface QuizProps {
  onComplete: (id: ArchetypeId) => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<ArchetypeId, number>>({
    HEALER: 0,
    ADVENTURER: 0,
    SCAVENGER: 0
  });
  const [isExiting, setIsExiting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelect = (archetype: ArchetypeId) => {
    if (isExiting) return;
    
    setIsExiting(true);
    const nextScores = { ...scores, [archetype]: scores[archetype] + 1 };
    setScores(nextScores);

    setTimeout(() => {
      if (currentStep < QUIZ_QUESTIONS.length - 1) {
        setCurrentStep(currentStep + 1);
        setIsExiting(false);
      } else {
        const winner = (Object.keys(nextScores) as ArchetypeId[]).reduce((a, b) => 
          nextScores[a] > nextScores[b] ? a : b
        );
        onComplete(winner);
      }
    }, 500);
  };

  const currentQuestion = QUIZ_QUESTIONS[currentStep];

  return (
    <div className="w-full max-w-4xl perspective-1000">
      <div className={`relative transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${isExiting ? 'scale-95 opacity-0 blur-sm' : 'scale-100 opacity-100'}`}>
        
        {/* 測驗卡片容器 */}
        <div className="bg-white/80 backdrop-blur-3xl rounded-[3.5rem] p-12 md:p-20 shadow-[0_60px_100px_rgba(0,0,0,0.1)] border border-white/50 relative overflow-hidden">
          
          {/* 進度裝飾 */}
          <div className="absolute top-0 left-0 w-full p-10 flex justify-between items-center">
            <div className="flex gap-3">
              {QUIZ_QUESTIONS.map((_, i) => (
                <div key={i} className={`h-1 transition-all duration-500 rounded-full ${i === currentStep ? 'w-12 bg-stone-900' : 'w-4 bg-stone-200'}`} />
              ))}
            </div>
            <span className="text-[10px] font-black tracking-[0.4em] text-stone-400 uppercase">第 {currentStep + 1} 步，共 {QUIZ_QUESTIONS.length} 步</span>
          </div>

          {/* 問題文字 */}
          <div className="mt-12 text-center mb-16">
            <span className="text-stone-400 text-xs font-medium tracking-widest mb-4 block uppercase">內在心靈導航</span>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-800 serif leading-[1.2] max-w-2xl mx-auto">
              {currentQuestion.text}
            </h2>
          </div>

          {/* 選項網格 */}
          <div className="grid grid-cols-1 gap-6 relative z-10">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(option.archetype)}
                className="group relative w-full text-left p-8 rounded-[2rem] bg-white/50 border border-stone-100 hover:border-stone-800 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
              >
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-400 group-hover:bg-stone-900 group-hover:text-white group-hover:border-transparent transition-all">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-xl text-stone-600 font-light group-hover:text-stone-900 transition-colors">
                    {option.text}
                  </span>
                </div>
                
                {/* 裝飾圖標 */}
                <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-0 group-hover:opacity-10 group-hover:translate-x-4 transition-all duration-700">
                  <svg className="w-20 h-20 text-stone-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
                  </svg>
                </div>
                
                <div className="absolute bottom-0 left-0 h-1 bg-stone-900 w-0 group-hover:w-full transition-all duration-700" />
              </button>
            ))}
          </div>
        </div>

        {/* 底部文字 */}
        <div className="mt-12 text-center opacity-40">
          <p className="text-[11px] font-black uppercase tracking-[0.8em] text-stone-600">
            傾聽內心的聲音，尋找靈魂的停靠點
          </p>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
