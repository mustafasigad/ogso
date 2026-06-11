// shared/data.js - shared across all pages
export const HARDCODED_HOTELS = [
  { id:'1', name:'Jigjiga Grand Hotel', city:'Jigjiga', price:1200, rating:4.6, reviews:84, verified:true,
    amenities:['WiFi','Breakfast','AC','Parking','Airport pickup'],
    photo:'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
    desc:'The most prestigious hotel in Jigjiga, located in the heart of the city centre. Popular with government officials, business travellers and diaspora visitors.',
    phone:'+251257750001',
    rooms:[
      { type:'standard', name:'Standard Room', price:1200, beds:'Double bed, AC, en-suite bathroom', popular:false, photos:[] },
      { type:'deluxe', name:'Deluxe Room', price:1800, beds:'King bed, city view, minibar, AC', popular:true, photos:[] },
      { type:'suite', name:'Executive Suite', price:3000, beds:'Separate living room, king bed, premium amenities', popular:false, photos:[] },
    ]
  },
  { id:'2', name:'Al-Noor Hotel', city:'Jigjiga', price:850, rating:4.3, reviews:51, verified:true,
    amenities:['WiFi','AC','Parking','Restaurant','Prayer room'],
    photo:'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80',
    desc:'A well-established hotel popular with business travellers and families.',
    phone:'+251257750002',
    rooms:[
      { type:'standard', name:'Standard Room', price:850, beds:'Double bed, AC, en-suite bathroom', popular:false, photos:[] },
      { type:'deluxe', name:'Deluxe Room', price:1300, beds:'King bed, city view, AC', popular:true, photos:[] },
      { type:'family', name:'Family Room', price:1800, beds:'2 double beds, sleeps 4, AC', popular:false, photos:[] },
    ]
  },
  { id:'3', name:'Hawd Guest House', city:'Jigjiga', price:550, rating:4.1, reviews:37, verified:false,
    amenities:['WiFi','AC','Budget','24hr reception'],
    photo:'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
    desc:'A clean and affordable guesthouse in the Hawd district.',
    phone:'+251257750003',
    rooms:[
      { type:'single', name:'Single Room', price:550, beds:'Single bed, AC, shared bathroom', popular:false, photos:[] },
      { type:'standard', name:'Standard Room', price:750, beds:'Double bed, AC, en-suite bathroom', popular:true, photos:[] },
    ]
  },
  { id:'4', name:'Nugaal Palace Hotel', city:'Jigjiga', price:1500, rating:4.4, reviews:62, verified:true,
    amenities:['Rooftop','Restaurant','WiFi','AC','Conference room'],
    photo:'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80',
    desc:'Jigjiga most distinctive hotel featuring a rooftop terrace.',
    phone:'+251257750004',
    rooms:[
      { type:'standard', name:'Standard Room', price:1500, beds:'Double bed, AC, en-suite bathroom', popular:false, photos:[] },
      { type:'deluxe', name:'Deluxe Room', price:2200, beds:'King bed, rooftop view, minibar', popular:true, photos:[] },
      { type:'suite', name:'Presidential Suite', price:4000, beds:'Full suite, private terrace, premium service', popular:false, photos:[] },
    ]
  },
  { id:'5', name:'Jubba Hotel', city:'Jigjiga', price:900, rating:4.2, reviews:43, verified:false,
    amenities:['WiFi','AC','Restaurant','Laundry','Parking'],
    photo:'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80',
    desc:'Named after the famous Jubba River, comfortable accommodation in central Jigjiga.',
    phone:'+251257750005',
    rooms:[
      { type:'standard', name:'Standard Room', price:900, beds:'Double bed, AC, en-suite bathroom', popular:false, photos:[] },
      { type:'deluxe', name:'Deluxe Room', price:1400, beds:'King bed, AC, minibar', popular:true, photos:[] },
    ]
  },
  { id:'6', name:'Oriental Hotel Jigjiga', city:'Jigjiga', price:700, rating:4.0, reviews:28, verified:false,
    amenities:['WiFi','AC','Near market','24hr reception'],
    photo:'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&q=80',
    desc:'A convenient hotel located near the main Jigjiga market.',
    phone:'+251257750006',
    rooms:[
      { type:'standard', name:'Standard Room', price:700, beds:'Double bed, AC, en-suite bathroom', popular:true, photos:[] },
      { type:'family', name:'Family Room', price:1100, beds:'2 double beds, AC, sleeps 4', popular:false, photos:[] },
    ]
  },
];

export const CATEGORIES = [
  { icon:'ti-building', label:'Hotels' },
  { icon:'ti-tools-kitchen-2', label:'Restaurants' },
  { icon:'ti-heart-rate-monitor', label:'Clinics' },
  { icon:'ti-pill', label:'Pharmacies' },
  { icon:'ti-shopping-bag', label:'Shops' },
  { icon:'ti-car', label:'Car hire' },
  { icon:'ti-cash', label:'Money transfer' },
  { icon:'ti-book', label:'Bookshop' },
  { icon:'ti-tool', label:'Mechanic' },
  { icon:'ti-settings', label:'Repairs' },
  { icon:'ti-gas-station', label:'Petrol Station' },
  { icon:'ti-hammer', label:'Hardware' },
  { icon:'ti-diamond', label:'Bridal Wear' },
  { icon:'ti-sparkles', label:'Beauty Salon' },
  { icon:'ti-cut', label:'Barber' },
  { icon:'ti-bread', label:'Bakery' },
  { icon:'ti-shirt', label:'Men Wear' },
  { icon:'ti-hanger', label:'Women Wear' },
  { icon:'ti-baby-carriage', label:'Children Wear' },
  { icon:'ti-wash', label:'Cleaning Service' },
  { icon:'ti-building-store', label:'Shopping Mall' },
  { icon:'ti-school', label:'Education' },
  { icon:'ti-recycle', label:'Used Items' },
  { icon:'ti-brand-tiktok', label:'TikToker' },
];

export const CAT_MAP = {
  'Hotels':'hotel','Restaurants':'restaurant','Clinics':'clinic','Pharmacies':'pharmacy',
  'Shops':'shop','Car hire':'car_hire','Money transfer':'money_transfer','Bookshop':'bookshop',
  'Mechanic':'mechanic','Repairs':'repairs','Petrol Station':'petrol_station','Hardware':'hardware',
  'Bridal Wear':'bridal_wear','Beauty Salon':'beauty_salon','Barber':'barber','Bakery':'bakery',
  'Men Wear':'men_wear','Women Wear':'women_wear','Children Wear':'children_wear',
  'Cleaning Service':'cleaning_service','Shopping Mall':'shopping_mall',
  'Education':'educational_service','Used Items':'used_items'
};

export const API = 'https://ogso-production.up.railway.app/api';

export const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80';

export function getDefaultRooms(hotel) {
  return [
    { type:'standard', name:'Standard Room', price:hotel.price, beds:'Double bed, AC, en-suite bathroom', popular:false, photos:[] },
    { type:'deluxe', name:'Deluxe Room', price:Math.round(hotel.price*1.6), beds:'King bed, city view, minibar', popular:true, photos:[] },
    { type:'family', name:'Family Suite', price:Math.round(hotel.price*2.5), beds:'2 rooms, sleeps 5, kitchenette', popular:false, photos:[] },
  ];
}

export function mapDbHotel(b) {
  return {
    id: b._id, name: b.name, city: b.city, suburb: b.suburb || '',
    price: b.price || 850, rating: b.rating || 0,
    reviews: b.reviewCount || 0, verified: b.verified,
    amenities: b.amenities && b.amenities.length > 0 ? b.amenities : ['WiFi'],
    photo: b.photos && b.photos.length > 0 ? b.photos[0] : DEFAULT_PHOTO,
    photos: b.photos || [],
    desc: b.description || '',
    phone: b.phone || '',
    rooms: b.rooms && b.rooms.length > 0 ? b.rooms : [],
    category: b.category,
  };
}

export const colors = {
  dark: '#1B3A2D',
  green: '#2D6A4F',
  light: '#52B788',
  border: '#C8E6D8',
  bg: '#F8F4EC',
  bgLight: '#F0F7F4',
  gold: '#D4A843',
  text: '#4D7A65',
};
