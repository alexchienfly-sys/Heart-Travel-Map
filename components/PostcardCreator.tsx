
import React, { useState, useRef } from 'react';
import { TravelSpot, Archetype } from '../types';

interface PostcardCreatorProps {
  spot: TravelSpot;
  archetype: Archetype;
  onClose: () => void;
}

const PostcardCreator: React.FC<PostcardCreatorProps> = ({ spot, archetype, onClose }) => {
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const postcardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!postcardRef.current) return;
    setIsExporting(true);
    
    try {
      const canvas = await (window as any).html2canvas(postcardRef.current, {
        useCORS: true,
        scale: 3, 
        backgroundColor: '#000000'
      });
      
      const link = document.createElement('a');
      link.download = `心旅地圖_明信片_${spot.name}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch (error) {
      console.error('匯出失敗:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 md:p-8 overflow-y-auto text-left">
      <div className="flex flex-col md:flex-row gap-12 max-w-6xl w-full items-center">
        
        {/* 明信片預覽 (9:16) */}
        <div className="relative w-full max-w-[360px] aspect-[9/16] shadow-[0_50px_100px_rgba(0,0,0,0.6)] fade-in shrink-0">
          <div 
            ref={postcardRef}
            className="w-full h-full bg-white relative overflow-hidden flex flex-col"
          >
            <img 
              src={spot.imageUrl} 
              alt={spot.name} 
              crossOrigin="anonymous"
              className="absolute inset-0 w-full h-full object-cover" 
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            <div className="relative z-10 p-6 flex justify-between items-start">
              <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[8px] font-black text-white uppercase tracking-widest">
                心旅地圖 · {spot.location}
              </div>
              <div className="w-12 h-12 border-2 border-white/40 rounded-full flex flex-col items-center justify-center text-white/40 rotate-12">
                <span className="text-[6px] font-black leading-none">TAIWAN</span>
                <span className="text-[10px] font-black">TW</span>
              </div>
            </div>

            <div className="relative z-10 mt-auto p-8 text-white">
              <div className="mb-8 border-l-2 border-white/30 pl-4">
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-2">寄給: {recipient || '未知的旅伴'}</p>
                <p className="text-sm font-serif italic leading-relaxed opacity-90 min-h-[5rem]">
                  {message || '在這裡，我聽見了島嶼的心跳。這份靜謐與震撼，希望能與你分享。'}
                </p>
                <p className="text-[10px] text-white/50 font-bold text-right mt-3 uppercase tracking-widest">— {sender || '一位旅人'}</p>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-3xl font-bold serif mb-1">{spot.name}</h3>
                  <p className="text-[8px] font-mono text-white/40">
                    深度導覽 / {spot.location}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-[9px] font-mono text-white tracking-tighter">
                    {spot.coordinates.lat} N
                  </p>
                  <p className="text-[9px] font-mono text-white tracking-tighter">
                    {spot.coordinates.lng} E
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 編輯面板 */}
        <div className="flex-1 text-white max-w-md w-full">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold serif">編輯您的心靈明信片</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="space-y-8">
            <div className="group">
              <label className="block text-[10px] font-bold uppercase text-white/40 mb-3 tracking-widest">收件人名稱</label>
              <input 
                type="text" 
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="你想對誰分享這份感動？"
                className="w-full bg-white/5 border-b border-white/20 py-3 px-1 focus:border-white outline-none transition-all text-lg placeholder:text-white/20"
              />
            </div>
            <div className="group">
              <label className="block text-[10px] font-bold uppercase text-white/40 mb-3 tracking-widest">心之所言 (留言內容)</label>
              <textarea 
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="寫下你在這片秘境感受到的頻率..."
                className="w-full bg-white/5 border-b border-white/20 py-3 px-1 focus:border-white outline-none transition-all resize-none text-white/80 font-serif leading-relaxed"
              />
            </div>
            <div className="group">
              <label className="block text-[10px] font-bold uppercase text-white/40 mb-3 tracking-widest">署名</label>
              <input 
                type="text" 
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="留下你的名字"
                className="w-full bg-white/5 border-b border-white/20 py-3 px-1 focus:border-white outline-none transition-all placeholder:text-white/20"
              />
            </div>
            
            <button 
              onClick={handleDownload}
              disabled={isExporting}
              className={`w-full py-6 rounded-2xl text-stone-900 font-bold transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 ${archetype.id === 'HEALER' ? 'bg-[#9BA89B]' : archetype.id === 'ADVENTURER' ? 'bg-[#C5A059]' : 'bg-[#D68D3E]'}`}
            >
              {isExporting ? <div className="w-5 h-5 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" /> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
              下載高解析度明信片
            </button>
            
            <p className="text-[10px] text-white/30 text-center uppercase tracking-[0.2em]">
              比例完美契合 Instagram Story / 手機桌布
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostcardCreator;
