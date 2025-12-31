
import React, { useEffect, useState } from 'react';
import { Archetype, TravelSpot } from '../types';
import { getTravelRecommendations, generateSpotImageVariant } from '../services/geminiService';
import PostcardCreator from './PostcardCreator';

interface DashboardProps {
  archetype: Archetype;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ archetype, onReset }) => {
  const [spots, setSpots] = useState<TravelSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});
  const [selectedSpot, setSelectedSpot] = useState<TravelSpot | null>(null);
  const [timeValues, setTimeValues] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchSpots = async () => {
      setLoading(true);
      const recommended = await getTravelRecommendations(archetype.id);
      setSpots(recommended);
      setLoading(false);

      // 初始化圖片加載狀態
      const initialLoading: Record<string, boolean> = {};
      recommended.forEach(s => initialLoading[s.id] = true);
      setImageLoading(initialLoading);

      // 異步獲取日間與星空圖
      for (const spot of recommended) {
        setTimeValues(prev => ({ ...prev, [spot.id]: 1 }));
        
        try {
          const [pImg, nImg] = await Promise.all([
            generateSpotImageVariant(spot.name, spot.location, 'PRESENT'),
            generateSpotImageVariant(spot.name, spot.location, 'NIGHT')
          ]);
          
          setSpots(prev => prev.map(s => s.id === spot.id ? { 
            ...s, 
            imageUrl: pImg, 
            nightImageUrl: nImg 
          } : s));
        } catch (err) {
          console.error("生成圖片失敗:", spot.name);
        } finally {
          setImageLoading(prev => ({ ...prev, [spot.id]: false }));
        }
      }
    };
    fetchSpots();
  }, [archetype.id]);

  const getActiveImage = (spot: TravelSpot) => {
    const val = timeValues[spot.id] || 1;
    if (val === 2) return spot.nightImageUrl || spot.imageUrl;
    return spot.imageUrl;
  };

  return (
    <div className={`min-h-screen pb-40 transition-all duration-1000 ${archetype.colors.bg} ${archetype.colors.text}`}>
      {/* 頁首橫幅 */}
      <header className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${archetype.colors.gradient} opacity-20`} />
        
        <div className="relative z-10 text-center px-8 max-w-6xl fade-in">
          <div className="flex items-center justify-center mb-10">
             <span className="px-10 py-3 bg-stone-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.6em] shadow-2xl">
               旅人屬性：{archetype.name}
             </span>
          </div>
          <h1 className="text-[8vw] md:text-[10rem] font-bold mb-10 serif leading-[0.9] tracking-tighter drop-shadow-xl">{archetype.subtitle}</h1>
          <p className="text-2xl md:text-3xl opacity-60 leading-relaxed mx-auto max-w-4xl font-light italic">{archetype.description}</p>
        </div>

        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 14l-7 7-7-7" /></svg>
        </div>
      </header>

      {/* 景點主體 */}
      <main className="max-w-[1500px] mx-auto px-8 -mt-32 relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 px-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400 mb-4 block">客製化的心靈處方</span>
            <h2 className="text-5xl md:text-6xl font-bold serif tracking-tight">專屬於您的台灣秘境</h2>
          </div>
          <button onClick={onReset} className="px-10 py-5 bg-white/40 backdrop-blur-3xl border border-stone-200 rounded-full text-[10px] font-black uppercase tracking-[0.5em] hover:bg-stone-900 hover:text-white transition-all shadow-xl active:scale-95">
             重新探索
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            {[1, 2, 3, 4].map(i => <div key={i} className="aspect-[4/5] rounded-[4rem] bg-stone-200 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 lg:gap-32">
            {spots.map((spot) => (
              <div key={spot.id} className="group flex flex-col h-full bg-white/60 backdrop-blur-3xl rounded-[4rem] overflow-hidden border border-white shadow-[0_40px_100px_rgba(0,0,0,0.06)] hover:shadow-[0_60px_120px_rgba(0,0,0,0.1)] transition-all duration-1000 hover:-translate-y-4">
                
                {/* 圖片切換區 */}
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                  {imageLoading[spot.id] ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900">
                       <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
                       <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">正在生成秘境影像...</span>
                    </div>
                  ) : (
                    <img 
                      src={getActiveImage(spot)} 
                      alt={spot.name} 
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover transition-all duration-[1.5s] transform group-hover:scale-105" 
                    />
                  )}
                  
                  {/* 模式切換標籤 */}
                  <div className="absolute top-10 left-10 flex flex-col gap-3">
                    <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all backdrop-blur-md ${timeValues[spot.id] === 1 ? 'bg-white text-stone-900 border-white' : 'bg-black/20 text-white/40 border-white/5'}`}>
                      日間視角
                    </div>
                    <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all backdrop-blur-md ${timeValues[spot.id] === 2 ? 'bg-indigo-950 text-white border-indigo-400/50 shadow-2xl' : 'bg-black/20 text-white/40 border-white/5'}`}>
                      星空模式
                    </div>
                  </div>

                  {/* 切換滑桿 */}
                  <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                    <input 
                      type="range" 
                      min="1" max="2" step="1"
                      value={timeValues[spot.id] || 1}
                      onChange={(e) => setTimeValues(prev => ({ ...prev, [spot.id]: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer time-slider-thumb transition-all"
                    />
                    <div className="flex justify-between mt-4 text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">
                      <span>晨曦景致</span>
                      <span>銀河星辰</span>
                    </div>
                  </div>
                </div>
                
                {/* 內容面板 */}
                <div className="p-16 flex-1 flex flex-col">
                  <div className="mb-10">
                    <h3 className="text-4xl font-bold serif mb-3">{spot.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-black tracking-widest text-stone-400 uppercase">{spot.location}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-200" />
                      <span className="text-[10px] font-mono text-stone-400 tracking-tighter">{spot.coordinates.lat}N, {spot.coordinates.lng}E</span>
                    </div>
                  </div>
                  
                  <div className="bg-stone-50/50 p-8 rounded-3xl mb-12 border border-stone-100 italic font-serif leading-relaxed text-stone-600 text-lg">
                    「 {spot.description} 」
                  </div>

                  {/* 亮點與提醒區域 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-200 pb-2">必遊亮點</h4>
                      <ul className="space-y-3">
                        {spot.highlights?.map((h, i) => (
                          <li key={i} className="text-sm flex items-center gap-3 text-stone-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-200 pb-2">旅遊提醒</h4>
                      <ul className="space-y-3">
                        {spot.reminders?.map((r, i) => (
                          <li key={i} className="text-sm flex items-start gap-3 text-stone-500 italic">
                            <span className="mt-1 text-xs">#</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 處方箋 */}
                  <div className="mb-12 pl-6 border-l-2 border-stone-800">
                    <p className="text-xs font-black text-stone-300 uppercase tracking-widest mb-2">心靈處方箋</p>
                    <p className="text-stone-800 font-medium leading-relaxed">{spot.prescription}</p>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedSpot(spot)}
                    className="mt-auto group/btn w-full py-7 rounded-[2.5rem] bg-stone-900 text-white font-black text-lg transition-all shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-5"
                  >
                    <span>製作心靈明信片</span>
                    <svg className="w-6 h-6 group-hover/btn:translate-x-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedSpot && (
        <PostcardCreator spot={selectedSpot} archetype={archetype} onClose={() => setSelectedSpot(null)} />
      )}
    </div>
  );
};

export default Dashboard;
