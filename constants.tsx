
import { Archetype, Question, ArchetypeId } from './types';

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  HEALER: {
    id: 'HEALER',
    name: '林間療癒者',
    subtitle: '在靜謐中找回內心的頻率',
    description: '你渴望平靜與壓力的釋放。深山林道、迷霧森林與慢活的村落是你靈魂的避風港。',
    keywords: ['平靜', '苔蘚綠', '霧氣灰', '木質感'],
    colors: {
      primary: 'bg-[#4A5D4E]', 
      secondary: 'bg-[#9BA89B]',
      accent: 'border-[#4A5D4E]',
      bg: 'bg-[#F2F4F2]',
      text: 'text-[#2D362E]',
      gradient: 'from-[#4A5D4E] via-[#9BA89B] to-[#D6D1C4]'
    }
  },
  ADVENTURER: {
    id: 'ADVENTURER',
    name: '破浪冒險家',
    subtitle: '與大海與高山的極限對話',
    description: '你渴望自由，追求未知的挑戰。海岸秘境、險峻步道與那抹湛藍是你的動力源泉。',
    keywords: ['自由', '湛藍', '浪花白', '砂岩金'],
    colors: {
      primary: 'bg-[#1E3A5F]',
      secondary: 'bg-[#F8F9FA]',
      accent: 'border-[#1E3A5F]',
      bg: 'bg-[#F0F4F8]',
      text: 'text-[#0D1B2A]',
      gradient: 'from-[#1E3A5F] via-[#F8F9FA] to-[#C5A059]'
    }
  },
  SCAVENGER: {
    id: 'SCAVENGER',
    name: '時光拾荒者',
    subtitle: '在歷史碎片中拾取感性力量',
    description: '你渴望懷舊與深度的情感連結。古鎮老街、文化遺址與琥珀色的夕陽最能觸動你的心弦。',
    keywords: ['懷舊', '胭脂紅', '磚瓦灰', '琥珀色'],
    colors: {
      primary: 'bg-[#8E354A]',
      secondary: 'bg-[#7D7D7D]',
      accent: 'border-[#8E354A]',
      bg: 'bg-[#FAF7F2]',
      text: 'text-[#3E1F25]',
      gradient: 'from-[#8E354A] via-[#7D7D7D] to-[#D68D3E]'
    }
  }
};

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "獨自一人時，你更希望身處哪種氛圍？",
    options: [
      { text: "被群山環繞，空氣中帶著濕潤的木頭香", archetype: "HEALER" },
      { text: "站在懸崖邊緣，聽著怒吼的浪花拍打岩石", archetype: "ADVENTURER" },
      { text: "在夕陽餘暉下，踩在有些鬆動的古老紅磚上", archetype: "SCAVENGER" }
    ]
  },
  {
    id: 2,
    text: "如果能擁有一種超能力，你希望是？",
    options: [
      { text: "能聽懂植物的語言，與森林共鳴", archetype: "HEALER" },
      { text: "能瞬間移動到最高的高山或最深的海洋", archetype: "ADVENTURER" },
      { text: "能看見物品過去承載的所有記憶碎片", archetype: "SCAVENGER" }
    ]
  },
  {
    id: 3,
    text: "你最嚮往的週末下午是？",
    options: [
      { text: "在山中小屋靜靜喝茶看書", archetype: "HEALER" },
      { text: "徒步探索一條未曾在地圖上標示的小徑", archetype: "ADVENTURER" },
      { text: "在老舊相館裡翻閱泛黃的舊照片", archetype: "SCAVENGER" }
    ]
  },
  {
    id: 4,
    text: "選一種代表你心境的質感？",
    options: [
      { text: "柔軟微涼的苔蘚", archetype: "HEALER" },
      { text: "堅硬粗糙的岩石", archetype: "ADVENTURER" },
      { text: "溫潤斑駁的木紋", archetype: "SCAVENGER" }
    ]
  },
  {
    id: 5,
    text: "旅行對你而言，最深刻的意義是？",
    options: [
      { text: "修補疲憊，找回內心的平靜", archetype: "HEALER" },
      { text: "突破極限，證明自己的自由", archetype: "ADVENTURER" },
      { text: "穿越時空，與未曾參與的歷史對話", archetype: "SCAVENGER" }
    ]
  }
];
