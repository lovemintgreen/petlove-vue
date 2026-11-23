import type { Product } from '@/types/shop'

// 後續串接後端 GET /api/products 時可直接替換此資料來源
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    category: '乾飼料',
    name: '貓用｜無穀低敏田園雞肉成貓糧',
    image: 'catfeed1.png',
    introduction:
      '嚴選新鮮去骨雞肉與天然蔬果，無穀低敏配方呵護腸胃，添加 Omega-3 與牛磺酸，維持亮麗毛髮與心血管健康。',
    specs: [
      { spec: '1.5kg', price: 680 },
      { spec: '3kg', price: 1220 },
      { spec: '6kg', price: 2180 },
    ],
    tastes: ['田園雞肉', '深海鮭魚'],
  },
  {
    id: 2,
    category: '乾飼料',
    name: '貓用｜室內化毛益生菌全齡貓糧',
    image: 'catfeed2.png',
    introduction:
      '專為室內貓設計的高纖化毛配方，搭配活菌益生元幫助消化吸收，減少排便異味並維持理想體態。',
    specs: [
      { spec: '1.5kg', price: 720 },
      { spec: '4kg', price: 1580 },
    ],
    tastes: ['嫩雞鮮魚', '火雞蔓越莓'],
  },
  {
    id: 3,
    category: '乾飼料',
    name: '犬用｜小型犬關節保健低敏飼料',
    image: 'dogfeed1.png',
    introduction:
      '小顆粒設計好咀嚼，富含葡萄糖胺與軟骨素保護毛孩關節，適合各年齡層小型成犬日常營養補給。',
    specs: [
      { spec: '2kg', price: 790 },
      { spec: '5kg', price: 1690 },
    ],
    tastes: ['澳洲羊肉', '鮮嫩雞肉'],
  },
  {
    id: 4,
    category: '乾飼料',
    name: '犬用｜高蛋白活力成犬無穀糧',
    image: 'dogfeed2.png',
    introduction:
      '高含肉量與優質動物性蛋白，提供散步奔跑所需的滿滿能量，零人工色素與防腐劑。',
    specs: [
      { spec: '2kg', price: 850 },
      { spec: '6kg', price: 2250 },
    ],
    tastes: ['野放牛肉', '極地鮭魚'],
  },
  {
    id: 5,
    category: '罐頭',
    name: '貓用｜1種肉低敏無膠主食罐',
    image: 'catcan1.png',
    introduction:
      '單一肉源、零爭議膠類與穀物，98% 高含肉量補水又安心，挑嘴貓也能大口完食。',
    specs: [
      { spec: '80g 單罐', price: 75 },
      { spec: '80g × 6 罐組', price: 420 },
      { spec: '80g × 12 罐箱', price: 780 },
    ],
    tastes: ['田園雞肉', '鮮嫩鴨肉', '野生鮪魚'],
  },
  {
    id: 6,
    category: '罐頭',
    name: '貓用｜鮮湯慢燉營養副食罐',
    image: 'catcan2.png',
    introduction:
      '滿滿原塊肉絲搭配鮮甜高湯，增加毛孩每日飲水量，可單獨獎勵或拌入乾糧提升適口性。',
    specs: [
      { spec: '80g 單罐', price: 55 },
      { spec: '80g × 6 罐組', price: 310 },
    ],
    tastes: ['柴魚干貝', '嫩雞南瓜'],
  },
  {
    id: 7,
    category: '罐頭',
    name: '犬貓共用｜橙柚鴨胸鮮食餐盒',
    image: '橙柚鴨胸886X554.png',
    introduction:
      '低溫舒肥烹調鎖住原汁肉香，搭配微酸果香與天然蔬菜，開蓋即食的五星級鮮食享受。',
    specs: [
      { spec: '150g 單盒', price: 140 },
      { spec: '150g × 4 盒組', price: 520 },
    ],
    tastes: ['橙柚鴨胸'],
  },
  {
    id: 8,
    category: '零食',
    name: '貓用｜原肉冷凍乾燥鮮雞丁',
    image: 'catsnack1.jpg',
    introduction:
      '100% 純雞胸肉冷凍乾燥製作，完整保留鮮肉營養與香氣，可直接餵食、剝碎拌飯或泡水還原。',
    specs: [
      { spec: '50g', price: 220 },
      { spec: '120g', price: 460 },
    ],
    tastes: ['原味雞胸', '鮭魚丁'],
  },
  {
    id: 9,
    category: '零食',
    name: '犬用｜天然潔牙耐咬肉乾條',
    image: 'dogsnack2.jpg',
    introduction:
      '低溫烘烤保留嚼勁，幫助清潔齒垢與紓壓解悶，外出散步與訓練獎勵必備好物。',
    specs: [
      { spec: '100g', price: 190 },
      { spec: '250g', price: 420 },
    ],
    tastes: ['煙燻牛肉', '香烤雞肉'],
  },
  {
    id: 10,
    category: '其他用品',
    name: '貓用｜羽毛鈴鐺互動逗貓棒',
    image: 'cattoy1.jpg',
    introduction:
      '柔韌彈性握桿搭配天然羽毛與清脆鈴鐺，激發貓咪狩獵天性，增進每日互動陪伴時光。',
    specs: [
      { spec: '單支裝', price: 150 },
      { spec: '替換頭豪華組', price: 290 },
    ],
    tastes: ['經典原色'],
  },
  {
    id: 11,
    category: '其他用品',
    name: '犬用｜耐咬發聲棉繩拉扯玩具',
    image: 'dogtoy1.jpg',
    introduction:
      '高密度編織棉繩耐咬不易脫線，協助潔牙並滿足毛孩啃咬與拔河互動需求。',
    specs: [
      { spec: 'M 號', price: 240 },
      { spec: 'L 號', price: 320 },
    ],
    tastes: ['陽光黃', '珊瑚橘'],
  },
  {
    id: 12,
    category: '其他用品',
    name: '寵樂嚴選｜雲朵包覆四季寵物窩',
    image: 'pethouse1.jpg',
    introduction:
      '親膚透氣短絨布搭配高回彈棉芯，內墊可拆洗設計，給貓咪與中小型犬最安心的睡眠小窩。',
    specs: [
      { spec: 'M（5kg 以下）', price: 890 },
      { spec: 'L（12kg 以下）', price: 1190 },
    ],
    tastes: ['燕麥米', '暖橘灰'],
  },
]

export const SHOP_CATEGORIES = Array.from(new Set(MOCK_PRODUCTS.map((item) => item.category)))

export function getProductPriceRange(product: Product): { min: number; max: number } {
  const prices = product.specs.map((item) => item.price)
  if (prices.length === 0) return { min: 0, max: 0 }
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}

export function findProductById(id: number): Product | undefined {
  return MOCK_PRODUCTS.find((item) => item.id === id)
}
