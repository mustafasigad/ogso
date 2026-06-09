import React, { useState, useEffect } from 'react';
import {
  IconShieldCheck, IconBrandWhatsapp, IconLanguage, IconCash,
  IconMapPin, IconStar, IconSearch, IconArrowLeft, IconCheck
} from '@tabler/icons-react';
import SearchPage from './SearchPage';
import ListPage from './ListPage';
import AdminPage from './AdminPage';
import ReviewSection from '../components/common/ReviewSection';
import { RoomPhotoGallery } from '../components/common/RoomPhotoUploadMulti';
import ConfirmHotelPage from './ConfirmHotelPage';

const HOTELS = [
  { id:'1', name:'Jigjiga Grand Hotel', city:'Jigjiga', price:1200, rating:4.6, reviews:84, verified:true,
    amenities:['WiFi','Breakfast','AC','Parking','Airport pickup'],
    photo:'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
    desc:'The most prestigious hotel in Jigjiga, located in the heart of the city centre. Popular with government officials, business travellers and diaspora visitors.',
    phone:'+251257750001',
    rooms:[
      { type:'standard', name:'Standard Room', price:1200, beds:'Double bed, AC, en-suite bathroom', popular:false },
      { type:'deluxe', name:'Deluxe Room', price:1800, beds:'King bed, city view, minibar, AC', popular:true },
      { type:'suite', name:'Executive Suite', price:3000, beds:'Separate living room, king bed, premium amenities', popular:false },
    ]
  },
  { id:'2', name:'Al-Noor Hotel', city:'Jigjiga', price:850, rating:4.3, reviews:51, verified:true,
    amenities:['WiFi','AC','Parking','Restaurant','Prayer room'],
    photo:'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80',
    desc:'A well-established hotel popular with business travellers and families. Features an in-house halal restaurant serving Somali and Ethiopian cuisine.',
    phone:'+251257750002',
    rooms:[
      { type:'standard', name:'Standard Room', price:850, beds:'Double bed, AC, en-suite bathroom', popular:false },
      { type:'deluxe', name:'Deluxe Room', price:1300, beds:'King bed, city view, AC', popular:true },
      { type:'family', name:'Family Room', price:1800, beds:'2 double beds, sleeps 4, AC', popular:false },
    ]
  },
  { id:'3', name:'Hawd Guest House', city:'Jigjiga', price:550, rating:4.1, reviews:37, verified:false,
    amenities:['WiFi','AC','Budget','24hr reception'],
    photo:'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
    desc:'A clean and affordable guesthouse in the Hawd district, ideal for budget travellers and those visiting family in Jigjiga.',
    phone:'+251257750003',
    rooms:[
      { type:'single', name:'Single Room', price:550, beds:'Single bed, AC, shared bathroom', popular:false },
      { type:'standard', name:'Standard Room', price:750, beds:'Double bed, AC, en-suite bathroom', popular:true },
    ]
  },
  { id:'4', name:'Nugaal Palace Hotel', city:'Jigjiga', price:1500, rating:4.4, reviews:62, verified:true,
    amenities:['Rooftop','Restaurant','WiFi','AC','Conference room'],
    photo:'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80',
    desc:'Jigjiga most distinctive hotel featuring a rooftop terrace with panoramic views of the city and authentic Somali cuisine.',
    phone:'+251257750004',
    rooms:[
      { type:'standard', name:'Standard Room', price:1500, beds:'Double bed, AC, en-suite bathroom', popular:false },
      { type:'deluxe', name:'Deluxe Room', price:2200, beds:'King bed, rooftop view, minibar', popular:true },
      { type:'suite', name:'Presidential Suite', price:4000, beds:'Full suite, private terrace, premium service', popular:false },
    ]
  },
  { id:'5', name:'Jubba Hotel', city:'Jigjiga', price:900, rating:4.2, reviews:43, verified:false,
    amenities:['WiFi','AC','Restaurant','Laundry','Parking'],
    photo:'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80',
    desc:'Named after the famous Jubba River, this hotel offers comfortable accommodation in central Jigjiga with a popular restaurant.',
    phone:'+251257750005',
    rooms:[
      { type:'standard', name:'Standard Room', price:900, beds:'Double bed, AC, en-suite bathroom', popular:false },
      { type:'deluxe', name:'Deluxe Room', price:1400, beds:'King bed, AC, minibar', popular:true },
    ]
  },
  { id:'6', name:'Oriental Hotel Jigjiga', city:'Jigjiga', price:700, rating:4.0, reviews:28, verified:false,
    amenities:['WiFi','AC','Near market','24hr reception'],
    photo:'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&q=80',
    desc:'A convenient hotel located near the main Jigjiga market, ideal for traders and shoppers. Competitive prices.',
    phone:'+251257750006',
    rooms:[
      { type:'standard', name:'Standard Room', price:700, beds:'Double bed, AC, en-suite bathroom', popular:true },
      { type:'family', name:'Family Room', price:1100, beds:'2 double beds, AC, sleeps 4', popular:false },
    ]
  },
];

const CITIES = ['All cities','Jigjiga','Mogadishu','Hargeisa','Djibouti City','Garissa'];
const CATEGORIES = [
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
const TERRITORIES = [
  { name:'Somali Region', sub:'Ethiopia - Phase 1', active:true },
  { name:'Somalia', sub:'Mogadishu - Phase 3' },
  { name:'Somaliland', sub:'Hargeisa - Phase 3' },
  { name:'Djibouti', sub:'City - Phase 2' },
  { name:'Kenya NFD', sub:'Garissa - Phase 4' },
];
const WHY = [
  { icon:<IconShieldCheck size={22} color="#fff"/>, title:'Every business verified', desc:'Every listing checked before going live' },
  { icon:<IconBrandWhatsapp size={22} color="#fff"/>, title:'WhatsApp booking', desc:'Confirm in minutes, not hours' },
  { icon:<IconLanguage size={22} color="#fff"/>, title:'Af-Soomaali', desc:'Full Somali language support' },
  { icon:<IconCash size={22} color="#fff"/>, title:'Pay in ETB', desc:'Cash, Telebirr or card' },
];

function StarRating({ rating, size=12 }) {
  return (
    <span style={{ color:'#D4A843', fontSize:size, display:'inline-flex', alignItems:'center', gap:2 }}>
      <IconStar size={size} fill="#D4A843" color="#D4A843"/> {rating}
    </span>
  );
}

function HotelCard({ h, onClick }) {
  return (
    <div onClick={onClick} style={{ background:'#fff', border:'0.5px solid #C8E6D8', borderRadius:12, overflow:'hidden', cursor:'pointer' }}>
      <div style={{ height:140, overflow:'hidden', position:'relative' }}>
        <img src={h.photo} alt={h.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
        {h.verified && <span style={{ position:'absolute', top:8, left:8, background:'#fff', border:'0.5px solid #52B788', borderRadius:4, padding:'2px 8px', fontSize:9, color:'#1B3A2D', fontWeight:500 }}>Verified</span>}
      </div>
      <div style={{ padding:'10px 12px' }}>
        <div style={{ fontSize:13, fontWeight:500, color:'#1B3A2D', marginBottom:2 }}>{h.name}</div>
        <div style={{ fontSize:10, color:'#4D7A65', marginBottom:5, display:'flex', alignItems:'center', gap:3 }}><IconMapPin size={10}/>{h.city}</div>
        <div style={{ marginBottom:6 }}>{h.amenities.slice(0,3).map(a=><span key={a} style={{ display:'inline-block', background:'#F0F7F4', borderRadius:4, fontSize:9, color:'#1B3A2D', padding:'2px 5px', margin:'1px 2px 1px 0' }}>{a}</span>)}</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:13, fontWeight:500, color:'#1B3A2D' }}>ETB {h.price.toLocaleString()}<span style={{ fontSize:9, fontWeight:400, color:'#4D7A65' }}>/night</span></span>
          <StarRating rating={h.rating}/>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDone, setBookingDone] = useState(null);
  const [searchCity, setSearchCity] = useState('All cities');
  const [searchCat, setSearchCat] = useState('Hotels');
  const [searchGuests, setSearchGuests] = useState('2 guests');
  const [activeCat, setActiveCat] = useState('Hotels');
  const [bookForm, setBookForm] = useState({ name:'', phone:'', checkin:'', checkout:'', guests:'2', payment:'cash', notes:'' });
  const [dbHotels, setDbHotels] = useState([]);
  const [roomGallery, setRoomGallery] = useState(null);
  const [confirmRef, setConfirmRef] = useState(null);

  const navigate = (newPage) => {
    window.history.pushState({ page: newPage }, '', '/' + (newPage === 'home' ? '' : newPage));
    setPage(newPage);
  };

  useEffect(() => {
    const handlePop = (e) => { setPage(e.state?.page || 'home'); };
    window.addEventListener('popstate', handlePop);
    // Handle confirm URLs like /confirm/ABC123
    const path = window.location.pathname;
    if (path.startsWith('/confirm/')) {
      const ref = path.split('/confirm/')[1];
      if (ref) { setConfirmRef(ref); setPage('confirmhotel'); }
    }
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  useEffect(() => {
    fetch('https://ogso-production.up.railway.app/api/businesses?category=hotel')
      .then(r => r.json())
      .then(data => {
        if (data.businesses && data.businesses.length > 0) {
          setDbHotels(data.businesses.map(b => ({
            id: b._id, name: b.name, city: b.city,
            price: b.price || 850, rating: b.rating || 0,
            reviews: b.reviewCount || 0, verified: b.verified,
            amenities: b.amenities && b.amenities.length > 0 ? b.amenities : ['WiFi'],
            photo: b.photos && b.photos.length > 0 ? b.photos[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
            desc: b.description || '',
            suburb: b.suburb || '',
            phone: b.phone || '',
            rooms: b.rooms || []
          })));
        }
      }).catch(() => {});
  }, []);

  const allHotels = [...HOTELS, ...dbHotels];

  const getRooms = (h) => h.rooms && h.rooms.length > 0 ? h.rooms : [
    { type:'standard', name:'Standard Room', price:h.price, beds:'Double bed, AC, en-suite bathroom', popular:false },
    { type:'deluxe', name:'Deluxe Room', price:Math.round(h.price*1.6), beds:'King bed, city view, minibar', popular:true },
    { type:'family', name:'Family Suite', price:Math.round(h.price*2.5), beds:'2 rooms, sleeps 5, kitchenette', popular:false },
  ];

  const nights = () => {
    if (!bookForm.checkin || !bookForm.checkout) return 1;
    const n = Math.ceil((new Date(bookForm.checkout) - new Date(bookForm.checkin)) / 86400000);
    return n > 0 ? n : 1;
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://ogso-production.up.railway.app/api/bookings', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          hotelId: selectedHotel.id,
          businessId: selectedHotel.id,
          hotelName: selectedHotel.name,
          hotelPhone: selectedHotel.phone,
          roomType: selectedRoom.type,
          roomName: selectedRoom.name,
          pricePerNight: selectedRoom.price,
          checkIn: bookForm.checkin,
          checkOut: bookForm.checkout,
          guests: bookForm.guests,
          guestName: bookForm.name,
          guestPhone: bookForm.phone,
          notes: bookForm.notes,
          paymentMethod: bookForm.payment,
        })
      });
      const data = await res.json();
      setBookingDone({ ref: data.booking.ref, hotel: selectedHotel, room: selectedRoom, form: bookForm, nights: nights(), total: selectedRoom.price * nights() });
      navigate('confirm');
    } catch (err) {
      const ref = Math.random().toString(36).substr(2,8).toUpperCase();
      setBookingDone({ ref, hotel: selectedHotel, room: selectedRoom, form: bookForm, nights: nights(), total: selectedRoom.price * nights() });
      navigate('confirm');
    }
  };

  const c = {
    nav:{ background:'#1B3A2D', padding:'0 16px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 },
    logoWrap:{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' },
    logoName:{ fontFamily:'Georgia,serif', fontSize:18, fontWeight:700, color:'#fff', lineHeight:1 },
    logoTag:{ fontSize:8, color:'#52B788', letterSpacing:'.05em' },
    navLinks:{ display:'flex', gap:12, alignItems:'center' },
    navLink:{ fontSize:12, color:'#A8D5BE', background:'none', border:'none', cursor:'pointer' },
    navCta:{ background:'#D4A843', border:'none', borderRadius:8, padding:'6px 12px', fontSize:11, fontWeight:500, color:'#1B3A2D', cursor:'pointer' },
    hero:{ background:'#2D6A4F', padding:'36px 16px', textAlign:'center' },
    h1:{ fontFamily:'Georgia,serif', fontSize:'clamp(20px,5vw,28px)', fontWeight:700, color:'#fff', marginBottom:6 },
    heroSub:{ fontSize:13, color:'#A8D5BE', marginBottom:20 },
    sbox:{ background:'#fff', borderRadius:12, padding:14, maxWidth:560, margin:'0 auto' },
    sgrid:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:8, marginBottom:10 },
    slabel:{ fontSize:10, color:'#4D7A65', marginBottom:3 },
    sinput:{ width:'100%', padding:'8px 10px', border:'0.5px solid #C8E6D8', borderRadius:8, fontSize:12, color:'#1B3A2D' },
    sbtn:{ width:'100%', padding:11, background:'#2D6A4F', border:'none', borderRadius:10, color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 },
    catRow:{ display:'flex', gap:6, padding:'14px 16px 0', overflowX:'auto', scrollbarWidth:'none' },
    cat:{ display:'inline-flex', alignItems:'center', gap:5, border:'0.5px solid #C8E6D8', borderRadius:20, padding:'5px 12px', fontSize:11, color:'#4D7A65', cursor:'pointer', background:'#fff', whiteSpace:'nowrap' },
    catOn:{ background:'#F0F7F4', borderColor:'#2D6A4F', color:'#1B3A2D' },
    sec:{ padding:'16px' },
    stit:{ fontSize:15, fontWeight:500, color:'#1B3A2D', marginBottom:12 },
    grid:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14 },
    goldBanner:{ background:'#FDF3DC', borderTop:'0.5px solid #E8D090', borderBottom:'0.5px solid #E8D090', padding:'16px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 },
    goldBtn:{ background:'#D4A843', border:'none', borderRadius:8, padding:'8px 16px', fontSize:12, fontWeight:500, color:'#1B3A2D', cursor:'pointer' },
    whyGrid:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:10 },
    whyCard:{ background:'#F0F7F4', borderRadius:10, padding:14 },
    whyIcon:{ width:40, height:40, borderRadius:10, background:'#2D6A4F', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 },
    terrGrid:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:8 },
    footer:{ background:'#1B3A2D', padding:'20px 16px', textAlign:'center', fontSize:11, color:'#52B788', marginTop:8 },
    dhero:{ height:220, overflow:'hidden', position:'relative' },
    backBtn:{ position:'absolute', top:10, left:12, background:'rgba(0,0,0,0.4)', border:'none', borderRadius:20, padding:'6px 14px', color:'#fff', fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:4, zIndex:2 },
    rcard:{ border:'0.5px solid #C8E6D8', borderRadius:10, padding:'11px 13px', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', background:'#fff' },
    rcardSel:{ borderColor:'#2D6A4F', background:'#F0F7F4' },
    pbtn:{ width:'100%', padding:12, background:'#2D6A4F', border:'none', borderRadius:10, color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', marginBottom:6, display:'flex', alignItems:'center', justifyContent:'center', gap:6 },
    obtn:{ width:'100%', padding:10, background:'transparent', border:'1px solid #2D6A4F', borderRadius:10, color:'#2D6A4F', fontSize:12, cursor:'pointer' },
    formCard:{ background:'#F8F4EC', borderRadius:12, padding:14, marginBottom:10 },
    formLabel:{ fontSize:11, color:'#4D7A65', marginBottom:3 },
    formInput:{ width:'100%', padding:'9px 11px', border:'0.5px solid #C8E6D8', borderRadius:8, fontSize:13, color:'#1B3A2D', marginBottom:10 },
    radioRow:{ display:'flex', alignItems:'center', gap:8, marginBottom:10, cursor:'pointer' },
    confIcon:{ width:60, height:60, borderRadius:'50%', background:'#F0F7F4', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' },
    confCard:{ background:'#F8F4EC', borderRadius:12, padding:14, margin:'14px 0 10px' },
    confGrid:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:10 },
    waBanner:{ background:'#FDF3DC', border:'0.5px solid #E8D090', borderRadius:10, padding:'10px 13px', display:'flex', gap:10, alignItems:'center', marginBottom:14 },
  };

  const Nav = () => (
    <nav style={c.nav}>
      <div style={c.logoWrap} onClick={()=>navigate('home')}>
        <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
          <circle cx="20" cy="19" r="11" fill="#52B788"/>
          <circle cx="20" cy="19" r="5.5" fill="#1B3A2D"/>
          <line x1="27" y1="26" x2="36" y2="36" stroke="#52B788" strokeWidth="4" strokeLinecap="round"/>
        </svg>
        <div>
          <div style={c.logoName}>ogso</div>
          <div style={c.logoTag}>Every business, verified.</div>
        </div>
      </div>
      <div style={c.navLinks}>
        <button style={c.navLink} onClick={()=>navigate('home')}>Hotels</button>
        <button style={c.navLink} onClick={()=>navigate('home')}>Explore</button>
        <button style={c.navCta} onClick={()=>navigate('list')}>List your business</button>
      </div>
    </nav>
  );

  if (page === 'confirmhotel') return <ConfirmHotelPage bookingRef={confirmRef} onBack={()=>navigate('home')}/>;
  if (page === 'search') return <SearchPage initialCity={searchCity} initialCat={searchCat} onBack={()=>navigate('home')} onSelectHotel={(h)=>{setSelectedHotel(h);setSelectedRoom(getRooms(h)[1]||getRooms(h)[0]);navigate('detail');}}/>;
  if (page === 'list') return <ListPage onBack={()=>navigate('home')}/>;
  if (page === 'admin') return <AdminPage onBack={()=>navigate('home')}/>;

  if (page === 'home') return (
    <div>
      <Nav/>
      <div style={c.hero}>
        <h1 style={c.h1}>Raadi ganacsiga Soomaalida</h1>
        <p style={c.heroSub}>Discover verified hotels, restaurants and businesses across the Somali world</p>
        <div style={c.sbox}>
          <div style={c.sgrid}>
            <div>
              <div style={c.slabel}>Where</div>
              <select style={c.sinput} value={searchCity} onChange={e=>setSearchCity(e.target.value)}>
                {CITIES.map(city=><option key={city}>{city}</option>)}
              </select>
            </div>
            <div>
              <div style={c.slabel}>Category</div>
              <select style={c.sinput} value={searchCat} onChange={e=>setSearchCat(e.target.value)}>
                {CATEGORIES.map(cat=><option key={cat.label}>{cat.label}</option>)}
              </select>
            </div>
            {searchCat === 'Hotels' && (
              <div>
                <div style={c.slabel}>Guests</div>
                <select style={c.sinput} value={searchGuests} onChange={e=>setSearchGuests(e.target.value)}>
                  {['1 guest','2 guests','3 guests','4+'].map(g=><option key={g}>{g}</option>)}
                </select>
              </div>
            )}
            {searchCat === 'Restaurants' && (
              <div>
                <div style={c.slabel}>People</div>
                <select style={c.sinput}>
                  <option>1 person</option><option>2 people</option><option>4 people</option><option>6+</option>
                </select>
              </div>
            )}
            {!['Hotels','Restaurants'].includes(searchCat) && (
              <div>
                <div style={c.slabel}>Open now</div>
                <select style={c.sinput}>
                  <option>Any time</option><option>Open now</option><option>Open today</option>
                </select>
              </div>
            )}
          </div>
          <button style={c.sbtn} onClick={()=>navigate('search')}>
            <IconSearch size={16}/> Search businesses
          </button>
        </div>
      </div>

      <div style={{padding:'16px 16px 0'}}>
        <div style={{fontSize:14,fontWeight:500,color:'#1B3A2D',marginBottom:10}}>Browse by category</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(90px,1fr))',gap:8}}>
          {CATEGORIES.map(cat=>(
            <div key={cat.label}
              onClick={()=>{setActiveCat(cat.label);setSearchCat(cat.label);navigate('search');}}
              style={{background:activeCat===cat.label?'#F0F7F4':'#fff',border:activeCat===cat.label?'0.5px solid #2D6A4F':'0.5px solid #C8E6D8',borderRadius:10,padding:'10px 6px',textAlign:'center',cursor:'pointer'}}>
              <i className={`ti ${cat.icon}`} style={{fontSize:22,color:'#2D6A4F',display:'block',marginBottom:5}}></i>
              <div style={{fontSize:10,color:'#1B3A2D',fontWeight:500,lineHeight:1.3}}>{cat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={c.sec}>
        <div style={c.stit}>Featured hotels in Jigjiga</div>
        <div style={c.grid}>
          {allHotels.map(h=>(
            <HotelCard key={h.id} h={h} onClick={()=>{setSelectedHotel(h);setSelectedRoom(getRooms(h)[1]||getRooms(h)[0]);navigate('detail');}}/>
          ))}
        </div>
      </div>

      <div style={c.goldBanner}>
        <div>
          <div style={{ fontFamily:'Georgia,serif', fontSize:15, fontWeight:700, color:'#1B3A2D' }}>Are you a business owner?</div>
          <div style={{ fontSize:11, color:'#4D7A65', marginTop:2 }}>List your business free and reach thousands of customers</div>
        </div>
        <button style={c.goldBtn} onClick={()=>navigate('list')}>List for free</button>
      </div>

      <div style={{...c.sec, background:'#F8F4EC'}}>
        <div style={c.stit}>Why Ogso?</div>
        <div style={c.whyGrid}>
          {WHY.map(w=>(
            <div key={w.title} style={c.whyCard}>
              <div style={c.whyIcon}>{w.icon}</div>
              <div style={{ fontSize:12, fontWeight:500, color:'#1B3A2D', marginBottom:4 }}>{w.title}</div>
              <div style={{ fontSize:11, color:'#4D7A65', lineHeight:1.5 }}>{w.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={c.sec}>
        <div style={c.stit}>5 territories. 25 million people. One platform.</div>
        <div style={c.terrGrid}>
          {TERRITORIES.map(t=>(
            <div key={t.name} style={{ background:t.active?'#2D6A4F':'#F8F4EC', border:'0.5px solid #C8E6D8', borderRadius:10, padding:12, textAlign:'center' }}>
              <div style={{ fontSize:11, fontWeight:500, color:t.active?'#fff':'#1B3A2D' }}>{t.name}</div>
              <div style={{ fontSize:9, color:t.active?'#A8D5BE':'#4D7A65', marginTop:3 }}>{t.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <footer style={c.footer}>
        2026 Ogso - Every business, verified. - Built for the Somali world
        <span style={{ cursor:'pointer', color:'#1B3A2D', marginLeft:8 }} onClick={()=>{const pwd=prompt('Admin password:');if(pwd==='Ogso2026!')navigate('admin');}}>*</span>
      </footer>
    </div>
  );

  if (page === 'detail' && selectedHotel) return (
    <div>
      <Nav/>
      <div style={c.dhero}>
        <img src={selectedHotel.photo} alt={selectedHotel.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
        <button style={c.backBtn} onClick={()=>navigate('home')}><IconArrowLeft size={13}/> Back</button>
        {selectedHotel.verified && <span style={{ position:'absolute', top:10, right:12, background:'#fff', border:'0.5px solid #52B788', borderRadius:4, padding:'3px 9px', fontSize:10, color:'#1B3A2D', fontWeight:500, zIndex:2 }}>Verified</span>}
      </div>
      <div style={{ padding:'14px 16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
          <div style={{ fontSize:20, fontWeight:500, color:'#1B3A2D', flex:1 }}>{selectedHotel.name}</div>
          <div style={{ textAlign:'right', marginLeft:12 }}>
            <div style={{ fontSize:20, fontWeight:500, color:'#1B3A2D' }}>{selectedHotel.rating}</div>
            <StarRating rating={selectedHotel.rating} size={11}/>
            <div style={{ fontSize:10, color:'#4D7A65' }}>{selectedHotel.reviews} reviews</div>
          </div>
        </div>
        <div style={{ fontSize:11, color:'#4D7A65', marginBottom:12, display:'flex', alignItems:'center', gap:4 }}>
          <IconMapPin size={12}/>{selectedHotel.city} - Somali Region
        </div>
        <div style={{ marginBottom:14 }}>
          {selectedHotel.amenities.map(a=>(
            <span key={a} style={{ display:'inline-flex', alignItems:'center', gap:4, background:'#F0F7F4', borderRadius:20, padding:'4px 10px', fontSize:11, color:'#1B3A2D', margin:'2px 3px 2px 0' }}>{a}</span>
          ))}
        </div>
        <div style={{ fontSize:12, color:'#4D7A65', marginBottom:14, lineHeight:1.6 }}>{selectedHotel.desc}</div>

        <div style={{ fontSize:14, fontWeight:500, color:'#1B3A2D', marginBottom:10 }}>Choose your room</div>
        {getRooms(selectedHotel).map(r=>(
          <div key={r.type} style={{...c.rcard,...(selectedRoom?.type===r.type?{ borderColor:'#2D6A4F', background:'#F0F7F4' }:{})}} onClick={()=>setSelectedRoom(r)}>
            {r.photos && r.photos.length > 0 && (
              <img src={r.photos[0]} alt={r.name}
                onClick={e => { e.stopPropagation(); setRoomGallery({photos: r.photos, name: r.name}); }}
                style={{ width:100, height:75, objectFit:'cover', borderRadius:8, marginRight:12, flexShrink:0, cursor:'zoom-in' }}/>
            )}
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:13, fontWeight:500, color:'#1B3A2D' }}>{r.name}</span>
                {r.popular && <span style={{ background:'#2D6A4F', color:'#fff', fontSize:9, padding:'2px 6px', borderRadius:4 }}>Popular</span>}
              </div>
              <div style={{ fontSize:11, color:'#4D7A65', marginTop:2 }}>{r.beds}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:14, fontWeight:500, color:'#1B3A2D' }}>ETB {r.price.toLocaleString()}</div>
              <div style={{ fontSize:10, color:'#4D7A65' }}>/night</div>
            </div>
          </div>
        ))}

        <ReviewSection hotelId={selectedHotel.id} hotelName={selectedHotel.name}/>

        <button style={{...c.pbtn, marginTop:16}} onClick={()=>navigate('booking')}>
          <IconBrandWhatsapp size={16}/> Book now - confirm via WhatsApp
        </button>
   
      </div>
      <footer style={c.footer}>2026 Ogso - Every business, verified.</footer>
      {roomGallery && <RoomPhotoGallery photos={roomGallery.photos} roomName={roomGallery.name} onClose={() => setRoomGallery(null)}/>}
    </div>
  );

  if (page === 'booking' && selectedHotel) return (
    <div>
      <Nav/>
      <div style={{ maxWidth:600, margin:'0 auto', padding:'20px 16px' }}>
        <h1 style={{ fontFamily:'Georgia,serif', fontSize:20, marginBottom:4, color:'#1B3A2D' }}>Complete your booking</h1>
        <p style={{ fontSize:12, color:'#4D7A65', marginBottom:18 }}>{selectedHotel.name} - {selectedRoom?.name}</p>
        <form onSubmit={handleBook}>
          <div style={c.formCard}>
            <div style={{ fontSize:13, fontWeight:500, color:'#1B3A2D', marginBottom:12 }}>Your stay</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
              <div>
                <div style={c.formLabel}>Check-in</div>
                <input type="date" style={c.formInput} value={bookForm.checkin} onChange={e=>setBookForm({...bookForm,checkin:e.target.value})} required/>
              </div>
              <div>
                <div style={c.formLabel}>Check-out</div>
                <input type="date" style={c.formInput} value={bookForm.checkout} onChange={e=>setBookForm({...bookForm,checkout:e.target.value})} required/>
              </div>
            </div>
            <div style={c.formLabel}>Guests</div>
            <select style={c.formInput} value={bookForm.guests} onChange={e=>setBookForm({...bookForm,guests:e.target.value})}>
              {['1','2','3','4','5','6'].map(n=><option key={n} value={n}>{n} guest{Number(n)>1?'s':''}</option>)}
            </select>
          </div>

          <div style={c.formCard}>
            <div style={{ fontSize:13, fontWeight:500, color:'#1B3A2D', marginBottom:12 }}>Your details</div>
            <div style={c.formLabel}>Full name</div>
            <input style={c.formInput} placeholder="Faadumo Ahmed" value={bookForm.name} onChange={e=>setBookForm({...bookForm,name:e.target.value})} required/>
            <div style={c.formLabel}>WhatsApp number</div>
            <input style={c.formInput} placeholder="+251 9XX XXX XXX" value={bookForm.phone} onChange={e=>setBookForm({...bookForm,phone:e.target.value})} required/>
            <div style={c.formLabel}>Special requests (optional)</div>
            <textarea style={{...c.formInput, resize:'none'}} rows={2} placeholder="Early check-in, ground floor..." value={bookForm.notes} onChange={e=>setBookForm({...bookForm,notes:e.target.value})}/>
          </div>

          <div style={c.formCard}>
            <div style={{ fontSize:13, fontWeight:500, color:'#1B3A2D', marginBottom:12 }}>Payment method</div>
            {[{v:'cash',l:'Cash on arrival'},{v:'telebirr',l:'Telebirr'},{v:'card',l:'Card on arrival'}].map(opt=>(
              <label key={opt.v} style={c.radioRow}>
                <input type="radio" name="payment" value={opt.v} checked={bookForm.payment===opt.v} onChange={()=>setBookForm({...bookForm,payment:opt.v})}/>
                <span style={{ fontSize:13, color:'#1B3A2D' }}>{opt.l}</span>
              </label>
            ))}
          </div>

          <div style={{ background:'#F8F4EC', border:'0.5px solid #C8E6D8', borderRadius:12, padding:14, marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#4D7A65', marginBottom:6 }}>
              <span>ETB {selectedRoom?.price.toLocaleString()} x {nights()} night{nights()>1?'s':''}</span>
              <span>ETB {(selectedRoom?.price*nights()).toLocaleString()}</span>
            </div>
            <div style={{ borderTop:'0.5px solid #C8E6D8', paddingTop:10, display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontWeight:500, color:'#1B3A2D' }}>Total</span>
              <span style={{ fontSize:17, fontWeight:500, color:'#1B3A2D' }}>ETB {(selectedRoom?.price*nights()).toLocaleString()}</span>
            </div>
          </div>

          <button type="submit" style={c.pbtn}>
            <IconBrandWhatsapp size={16}/> Confirm booking via WhatsApp
          </button>
          <button type="button" style={c.obtn} onClick={()=>navigate('detail')}>Back to hotel</button>
        </form>
      </div>
      <footer style={c.footer}>2026 Ogso - Every business, verified.</footer>
    </div>
  );

  if (page === 'confirm' && bookingDone) return (
    <div>
      <Nav/>
      <div style={{ maxWidth:560, margin:'0 auto', padding:'30px 16px' }}>
        <div style={{ textAlign:'center', paddingBottom:18, borderBottom:'0.5px solid #C8E6D8' }}>
          <div style={c.confIcon}><IconCheck size={30} color="#2D6A4F"/></div>
          <h1 style={{ fontFamily:'Georgia,serif', fontSize:22, color:'#1B3A2D', marginBottom:6 }}>Booking confirmed!</h1>
          <p style={{ fontSize:12, color:'#4D7A65' }}>The hotel will contact you on WhatsApp within 2 hours.</p>
        </div>
        <div style={c.confCard}>
          <div style={{ fontSize:10, color:'#4D7A65', marginBottom:4 }}>Booking reference</div>
          <div style={{ fontFamily:'Georgia,serif', fontSize:24, fontWeight:700, letterSpacing:3, color:'#1B3A2D', marginBottom:12 }}>{bookingDone.ref}</div>
          <div style={c.confGrid}>
            <div><div style={{ fontSize:10, color:'#4D7A65', marginBottom:2 }}>Hotel</div><div style={{ fontSize:12, fontWeight:500, color:'#1B3A2D' }}>{bookingDone.hotel.name}</div></div>
            <div><div style={{ fontSize:10, color:'#4D7A65', marginBottom:2 }}>Room</div><div style={{ fontSize:12, fontWeight:500, color:'#1B3A2D' }}>{bookingDone.room.name}</div></div>
            <div><div style={{ fontSize:10, color:'#4D7A65', marginBottom:2 }}>Check-in</div><div style={{ fontSize:12, fontWeight:500, color:'#1B3A2D' }}>{bookingDone.form.checkin||'Not set'}</div></div>
            <div><div style={{ fontSize:10, color:'#4D7A65', marginBottom:2 }}>Check-out</div><div style={{ fontSize:12, fontWeight:500, color:'#1B3A2D' }}>{bookingDone.form.checkout||'Not set'}</div></div>
            <div><div style={{ fontSize:10, color:'#4D7A65', marginBottom:2 }}>Guests</div><div style={{ fontSize:12, fontWeight:500, color:'#1B3A2D' }}>{bookingDone.form.guests} adults</div></div>
            <div><div style={{ fontSize:10, color:'#4D7A65', marginBottom:2 }}>Payment</div><div style={{ fontSize:12, fontWeight:500, color:'#1B3A2D' }}>{bookingDone.form.payment}</div></div>
          </div>
          <div style={{ borderTop:'0.5px solid #C8E6D8', marginTop:12, paddingTop:10, display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:12, color:'#4D7A65' }}>Total ({bookingDone.nights} nights)</span>
            <span style={{ fontSize:16, fontWeight:500, color:'#1B3A2D' }}>ETB {bookingDone.total.toLocaleString()}</span>
          </div>
        </div>
        <div style={c.waBanner}>
          <IconBrandWhatsapp size={22} color="#2D6A4F"/>
          <div style={{ fontSize:12, color:'#1B3A2D', lineHeight:1.5 }}>A WhatsApp confirmation and the hotel's direct number have been sent to {bookingDone.form.phone||'your phone'}.</div>
        </div>
        <button style={c.pbtn} onClick={()=>navigate('home')}>Back to home</button>
        <button style={{...c.obtn, marginTop:8}} onClick={()=>navigate('search')}>Browse more hotels</button>
      </div>
      <footer style={c.footer}>2026 Ogso - Every business, verified.</footer>
    </div>
  );

  return null;
}
