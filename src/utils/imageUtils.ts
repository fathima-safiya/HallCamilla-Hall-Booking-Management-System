import djImg from '../assets/services/dj.jpg';
import externalDecorationImg from '../assets/services/external-decoration.jpg';
import externalPhotographerImg from '../assets/services/external-photographer.jpg';
import flowersImg from '../assets/services/flowers.jpg';
import generatorImg from '../assets/services/generator.jpg';
import musicBandImg from '../assets/services/music-band.jpg';
import photographyImg from '../assets/services/photography.jpg';
import vipLoungeImg from '../assets/services/vip-lounge.jpg';

const FALLBACK_CATEGORIES = {
  food: [
    '1555244162-803834f70033', // Buffet
    '1510076857177-7470076d4098', // Drinks
    '1530103862676-de8c9debad1d', // Upgrade
    '1522413452208-996ff3f3e740', // Coffee
  ],
  decoration: [
    '1519225421980-715cb0215aed', // Flowers
    '1511795409834-ef04bbd61622', // Entrance
    '1469334031218-e382a71b716b', // Outdoor decor
  ],
  tech: [
    '1501281668745-f7f57925c3b4', // LED wall
    '1598488035139-bdbb2231ce04', // Sound
    '1492684223066-81342ee5ff30', // Stage lights
    '1464366400600-7168b8af9bc3', // Streaming
  ],
  entertainment: [
    '1511192336575-5a79af67a629', // Acoustic band
    '1516450360452-9312f5e86fc7', // DJ
    '1515934751635-c81c6bc9a2d8', // Photo booth
    '1505373877841-8d25f7d46678', // Dance
  ],
  general: [
    '1511285560929-80b456fea0bc', // Wedding couple
    '1586023492125-27b2c045efd7', // Lounge
    '1519167758481-83f550bb49b3', // General banquet
    '1531058020387-3be344556be6', // AC/Hall
    '1540479859555-17af45c78602', // kids
    '1522071820081-009f0129c71c', // lounge 2
  ]
};

export const getExactServiceImage = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('dj')) return djImg;
  if (lowerName.includes('external decor')) return externalDecorationImg;
  if (lowerName.includes('external photo')) return externalPhotographerImg;
  if (lowerName.includes('flower') || lowerName.includes('floral')) return flowersImg;
  if (lowerName.includes('generator')) return generatorImg;
  if (lowerName.includes('band') || lowerName.includes('acoustic') || lowerName.includes('music')) return musicBandImg;
  if (lowerName.includes('photo') || lowerName.includes('video') || lowerName.includes('camera')) return photographyImg;
  if (lowerName.includes('vip') || lowerName.includes('lounge')) return vipLoungeImg;
  return undefined;
};

export const getHotelServiceImage = (name: string) => {
  // Check for local asset mappings first based on keywords
  const exactLocal = getExactServiceImage(name);
  if (exactLocal) return exactLocal;

  // First, check explicit exact matches for known demo services (if any missed the DB image)
  const exactMatches: Record<string, string> = {
    // Current seeded services
    'Premium Sound System': '1598488035139-bdbb2231ce04',
    'LED Video Wall': '1501281668745-f7f57925c3b4',
    'Live Event Streaming': '1464366400600-7168b8af9bc3',
    'Professional Stage Lighting': '1492684223066-81342ee5ff30',
    'Welcome Drinks Station': '1510076857177-7470076d4098',
    'Premium Dessert Counter': '1555244162-803834f70033',
    'Coffee & Tea Station': '1522413452208-996ff3f3e740',
    'Kids Entertainment Area': '1540479859555-17af45c78602',
    'Traditional Kandyan Dance Performance': '1505373877841-8d25f7d46678',
    'Extended Air Conditioning': '1531058020387-3be344556be6',
    'Premium Buffet Upgrade': '1530103862676-de8c9debad1d',
    'Wedding Entrance Decoration': '1511795409834-ef04bbd61622',
    
    // Legacy mapping (just in case they have old names in DB)
    'Concert Sound System': '1598488035139-bdbb2231ce04',
    'Intelligent Lighting': '1492684223066-81342ee5ff30',
    'Bridal Car Decoration': '1511795409834-ef04bbd61622',
    'Welcome Drinks Counter': '1510076857177-7470076d4098',
    'Live Streaming Setup': '1464366400600-7168b8af9bc3', 
    'Crystal Centerpieces': '1469334031218-e382a71b716b',
    'Champagne Tower': '1510076857177-7470076d4098',
    'Chocolate Fountain': '1555244162-803834f70033',
    'Kids Play Area': '1540479859555-17af45c78602',
    'Traditional Dancers': '1505373877841-8d25f7d46678',
    'Extended AC Hours': '1531058020387-3be344556be6',
    'Projector & Sound System': '1598488035139-bdbb2231ce04'
  };

  if (exactMatches[name]) {
    return `https://images.unsplash.com/photo-${exactMatches[name]}?auto=format&fit=crop&w=800&q=80`;
  }

  // Determine category based on keywords in the name
  const lowerName = name.toLowerCase();
  let category: keyof typeof FALLBACK_CATEGORIES = 'general';
  
  if (lowerName.match(/food|buffet|dining|dessert|drink|cake|chocolate|coffee|tea|catering|meal/)) {
    category = 'food';
  } else if (lowerName.match(/decor|flower|floral|table|centerpiece|entrance/)) {
    category = 'decoration';
  } else if (lowerName.match(/sound|audio|video|screen|light|led|stream|projector|camera/)) {
    category = 'tech';
  } else if (lowerName.match(/music|dj|band|dance|entertain|photo booth/)) {
    category = 'entertainment';
  }

  // Generate a hash from the string to get a consistent unique integer
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  // Pick an image from the determined category based on the hash
  const imagesList = FALLBACK_CATEGORIES[category];
  const imageId = imagesList[hash % imagesList.length];

  return `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=800&q=80`;
};
