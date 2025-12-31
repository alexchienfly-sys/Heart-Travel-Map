
import { GoogleGenAI, Type } from "@google/genai";
import { TravelSpot, ArchetypeId } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getTravelRecommendations = async (archetypeId: ArchetypeId): Promise<TravelSpot[]> => {
  const prompt = `根據旅人特徵 "${archetypeId}"，推薦 4 個台灣的私房秘境景點（必須是真實存在但較少人知的地點）。
  請完全使用繁體中文。
  返回一個 JSON 數組，每個對象包含：
  - 'name': 景點名稱
  - 'location': 縣市與具體地區
  - 'description': 約 60 字內、富有詩意且感性的景點描述
  - 'highlights': 包含 3 個「必遊亮點」的字串陣列（例如：秘境溫泉、千年神木）
  - 'reminders': 包含 2 個「旅遊提醒」的字串陣列（例如：需事先申請入山、建議攜帶防蚊液）
  - 'prescription': 給旅人的一句話心靈處方箋
  - 'coordinates': 包含 'lat' 和 'lng' 字符串的對象（請提供接近真實的經緯度）`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            location: { type: Type.STRING },
            description: { type: Type.STRING },
            highlights: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            reminders: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            prescription: { type: Type.STRING },
            coordinates: {
              type: Type.OBJECT,
              properties: {
                lat: { type: Type.STRING },
                lng: { type: Type.STRING }
              }
            }
          },
          required: ["name", "location", "description", "highlights", "reminders", "prescription", "coordinates"]
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '[]');
    return data.map((item: any, index: number) => ({
      ...item,
      id: `${archetypeId}-${index}`
    }));
  } catch (e) {
    console.error("解析推薦失敗", e);
    return [];
  }
};

export const generateSpotImageVariant = async (spotName: string, location: string, variant: 'PRESENT' | 'NIGHT'): Promise<string> => {
  let stylePrompt = '';
  switch(variant) {
    case 'NIGHT':
      stylePrompt = 'astrophotography, mesmerizing Milky Way, stars, long exposure, magical purple and deep blue night sky, professional photography, breathtaking nocturnal landscape';
      break;
    default:
      stylePrompt = 'cinematic landscape photography, golden hour light, vibrant colors, 8k resolution, serene and peaceful atmosphere, professional travel magazine style';
  }

  const prompt = `A breathtaking vertical 9:16 aspect ratio landscape photo of "${spotName}" in ${location}, Taiwan. 
  Capture the essence and soul of this hidden gem. Style: ${stylePrompt}. No people, hyper-realistic, highly detailed.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio: "9:16" } }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  // Fallback
  return `https://picsum.photos/seed/${spotName}-${variant}/1080/1920`;
};
