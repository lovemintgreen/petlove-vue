-- PetLove 商品與規格資料表建表及測試種子資料
-- 請於 phpMyAdmin 選擇 petlove_vue 資料庫後執行

CREATE TABLE IF NOT EXISTS product (
  product_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(50) NOT NULL COMMENT '商品分類（乾飼料、罐頭、零食、其他用品）',
  product_name VARCHAR(150) NOT NULL COMMENT '商品名稱',
  product_img VARCHAR(255) NOT NULL COMMENT '商品圖片檔名（對應 client/public/img/）',
  product_stock INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '庫存數量',
  introduction TEXT COMMENT '商品介紹',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_product_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_spec (
  spec_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  specifications VARCHAR(100) NOT NULL COMMENT '規格（例如 1.5kg、80g 單罐）',
  taste VARCHAR(100) NOT NULL DEFAULT '' COMMENT '口味或款式',
  price INT UNSIGNED NOT NULL COMMENT '單價（TWD）',
  INDEX idx_spec_product_id (product_id),
  CONSTRAINT fk_product_spec_product
    FOREIGN KEY (product_id) REFERENCES product(product_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 測試種子資料（使用 INSERT IGNORE 避免重複執行時產生重複資料）
INSERT IGNORE INTO product (product_id, category, product_name, product_img, product_stock, introduction) VALUES
  (1, '乾飼料', '貓用｜無穀低敏田園雞肉成貓糧', 'catfeed1.png', 50, '嚴選新鮮去骨雞肉與天然蔬果，無穀低敏配方呵護腸胃，添加 Omega-3 與牛磺酸，維持亮麗毛髮與心血管健康。'),
  (2, '乾飼料', '貓用｜室內化毛益生菌全齡貓糧', 'catfeed2.png', 40, '專為室內貓設計的高纖化毛配方，搭配活菌益生元幫助消化吸收，減少排便異味並維持理想體態。'),
  (3, '乾飼料', '犬用｜小型犬關節保健低敏飼料', 'dogfeed1.png', 35, '小顆粒設計好咀嚼，富含葡萄糖胺與軟骨素保護毛孩關節，適合各年齡層小型成犬日常營養補給。'),
  (4, '乾飼料', '犬用｜高蛋白活力成犬無穀糧', 'dogfeed2.png', 45, '高含肉量與優質動物性蛋白，提供散步奔跑所需的滿滿能量，零人工色素與防腐劑。'),
  (5, '罐頭', '貓用｜1種肉低敏無膠主食罐', 'catcan1.png', 120, '單一肉源、零爭議膠類與穀物，98% 高含肉量補水又安心，挑嘴貓也能大口完食。'),
  (6, '罐頭', '貓用｜鮮湯慢燉營養副食罐', 'catcan2.png', 100, '滿滿原塊肉絲搭配鮮甜高湯，增加毛孩每日飲水量，可單獨獎勵或拌入乾糧提升適口性。'),
  (7, '罐頭', '犬貓共用｜橙柚鴨胸鮮食餐盒', '橙柚鴨胸886X554.png', 60, '低溫舒肥烹調鎖住原汁肉香，搭配微酸果香與天然蔬菜，開蓋即食的五星級鮮食享受。'),
  (8, '零食', '貓用｜原肉冷凍乾燥鮮雞丁', 'catsnack1.jpg', 80, '100% 純雞胸肉冷凍乾燥製作，完整保留鮮肉營養與香氣，可直接餵食、剝碎拌飯或泡水還原。'),
  (9, '零食', '犬用｜天然潔牙耐咬肉乾條', 'dogsnack2.jpg', 75, '低溫烘烤保留嚼勁，幫助清潔齒垢與紓壓解悶，外出散步與訓練獎勵必備好物。'),
  (10, '其他用品', '貓用｜羽毛鈴鐺互動逗貓棒', 'cattoy1.jpg', 90, '柔韌彈性握桿搭配天然羽毛與清脆鈴鐺，激發貓咪狩獵天性，增進每日互動陪伴時光。'),
  (11, '其他用品', '犬用｜耐咬發聲棉繩拉扯玩具', 'dogtoy1.jpg', 65, '高密度編織棉繩耐咬不易脫線，協助潔牙並滿足毛孩啃咬與拔河互動需求。'),
  (12, '其他用品', '寵樂嚴選｜雲朵包覆四季寵物窩', 'pethouse1.jpg', 25, '親膚透氣短絨布搭配高回彈棉芯，內墊可拆洗設計，給貓咪與中小型犬最安心的睡眠小窩。');

INSERT IGNORE INTO product_spec (spec_id, product_id, specifications, taste, price) VALUES
  (1, 1, '1.5kg', '田園雞肉', 680),
  (2, 1, '3kg', '田園雞肉', 1220),
  (3, 1, '6kg', '深海鮭魚', 2180),
  (4, 2, '1.5kg', '嫩雞鮮魚', 720),
  (5, 2, '4kg', '火雞蔓越莓', 1580),
  (6, 3, '2kg', '澳洲羊肉', 790),
  (7, 3, '5kg', '鮮嫩雞肉', 1690),
  (8, 4, '2kg', '野放牛肉', 850),
  (9, 4, '6kg', '極地鮭魚', 2250),
  (10, 5, '80g 單罐', '田園雞肉', 75),
  (11, 5, '80g × 6 罐組', '鮮嫩鴨肉', 420),
  (12, 5, '80g × 12 罐箱', '野生鮪魚', 780),
  (13, 6, '80g 單罐', '柴魚干貝', 55),
  (14, 6, '80g × 6 罐組', '嫩雞南瓜', 310),
  (15, 7, '150g 單盒', '橙柚鴨胸', 140),
  (16, 7, '150g × 4 盒組', '橙柚鴨胸', 520),
  (17, 8, '50g', '原味雞胸', 220),
  (18, 8, '120g', '鮭魚丁', 460),
  (19, 9, '100g', '煙燻牛肉', 190),
  (20, 9, '250g', '香烤雞肉', 420),
  (21, 10, '單支裝', '經典原色', 150),
  (22, 10, '替換頭豪華組', '經典原色', 290),
  (23, 11, 'M 號', '陽光黃', 240),
  (24, 11, 'L 號', '珊瑚橘', 320),
  (25, 12, 'M（5kg 以下）', '燕麥米', 890),
  (26, 12, 'L（12kg 以下）', '暖橘灰', 1190);
