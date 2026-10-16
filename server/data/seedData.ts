import { Product, Category, Coupon, User } from '../../src/types';

export const initialCategories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    icon: 'Tv',
    description: 'High-end laptops, audio systems, smartwatches, and gadgets.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    productCount: 4
  },
  {
    id: 'mobiles',
    name: 'Mobiles and Accessories',
    slug: 'mobiles',
    icon: 'Smartphone',
    description: 'Latest smartphones, power banks, chargers, and cases.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=600&auto=format&fit=crop&q=80',
    productCount: 4
  },
  {
    id: 'fashion',
    name: 'Fashion and Clothing',
    slug: 'fashion',
    icon: 'Shirt',
    description: 'Trendsetting men & women apparel, sneakers, and accessories.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80',
    productCount: 4
  },
  {
    id: 'home-kitchen',
    name: 'Home and Kitchen',
    slug: 'home-kitchen',
    icon: 'Home',
    description: 'Modern cookware, espresso machines, and smart home appliances.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    productCount: 4
  },
  {
    id: 'grocery',
    name: 'Grocery and Daily Essentials',
    slug: 'grocery',
    icon: 'Apple',
    description: 'Farm-fresh groceries, organic dry fruits, coffees, and staples.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    productCount: 4
  },
  {
    id: 'beauty',
    name: 'Beauty and Personal Care',
    slug: 'beauty',
    icon: 'Sparkles',
    description: 'Dermatologist-tested skincare, grooming kits, and fragrances.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
    productCount: 4
  },
  {
    id: 'books-stationery',
    name: 'Books and Stationery',
    slug: 'books-stationery',
    icon: 'BookOpen',
    description: 'Best-selling literature, leather journals, and desk supplies.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    productCount: 4
  },
  {
    id: 'sports-fitness',
    name: 'Sports and Fitness',
    slug: 'sports-fitness',
    icon: 'Dumbbell',
    description: 'Gym equipment, yoga mats, resistance bands, and activewear.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    productCount: 4
  },
  {
    id: 'toys-games',
    name: 'Toys and Games',
    slug: 'toys-games',
    icon: 'Gamepad2',
    description: 'Next-gen gaming gear, controllers, STEM kits, and family games.',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    productCount: 4
  }
];

export const initialProducts: Product[] = [
  // 1. Electronics
  {
    id: 'prod-elec-1',
    name: 'AcousticPro ANC Wireless Headphones',
    slug: 'acousticpro-anc-wireless-headphones',
    description: 'Experience studio-grade acoustic depth with hybrid 40mm titanium drivers and 45-hour battery life. Ultra-soft protein leather ear cushions ensure ergonomic comfort for all-day listening.',
    price: 199.99,
    originalPrice: 279.99,
    discountPercentage: 29,
    rating: 4.8,
    reviewCount: 142,
    stock: 24,
    category: 'electronics',
    brand: 'SonicWave',
    sku: 'EL-SW-900',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true,
    isDeal: true,
    dealEndsAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    variants: [
      { id: 'color', name: 'Color', options: ['Matte Black', 'Silver Moon', 'Midnight Navy'] }
    ],
    specifications: [
      { name: 'Driver Size', value: '40mm Custom Titanium' },
      { name: 'Battery Life', value: 'Up to 45 Hours with ANC' },
      { name: 'Connectivity', value: 'Bluetooth 5.3 + 3.5mm Aux' },
      { name: 'Weight', value: '254g' }
    ],
    tags: ['headphones', 'wireless', 'anc', 'audio', 'featured'],
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'prod-elec-2',
    name: 'Zenith 15.6" Ultra-Slim OLED Laptop',
    slug: 'zenith-ultra-slim-oled-laptop',
    description: 'Engineered for power creators. Powered by an 8-core processor, 16GB DDR5 RAM, and a stunning 2.8K OLED 120Hz vivid color display with 100% DCI-P3 color gamut.',
    price: 1149.00,
    originalPrice: 1399.00,
    discountPercentage: 18,
    rating: 4.9,
    reviewCount: 89,
    stock: 12,
    category: 'electronics',
    brand: 'Zenith',
    sku: 'EL-ZN-15OLED',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true,
    isNewArrival: true,
    variants: [
      { id: 'storage', name: 'Storage', options: ['512GB SSD', '1TB SSD', '2TB SSD'] },
      { id: 'ram', name: 'Memory', options: ['16GB DDR5', '32GB DDR5'] }
    ],
    specifications: [
      { name: 'Processor', value: 'Core i7 Ultra 16-Core' },
      { name: 'Display', value: '15.6" 2.8K (2880x1620) 120Hz OLED' },
      { name: 'Weight', value: '1.42 kg' },
      { name: 'Ports', value: '2x Thunderbolt 4, HDMI 2.1, USB-A' }
    ],
    tags: ['laptop', 'oled', 'ultrabook', 'computer'],
    createdAt: '2026-09-15T12:00:00Z'
  },
  {
    id: 'prod-elec-3',
    name: 'PulseTrack Horizon Smartwatch',
    slug: 'pulsetrack-horizon-smartwatch',
    description: 'Comprehensive health and fitness tracking with ECG, SPO2, advanced sleep stages, and precision dual-frequency GPS. Waterproof up to 50 meters with 7-day battery life.',
    price: 159.00,
    originalPrice: 219.00,
    discountPercentage: 27,
    rating: 4.7,
    reviewCount: 215,
    stock: 35,
    category: 'electronics',
    brand: 'PulseTrack',
    sku: 'EL-PT-HZ4',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    isDeal: true,
    dealEndsAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    variants: [
      { id: 'band', name: 'Band Color', options: ['Obsidian Black', 'Ocean Blue', 'Alpine Starlight'] }
    ],
    specifications: [
      { name: 'Water Resistance', value: '5 ATM (50m)' },
      { name: 'Battery Life', value: 'Up to 7 days normal use' },
      { name: 'Sensors', value: 'Optical Heart Rate, SpO2, Accelerometer, Gyro' }
    ],
    tags: ['smartwatch', 'fitness', 'wearable', 'gps'],
    createdAt: '2026-09-08T08:30:00Z'
  },
  {
    id: 'prod-elec-4',
    name: 'SoundSphere 360 Portable Waterproof Speaker',
    slug: 'soundsphere-360-portable-waterproof-speaker',
    description: 'Immersive omnidirectional stereo sound with deep resonant bass. IP67 waterproof and dustproof design makes it the ultimate companion for beach outings and camping adventures.',
    price: 79.99,
    originalPrice: 99.99,
    discountPercentage: 20,
    rating: 4.6,
    reviewCount: 94,
    stock: 18,
    category: 'electronics',
    brand: 'SonicWave',
    sku: 'EL-SS-360',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'color', name: 'Color', options: ['Forest Green', 'Storm Grey', 'Sunset Red'] }
    ],
    specifications: [
      { name: 'Playtime', value: '18 hours' },
      { name: 'Water Rating', value: 'IP67 Waterproof' },
      { name: 'Output Power', value: '30W RMS' }
    ],
    tags: ['speaker', 'bluetooth', 'waterproof', 'outdoor'],
    createdAt: '2026-08-20T10:00:00Z'
  },

  // 2. Mobiles and Accessories
  {
    id: 'prod-mob-1',
    name: 'Aero 14 Pro 5G Flagship Smartphone',
    slug: 'aero-14-pro-5g-flagship-smartphone',
    description: 'Featuring the pioneering 200MP computational camera sensor, Snapdragon flagship processor, and blazing fast 100W SuperCharge that juices 0-100% in just 22 minutes.',
    price: 899.00,
    originalPrice: 1099.00,
    discountPercentage: 18,
    rating: 4.9,
    reviewCount: 310,
    stock: 15,
    category: 'mobiles',
    brand: 'AeroMobile',
    sku: 'MB-AM-14PRO',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true,
    variants: [
      { id: 'storage', name: 'Capacity', options: ['128GB', '256GB', '512GB'] },
      { id: 'color', name: 'Finish', options: ['Titanium Grey', 'Emerald Mist', 'Cosmic Black'] }
    ],
    specifications: [
      { name: 'Primary Camera', value: '200MP OIS + 50MP Ultra-wide + 12MP Telephoto' },
      { name: 'Display', value: '6.7" Quad HD+ AMOLED 1-120Hz LTPO' },
      { name: 'Battery', value: '5000 mAh with 100W Fast Charge' }
    ],
    tags: ['smartphone', '5g', 'flagship', 'camera'],
    createdAt: '2026-09-20T11:00:00Z'
  },
  {
    id: 'prod-mob-2',
    name: 'VoltCore 20,000mAh 65W GaN Power Bank',
    slug: 'voltcore-20000mah-65w-gan-power-bank',
    description: 'Pocket-sized powerhouse capable of charging laptops, tablets, and smartphones simultaneously. Features digital LED percentage display and airline-safe certified capacity.',
    price: 49.99,
    originalPrice: 69.99,
    discountPercentage: 28,
    rating: 4.8,
    reviewCount: 167,
    stock: 42,
    category: 'mobiles',
    brand: 'VoltCore',
    sku: 'MB-VC-20K',
    images: [
      'https://images.unsplash.com/photo-1609592426868-80e90f2305a2?w=800&auto=format&fit=crop&q=80'
    ],
    isDeal: true,
    dealEndsAt: new Date(Date.now() + 86400000 * 1.5).toISOString(),
    specifications: [
      { name: 'Capacity', value: '20,000 mAh (74Wh)' },
      { name: 'Max Output', value: '65W USB-C Power Delivery' },
      { name: 'Ports', value: '2x USB-C PD, 1x USB-A QC 3.0' }
    ],
    tags: ['powerbank', 'charger', 'travel', 'accessories'],
    createdAt: '2026-09-10T14:20:00Z'
  },
  {
    id: 'prod-mob-3',
    name: 'TrueBuds Air ANC Earbuds with Spatial Audio',
    slug: 'truebuds-air-anc-earbuds',
    description: 'Ultra-lightweight in-ear true wireless earbuds with spatial audio head-tracking, crystal-clear 6-mic beamforming calls, and wireless charging case.',
    price: 89.00,
    originalPrice: 129.00,
    discountPercentage: 31,
    rating: 4.7,
    reviewCount: 184,
    stock: 29,
    category: 'mobiles',
    brand: 'SonicWave',
    sku: 'MB-TB-AIR',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'color', name: 'Color', options: ['Glacier White', 'Carbon Black'] }
    ],
    specifications: [
      { name: 'Battery Life', value: '8h buds + 24h case' },
      { name: 'Noise Cancellation', value: 'Active Hybrid ANC up to 42dB' }
    ],
    tags: ['earbuds', 'wireless', 'anc', 'audio'],
    createdAt: '2026-09-04T16:00:00Z'
  },
  {
    id: 'prod-mob-4',
    name: 'MagArmor Drop-Tested Protective Case',
    slug: 'magarmor-drop-tested-protective-case',
    description: 'Military-grade 12ft drop protection with built-in neodymium magnetic ring for flawless MagSafe accessories alignment and anti-yellowing coating.',
    price: 24.99,
    originalPrice: 34.99,
    discountPercentage: 28,
    rating: 4.6,
    reviewCount: 78,
    stock: 50,
    category: 'mobiles',
    brand: 'ArmorShield',
    sku: 'MB-AS-MAG14',
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'phoneModel', name: 'Model', options: ['Pro 14 / 15', 'Pro Max 14 / 15', 'Standard 14 / 15'] }
    ],
    specifications: [
      { name: 'Drop Rating', value: 'MIL-STD-810G (12 Feet)' },
      { name: 'Material', value: 'Shock-Absorbing TPU + Polycarbonate' }
    ],
    tags: ['case', 'protection', 'magsafe'],
    createdAt: '2026-08-25T11:30:00Z'
  },

  // 3. Fashion and Clothing
  {
    id: 'prod-fash-1',
    name: 'Alpine Windbreak All-Weather Jacket',
    slug: 'alpine-windbreak-all-weather-jacket',
    description: 'Crafted with waterproof microporous breathable shell and thermo-regulate lining. Perfect for mountain trails or modern urban commutes.',
    price: 89.99,
    originalPrice: 129.99,
    discountPercentage: 30,
    rating: 4.8,
    reviewCount: 112,
    stock: 19,
    category: 'fashion',
    brand: 'NordicWear',
    sku: 'FA-NW-JKT01',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true,
    variants: [
      { id: 'size', name: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
      { id: 'color', name: 'Color', options: ['Forest Moss', 'Slate Navy', 'Charcoal'] }
    ],
    specifications: [
      { name: 'Material', value: '100% Recycled Hydro-Repellent Poly' },
      { name: 'Care', value: 'Machine wash cold, gentle cycle' }
    ],
    tags: ['jacket', 'outerwear', 'winter', 'waterproof'],
    createdAt: '2026-09-12T09:00:00Z'
  },
  {
    id: 'prod-fash-2',
    name: 'Veloce Air Lightweight Knit Sneakers',
    slug: 'veloce-air-lightweight-knit-sneakers',
    description: 'Cloud-like cushioning with high-rebound EVA sole and zero-seam breathable engineered knit upper for all-day comfort and athletic flair.',
    price: 74.99,
    originalPrice: 99.99,
    discountPercentage: 25,
    rating: 4.7,
    reviewCount: 96,
    stock: 22,
    category: 'fashion',
    brand: 'AeroStep',
    sku: 'FA-AS-SNK02',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80'
    ],
    isDeal: true,
    dealEndsAt: new Date(Date.now() + 86400000 * 2.2).toISOString(),
    variants: [
      { id: 'size', name: 'Shoe Size (US)', options: ['8', '9', '10', '11', '12'] },
      { id: 'color', name: 'Colorway', options: ['Crimson Red', 'Triple White', 'Stealth Black'] }
    ],
    specifications: [
      { name: 'Sole', value: 'Multi-density CloudFlow EVA' },
      { name: 'Upper', value: 'Engineered Circular Knit' }
    ],
    tags: ['shoes', 'sneakers', 'running', 'comfort'],
    createdAt: '2026-09-05T13:40:00Z'
  },
  {
    id: 'prod-fash-3',
    name: 'Aura Minimalist Italian Leather Backpack',
    slug: 'aura-minimalist-italian-leather-backpack',
    description: 'Handcrafted full-grain top layer leather with padded 16-inch laptop compartment, hidden security passport pocket, and brushed brass hardware.',
    price: 139.00,
    originalPrice: 189.00,
    discountPercentage: 26,
    rating: 4.9,
    reviewCount: 85,
    stock: 14,
    category: 'fashion',
    brand: 'ArtisanCraft',
    sku: 'FA-AC-BPK03',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'color', name: 'Color', options: ['Cognac Brown', 'Matte Black'] }
    ],
    specifications: [
      { name: 'Material', value: '100% Genuine Full Grain Cowhide' },
      { name: 'Dimensions', value: '42 x 30 x 14 cm' }
    ],
    tags: ['backpack', 'leather', 'luxury', 'work'],
    createdAt: '2026-08-30T10:15:00Z'
  },
  {
    id: 'prod-fash-4',
    name: 'SolRay Polarized Aviator Sunglasses',
    slug: 'solray-polarized-aviator-sunglasses',
    description: 'Timeless vintage aviator profile equipped with UV400 multi-layer polarized lenses and corrosion-resistant lightweight titanium frames.',
    price: 45.00,
    originalPrice: 65.00,
    discountPercentage: 30,
    rating: 4.6,
    reviewCount: 63,
    stock: 30,
    category: 'fashion',
    brand: 'SolRay',
    sku: 'FA-SR-AV04',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'lens', name: 'Lens Hue', options: ['Smoke Green', 'Bronze Gold', 'Ocean Gradient'] }
    ],
    specifications: [
      { name: 'Protection', value: '100% UV400 & Polarized' },
      { name: 'Frame', value: 'Aircraft Grade Titanium' }
    ],
    tags: ['sunglasses', 'summer', 'accessories'],
    createdAt: '2026-08-18T15:00:00Z'
  },

  // 4. Home and Kitchen
  {
    id: 'prod-home-1',
    name: 'BaristaTouch 15-Bar Precision Espresso Maker',
    slug: 'baristatouch-precision-espresso-maker',
    description: 'Brew cafe-quality lattes and velvety espressos at home. Featuring ThermoBlock rapid heating, pre-infusion pressure control, and commercial steam wand.',
    price: 249.99,
    originalPrice: 329.99,
    discountPercentage: 24,
    rating: 4.9,
    reviewCount: 198,
    stock: 16,
    category: 'home-kitchen',
    brand: 'BaristaCraft',
    sku: 'HK-BC-ESP1',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true,
    isDeal: true,
    dealEndsAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    specifications: [
      { name: 'Pump Pressure', value: '15 Bar Italian ULKA Pump' },
      { name: 'Water Tank', value: '1.8L Removable' },
      { name: 'Heating System', value: 'ThermoBlock Rapid (30s warmup)' }
    ],
    tags: ['espresso', 'coffee', 'kitchen', 'appliances'],
    createdAt: '2026-09-02T10:00:00Z'
  },
  {
    id: 'prod-home-2',
    name: 'CrispFlow 6-Quart Digital Air Fryer',
    slug: 'crispflow-6-quart-digital-air-fryer',
    description: '360 rapid thermal circulation delivers crispy golden texture with up to 85% less oil. 8 one-touch presets and dishwasher-safe nonstick basket.',
    price: 89.99,
    originalPrice: 119.99,
    discountPercentage: 25,
    rating: 4.7,
    reviewCount: 240,
    stock: 25,
    category: 'home-kitchen',
    brand: 'CrispFlow',
    sku: 'HK-CF-AF6',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { name: 'Capacity', value: '5.7 Liters (Serves 4-6)' },
      { name: 'Temperature Range', value: '100°F - 400°F' },
      { name: 'Power', value: '1700W' }
    ],
    tags: ['airfryer', 'cooking', 'healthy', 'kitchen'],
    createdAt: '2026-09-14T11:20:00Z'
  },
  {
    id: 'prod-home-3',
    name: 'RoboClean Max LiDAR Robotic Vacuum & Mop',
    slug: 'roboclean-max-lidar-robotic-vacuum-mop',
    description: 'Precision LiDAR laser navigation maps multi-level floors, avoids pet obstacles, and delivers 4000Pa powerful suction along with vibrating sonic mop pads.',
    price: 349.00,
    originalPrice: 499.00,
    discountPercentage: 30,
    rating: 4.8,
    reviewCount: 130,
    stock: 9,
    category: 'home-kitchen',
    brand: 'SmartLiving',
    sku: 'HK-SL-ROBO',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { name: 'Suction Power', value: '4000 Pa' },
      { name: 'Navigation', value: 'LiDAR LDS 360 Scan' },
      { name: 'Run Time', value: '180 Minutes' }
    ],
    tags: ['robotvacuum', 'smart-home', 'cleaning'],
    createdAt: '2026-08-28T09:40:00Z'
  },
  {
    id: 'prod-home-4',
    name: 'ChefMaster 10-Piece Tri-Ply Cookware Set',
    slug: 'chefmaster-10-piece-tri-ply-cookware-set',
    description: 'Heavy gauge stainless steel bonded with conductive aluminum core for optimal even heat distribution without hot spots. Oven safe to 500°F.',
    price: 189.00,
    originalPrice: 249.00,
    discountPercentage: 24,
    rating: 4.8,
    reviewCount: 77,
    stock: 14,
    category: 'home-kitchen',
    brand: 'ChefMaster',
    sku: 'HK-CM-10PC',
    images: [
      'https://images.unsplash.com/photo-1584990347449-399066669f9e?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { name: 'Composition', value: '3-Ply 18/10 Stainless Steel' },
      { name: 'Induction Compatible', value: 'Yes, all stovetops' }
    ],
    tags: ['cookware', 'pots', 'pans', 'stainless-steel'],
    createdAt: '2026-08-15T12:00:00Z'
  },

  // 5. Grocery and Daily Essentials
  {
    id: 'prod-groc-1',
    name: 'Single Origin Ethiopia Yirgacheffe Coffee Beans (1kg)',
    slug: 'ethiopia-yirgacheffe-coffee-beans-1kg',
    description: 'Freshly roasted whole bean coffee with delicate floral jasmine aromas, bergamot notes, and a clean honey finish. Sourced directly from fair-trade cooperatives.',
    price: 26.99,
    originalPrice: 34.99,
    discountPercentage: 22,
    rating: 4.9,
    reviewCount: 154,
    stock: 45,
    category: 'grocery',
    brand: 'ArtisanRoast',
    sku: 'GR-AR-COF01',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true,
    variants: [
      { id: 'grind', name: 'Grind Type', options: ['Whole Bean', 'Medium Drip Grind', 'Fine Espresso Grind'] }
    ],
    specifications: [
      { name: 'Roast Profile', value: 'Light-Medium Artisan Roast' },
      { name: 'Net Weight', value: '1000g (2.2 lbs)' }
    ],
    tags: ['coffee', 'organic', 'beverage', 'fairtrade'],
    createdAt: '2026-09-08T07:00:00Z'
  },
  {
    id: 'prod-groc-2',
    name: 'Terra d’Oro Cold-Pressed Extra Virgin Olive Oil (1L)',
    slug: 'cold-pressed-extra-virgin-olive-oil-1l',
    description: 'First cold-pressed within 4 hours of harvest in Crete, Greece. Low acidity under 0.3%, rich in heart-healthy polyphenols and vibrant grassy notes.',
    price: 22.50,
    originalPrice: 28.00,
    discountPercentage: 19,
    rating: 4.8,
    reviewCount: 88,
    stock: 36,
    category: 'grocery',
    brand: 'TerraDOro',
    sku: 'GR-TD-EVOO',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { name: 'Acidity', value: '< 0.3%' },
      { name: 'Origin', value: 'Kolymvari, Crete, Greece' }
    ],
    tags: ['oliveoil', 'organic', 'cooking', 'mediterranean'],
    createdAt: '2026-09-01T14:00:00Z'
  },
  {
    id: 'prod-groc-3',
    name: 'NaturePure Raw Organic Honey Comb (500g)',
    slug: 'naturepure-raw-organic-honey-comb',
    description: '100% pure raw wildflower honeycomb, completely unheated and unprocessed. Packed with natural enzymes, propolis, and wildflower nectar sweetness.',
    price: 18.99,
    originalPrice: 24.99,
    discountPercentage: 24,
    rating: 4.9,
    reviewCount: 110,
    stock: 28,
    category: 'grocery',
    brand: 'NaturePure',
    sku: 'GR-NP-HNY',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { name: 'Purity', value: '100% Raw Certified Organic' },
      { name: 'Source', value: 'Pristine Mountain Apiaries' }
    ],
    tags: ['honey', 'organic', 'raw', 'wellness'],
    createdAt: '2026-08-20T08:00:00Z'
  },
  {
    id: 'prod-groc-4',
    name: 'HarvestNuts Premium Roasted Mixed Nuts (750g)',
    slug: 'harvestnuts-premium-roasted-mixed-nuts',
    description: 'Crunchy dry-roasted combination of jumbo cashews, California almonds, buttery pecans, and Brazil nuts lightly kissed with pink Himalayan sea salt.',
    price: 16.99,
    originalPrice: 21.99,
    discountPercentage: 22,
    rating: 4.7,
    reviewCount: 65,
    stock: 40,
    category: 'grocery',
    brand: 'HarvestNuts',
    sku: 'GR-HN-NUTS',
    images: [
      'https://images.unsplash.com/photo-1543168256-418811576931?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { name: 'Ingredients', value: 'Almonds, Cashews, Pecans, Brazil Nuts, Salt' },
      { name: 'Net Weight', value: '750g' }
    ],
    tags: ['snacks', 'nuts', 'healthy', 'protein'],
    createdAt: '2026-08-27T10:00:00Z'
  },

  // 6. Beauty and Personal Care
  {
    id: 'prod-beau-1',
    name: 'LumiHydra Hyaluronic & Peptide Glow Serum',
    slug: 'lumihydra-hyaluronic-peptide-glow-serum',
    description: 'Multi-molecular hyaluronic acid combined with quad-peptide complex plumps fine lines and restores intense skin barrier hydration within 48 hours.',
    price: 38.00,
    originalPrice: 52.00,
    discountPercentage: 26,
    rating: 4.9,
    reviewCount: 220,
    stock: 31,
    category: 'beauty',
    brand: 'LumiSkin',
    sku: 'BP-LS-SRM1',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true,
    isDeal: true,
    dealEndsAt: new Date(Date.now() + 86400000 * 2.5).toISOString(),
    specifications: [
      { name: 'Volume', value: '50ml / 1.7 fl. oz.' },
      { name: 'Skin Types', value: 'Suitable for all skin types, including sensitive' }
    ],
    tags: ['skincare', 'serum', 'anti-aging', 'hydration'],
    createdAt: '2026-09-09T13:00:00Z'
  },
  {
    id: 'prod-beau-2',
    name: 'SonicSmile Smart Electric Sonic Toothbrush',
    slug: 'sonicsmile-smart-electric-sonic-toothbrush',
    description: '40,000 micro-brush vibrations per minute with quadrant pressure sensor, 5 custom cleaning modes, and an industry-leading 60-day single charge battery life.',
    price: 49.99,
    originalPrice: 69.99,
    discountPercentage: 28,
    rating: 4.7,
    reviewCount: 148,
    stock: 22,
    category: 'beauty',
    brand: 'SonicSmile',
    sku: 'BP-SS-TB40',
    images: [
      'https://images.unsplash.com/photo-1559591937-e1022131ceea?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'color', name: 'Color', options: ['Blush Pink', 'Midnight Slate', 'Pearl White'] }
    ],
    specifications: [
      { name: 'Vibrations', value: '40,000 VPM Maglev Motor' },
      { name: 'Battery', value: '60 days via USB-C' }
    ],
    tags: ['dental', 'toothbrush', 'grooming'],
    createdAt: '2026-09-03T10:00:00Z'
  },
  {
    id: 'prod-beau-3',
    name: 'AromaBotanica Botanical Hair Repair Oil',
    slug: 'aromabotanica-botanical-hair-repair-oil',
    description: 'Cold-pressed Moroccan argan oil infused with rosemary extract and vitamin E leaves hair silky soft, prevents split ends, and eliminates frizz without greasiness.',
    price: 24.50,
    originalPrice: 32.00,
    discountPercentage: 23,
    rating: 4.8,
    reviewCount: 92,
    stock: 27,
    category: 'beauty',
    brand: 'Botanica',
    sku: 'BP-AB-OIL',
    images: [
      'https://images.unsplash.com/photo-1608248597359-bb4a5940562e?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { name: 'Size', value: '100ml' },
      { name: 'Formula', value: 'Paraben-Free, Sulfate-Free, 100% Vegan' }
    ],
    tags: ['haircare', 'arganoil', 'repair'],
    createdAt: '2026-08-22T14:30:00Z'
  },
  {
    id: 'prod-beau-4',
    name: 'VelvetMist Eau De Parfum (100ml)',
    slug: 'velvetmist-eau-de-parfum-100ml',
    description: 'An intoxicating blend of Madagascar vanilla, smoky bourbon sandalwood, and crisp Italian bergamot. Long-lasting scent projection lasting over 12 hours.',
    price: 75.00,
    originalPrice: 95.00,
    discountPercentage: 21,
    rating: 4.8,
    reviewCount: 84,
    stock: 17,
    category: 'beauty',
    brand: 'VelvetMist',
    sku: 'BP-VM-EDP',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { name: 'Concentration', value: 'Eau De Parfum (20% Essence)' },
      { name: 'Fragrance Family', value: 'Warm Amber & Woody Vanilla' }
    ],
    tags: ['perfume', 'fragrance', 'luxury'],
    createdAt: '2026-08-16T15:20:00Z'
  },

  // 7. Books and Stationery
  {
    id: 'prod-book-1',
    name: 'The Modern Artisan Leatherbound Journal',
    slug: 'modern-artisan-leatherbound-journal',
    description: 'Hand-stitched genuine calfskin cover with 240 numbered pages of 120gsm bleed-proof fountain pen friendly bamboo paper. Includes satin ribbon marker.',
    price: 29.99,
    originalPrice: 39.99,
    discountPercentage: 25,
    rating: 4.9,
    reviewCount: 165,
    stock: 35,
    category: 'books-stationery',
    brand: 'HeritagePress',
    sku: 'BS-HP-JRNL',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true,
    variants: [
      { id: 'pageType', name: 'Layout', options: ['Dot Grid', 'Lined Ruled', 'Blank Sketch'] }
    ],
    specifications: [
      { name: 'Paper Quality', value: '120 GSM Acid-Free Bamboo Pulp' },
      { name: 'Cover', value: 'Full Grain Distressed Leather' }
    ],
    tags: ['journal', 'notebook', 'stationery', 'leather'],
    createdAt: '2026-09-06T10:00:00Z'
  },
  {
    id: 'prod-book-2',
    name: 'Classic Brass Precision Fountain Pen Set',
    slug: 'classic-brass-precision-fountain-pen-set',
    description: 'Balanced solid brass barrel with German iridium medium nib for effortless ink glide. Comes in gift box with piston converter and 6 black ink cartridges.',
    price: 39.00,
    originalPrice: 55.00,
    discountPercentage: 29,
    rating: 4.8,
    reviewCount: 79,
    stock: 20,
    category: 'books-stationery',
    brand: 'HeritagePress',
    sku: 'BS-HP-PEN',
    images: [
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { name: 'Nib', value: '0.5mm Medium German Steel Nib' },
      { name: 'Material', value: 'CNC Machined Solid Brass' }
    ],
    tags: ['pen', 'fountainpen', 'writing', 'gift'],
    createdAt: '2026-08-29T11:00:00Z'
  },
  {
    id: 'prod-book-3',
    name: 'Architects of Tomorrow: The Modern Tech Era',
    slug: 'architects-of-tomorrow-tech-era',
    description: 'Hardcover collector edition exploring the transformative breakthroughs in artificial intelligence, distributed systems, and quantum engineering from world-leading theorists.',
    price: 24.95,
    originalPrice: 32.00,
    discountPercentage: 22,
    rating: 4.7,
    reviewCount: 94,
    stock: 26,
    category: 'books-stationery',
    brand: 'Meridian Books',
    sku: 'BS-MB-BOOK1',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { name: 'Format', value: 'Hardcover with Gold Foil Stamp' },
      { name: 'Pages', value: '416 pages' }
    ],
    tags: ['books', 'tech', 'hardcover', 'reading'],
    createdAt: '2026-08-19T14:00:00Z'
  },
  {
    id: 'prod-book-4',
    name: 'Bamboo Multi-Device Desktop Organizer',
    slug: 'bamboo-multi-device-desktop-organizer',
    description: 'Keep your workspace clutter-free with dedicated slots for smartphone wireless charging pad, pens, post-its, scissors, and magnetic paperclip trench.',
    price: 28.00,
    originalPrice: 38.00,
    discountPercentage: 26,
    rating: 4.6,
    reviewCount: 52,
    stock: 33,
    category: 'books-stationery',
    brand: 'EcoDesk',
    sku: 'BS-ED-ORG',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { name: 'Material', value: '100% Sustainable Natural Bamboo' },
      { name: 'Dimensions', value: '30 x 18 x 12 cm' }
    ],
    tags: ['desk', 'organizer', 'office', 'bamboo'],
    createdAt: '2026-08-12T09:30:00Z'
  },

  // 8. Sports and Fitness
  {
    id: 'prod-sport-1',
    name: 'FlexGrip Rapid-Select Adjustable Dumbbell (5-52.5 lbs)',
    slug: 'flexgrip-adjustable-dumbbell',
    description: 'Replace 15 pairs of dumbbells with a single dial turn. Heavy-duty steel plates with quiet nylon molding allow smooth rapid weight increments from 5 to 52.5 lbs.',
    price: 189.99,
    originalPrice: 249.99,
    discountPercentage: 24,
    rating: 4.9,
    reviewCount: 230,
    stock: 14,
    category: 'sports-fitness',
    brand: 'TitanFit',
    sku: 'SF-TF-DUMB',
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true,
    isDeal: true,
    dealEndsAt: new Date(Date.now() + 86400000 * 3.5).toISOString(),
    specifications: [
      { name: 'Weight Range', value: '5 to 52.5 lbs (2.5 lb increments)' },
      { name: 'Mechanism', value: 'Dual-Dial Locking System' }
    ],
    tags: ['dumbbell', 'gym', 'weights', 'fitness'],
    createdAt: '2026-09-11T12:00:00Z'
  },
  {
    id: 'prod-sport-2',
    name: 'ZenFlow Eco Non-Slip Alignment Yoga Mat',
    slug: 'zenflow-eco-non-slip-yoga-mat',
    description: 'Engineered with laser-etched posture alignment guidelines and high-density natural tree rubber base that guarantees zero sliding even during heated vinyasa practice.',
    price: 48.00,
    originalPrice: 65.00,
    discountPercentage: 26,
    rating: 4.8,
    reviewCount: 118,
    stock: 28,
    category: 'sports-fitness',
    brand: 'ZenFlow',
    sku: 'SF-ZF-MAT',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'color', name: 'Color', options: ['Sage Green', 'Midnight Obsidian', 'Plum Rose'] }
    ],
    specifications: [
      { name: 'Thickness', value: '5mm Extra Cushioning' },
      { name: 'Material', value: 'Natural Tree Rubber + PU Vegan Leather Top' }
    ],
    tags: ['yoga', 'mat', 'pilates', 'fitness'],
    createdAt: '2026-09-02T15:00:00Z'
  },
  {
    id: 'prod-sport-3',
    name: 'HydroShield Insulated Stainless Steel Bottle (32oz)',
    slug: 'hydroshield-insulated-bottle-32oz',
    description: 'Double-wall vacuum insulation keeps ice cold for up to 36 hours or steaming hot for 16 hours. Includes leakproof spout lid and built-in carry loop handle.',
    price: 28.50,
    originalPrice: 36.00,
    discountPercentage: 21,
    rating: 4.7,
    reviewCount: 95,
    stock: 44,
    category: 'sports-fitness',
    brand: 'HydroShield',
    sku: 'SF-HS-BOT32',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'color', name: 'Finish', options: ['Cobalt Blue', 'Matte Stone', 'Desert Sand'] }
    ],
    specifications: [
      { name: 'Capacity', value: '32 fl oz (946 ml)' },
      { name: 'Material', value: '18/8 Food Grade Stainless Steel, BPA Free' }
    ],
    tags: ['bottle', 'hydration', 'sports'],
    createdAt: '2026-08-24T11:00:00Z'
  },
  {
    id: 'prod-sport-4',
    name: 'PowerBand 5-Piece Heavy Duty Resistance Set',
    slug: 'powerband-5-piece-resistance-set',
    description: '100% natural Malaysian latex bands offering 10 to 150 lbs of stackable resistance. Includes steel-reinforced carabiners, foam handles, door anchor, and travel pouch.',
    price: 29.99,
    originalPrice: 42.00,
    discountPercentage: 28,
    rating: 4.7,
    reviewCount: 82,
    stock: 35,
    category: 'sports-fitness',
    brand: 'TitanFit',
    sku: 'SF-TF-BANDS',
    images: [
      'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { name: 'Max Resistance', value: '150 lbs total combined load' },
      { name: 'Accessories', value: '2 Handles, 2 Ankle Straps, 1 Door Anchor, 1 Bag' }
    ],
    tags: ['resistance-bands', 'workout', 'homegym'],
    createdAt: '2026-08-14T09:00:00Z'
  },

  // 9. Toys and Games
  {
    id: 'prod-toy-1',
    name: 'Vortex Pro Wireless Low-Latency Gaming Controller',
    slug: 'vortex-pro-wireless-gaming-controller',
    description: 'Hall effect magnetic joysticks prevent stick drift forever. Features mechanical tactile face buttons, adjustable hair-trigger locks, and 2.4GHz + Bluetooth connectivity.',
    price: 69.99,
    originalPrice: 89.99,
    discountPercentage: 22,
    rating: 4.8,
    reviewCount: 160,
    stock: 21,
    category: 'toys-games',
    brand: 'VortexGaming',
    sku: 'TG-VG-CTR1',
    images: [
      'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true,
    variants: [
      { id: 'color', name: 'Color', options: ['Cyber White', 'Shadow Black', 'Neon Violet'] }
    ],
    specifications: [
      { name: 'Sensors', value: 'Hall Effect Electromagnetic Sticks & Triggers' },
      { name: 'Compatibility', value: 'PC, Switch, iOS, Android, Steam Deck' }
    ],
    tags: ['controller', 'gaming', 'esports', 'hall-effect'],
    createdAt: '2026-09-07T12:00:00Z'
  },
  {
    id: 'prod-toy-2',
    name: 'NovaStrike RGB Hot-Swappable Mechanical Keyboard',
    slug: 'novastrike-rgb-mechanical-keyboard',
    description: 'Custom gasket-mounted design with factory pre-lubed linear switches and thick PBT double-shot keycaps for the signature creamy sound profile. Per-key RGB illumination.',
    price: 94.99,
    originalPrice: 129.99,
    discountPercentage: 27,
    rating: 4.9,
    reviewCount: 175,
    stock: 18,
    category: 'toys-games',
    brand: 'VortexGaming',
    sku: 'TG-VG-KB75',
    images: [
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80'
    ],
    isDeal: true,
    dealEndsAt: new Date(Date.now() + 86400000 * 2.8).toISOString(),
    variants: [
      { id: 'switch', name: 'Switch Type', options: ['Gateron Yellow Linear', 'Tactile Brown', 'Silent Silver'] }
    ],
    specifications: [
      { name: 'Form Factor', value: '75% Compact (82 Keys)' },
      { name: 'Mounting', value: 'Poron Gasket Mount + Sound Dampening Foam' }
    ],
    tags: ['keyboard', 'mechanical', 'rgb', 'gaming'],
    createdAt: '2026-08-31T14:00:00Z'
  },
  {
    id: 'prod-toy-3',
    name: 'RoboSpark STEM Programmable Bionic Robot Kit',
    slug: 'robospark-stem-programmable-robot-kit',
    description: 'Inspire budding engineers with an interactive 4-legged quadruped robot kit. Supports Scratch visual blocks and Python programming with ultrasonic obstacle avoidance.',
    price: 119.00,
    originalPrice: 159.00,
    discountPercentage: 25,
    rating: 4.8,
    reviewCount: 71,
    stock: 15,
    category: 'toys-games',
    brand: 'RoboSpark',
    sku: 'TG-RS-STEM',
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { name: 'Age Recommendation', value: '10+ Years' },
      { name: 'Coding Languages', value: 'Blockly & Python 3' }
    ],
    tags: ['robotics', 'stem', 'educational', 'coding'],
    createdAt: '2026-08-21T10:00:00Z'
  },
  {
    id: 'prod-toy-4',
    name: 'Settlers of the Realm Strategy Board Game',
    slug: 'settlers-of-the-realm-board-game',
    description: 'Award-winning resource management and tactical expansion game. High replayability with modular hexagonal tiles, detailed miniature cast castles, and 3-6 player support.',
    price: 44.99,
    originalPrice: 59.99,
    discountPercentage: 25,
    rating: 4.9,
    reviewCount: 133,
    stock: 27,
    category: 'toys-games',
    brand: 'RealmGames',
    sku: 'TG-RG-BG01',
    images: [
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&auto=format&fit=crop&q=80'
    ],
    specifications: [
      { name: 'Players', value: '3 - 6 Players' },
      { name: 'Playing Time', value: '60 - 90 Minutes' }
    ],
    tags: ['boardgame', 'tabletop', 'strategy', 'family'],
    createdAt: '2026-08-10T11:00:00Z'
  }
];

export const initialCoupons: Coupon[] = [
  {
    code: 'QUICK10',
    discountPercentage: 10,
    minSpend: 30,
    maxDiscount: 25,
    description: 'Get 10% off on all orders above $30',
    expiresAt: '2027-12-31'
  },
  {
    code: 'SUPER20',
    discountPercentage: 20,
    minSpend: 100,
    maxDiscount: 60,
    description: 'Super Saver! 20% off on orders exceeding $100',
    expiresAt: '2027-12-31'
  },
  {
    code: 'FREESHIP',
    discountPercentage: 100, // special handling for free shipping
    minSpend: 50,
    description: 'Free expedited shipping on orders over $50',
    expiresAt: '2027-12-31'
  },
  {
    code: 'WELCOME50',
    discountPercentage: 15,
    minSpend: 40,
    maxDiscount: 35,
    description: 'Welcome bonus: 15% off for first-time shoppers',
    expiresAt: '2027-12-31'
  }
];

export const initialUsers: User[] = [
  {
    id: 'user-admin',
    name: 'QuickMart Admin',
    email: 'admin@quickmart.com',
    role: 'admin',
    phone: '+1 (555) 019-2834',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01T00:00:00Z',
    addresses: [
      {
        id: 'addr-admin-1',
        fullName: 'QuickMart Headquarters',
        street: '742 Evergreen Terrace, Suite 400',
        city: 'Springfield',
        state: 'OR',
        postalCode: '97477',
        country: 'United States',
        phone: '+1 (555) 019-2834',
        isDefault: true
      }
    ]
  },
  {
    id: 'user-customer',
    name: 'Sarah Connor',
    email: 'sarah@quickmart.com',
    role: 'customer',
    phone: '+1 (555) 839-4412',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-15T00:00:00Z',
    addresses: [
      {
        id: 'addr-cust-1',
        fullName: 'Sarah Connor',
        street: '1204 Oakridge Blvd, Apt 4B',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94107',
        country: 'United States',
        phone: '+1 (555) 839-4412',
        isDefault: true
      },
      {
        id: 'addr-cust-2',
        fullName: 'Sarah Connor (Office)',
        street: '550 Market Street, Floor 18',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94104',
        country: 'United States',
        phone: '+1 (555) 839-4412',
        isDefault: false
      }
    ]
  }
];
