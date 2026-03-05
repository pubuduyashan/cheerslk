export const DEFAULT_CATEGORIES = [
  { slug: 'spirits', name_en: 'Spirits', name_si: 'ස්පිරිට්', name_ta: 'ஸ்பிரிட்ஸ்', requires_age: true, sort: 1 },
  { slug: 'beer', name_en: 'Beer', name_si: 'බියර්', name_ta: 'பீர்', requires_age: true, sort: 2 },
  { slug: 'wine', name_en: 'Wine', name_si: 'වයින්', name_ta: 'ஒயின்', requires_age: true, sort: 3 },
  { slug: 'cigarettes', name_en: 'Cigarettes', name_si: 'සිගරට්', name_ta: 'சிகரெட்', requires_age: true, sort: 4 },
  { slug: 'mixers', name_en: 'Mixers & Soft Drinks', name_si: 'මික්සර් සහ බීම', name_ta: 'மிக்சர் & குளிர்பானங்கள்', requires_age: false, sort: 5 },
  { slug: 'snacks', name_en: 'Snacks & Food', name_si: 'කෑම සහ ස්නැක්ස්', name_ta: 'சிற்றுண்டி & உணவு', requires_age: false, sort: 6 },
  { slug: 'essentials', name_en: 'Ice & Essentials', name_si: 'අයිස් සහ අත්‍යවශ්‍ය', name_ta: 'ஐஸ் & அத்தியாவசியம்', requires_age: false, sort: 7 },
] as const;
