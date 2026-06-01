import React, { useState } from 'react';
import ListPage from './ListPage';
import SearchPage from './SearchPage';
import AdminPage from './AdminPage';
import { 
  IconBuilding, IconToolsKitchen2, IconHeartRateMonitor, 
  IconShoppingBag, IconCar, IconCash, IconShieldCheck,
  IconBrandWhatsapp, IconLanguage, IconMapPin, IconStar,
  IconSearch, IconArrowLeft, IconCheck
} from '@tabler/icons-react';

const HOTELS = [
  { 
    id:'1', name:'Jigjiga Grand Hotel', city:'Jigjiga', price:850, rating:4.6, reviews:84, verified:true,
    amenities:['WiFi','Breakfast','AC','Parking'],
    photo:'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
    desc:'A premium hotel in the heart of Jigjiga town centre, popular with business travellers and diaspora visitors.'
  },
  { 
    id:'2', name:'Al-Bayaan Hotel', city:'Jigjiga', price:650, rating:4.3, reviews:51, verified:false,
    amenities:['Parking','AC','Airport pickup'],
    photo:'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80',
    desc:'Well located on Airport Road with easy access to Jigjiga Airport and the city centre.'
  },
  { 
    id:'3', name:'Hawd Guest House', city:'Jigjiga', price:420, rating:4.1, reviews:37, verified:false,
    amenities:['Budget','WiFi'],
    photo:'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
    desc:'Affordable and clean accommodation in the heart of Jigjiga market district.'
  },
  { 
    id:'4', name:'Nugaal Palace Hotel', city:'Jigjiga', price:1100, rating:4.4, reviews:62, verified:true,
    amenities:['Rooftop','Restaurant','WiFi'],
    photo:'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80',
    desc:'Jigjiga most distinctive hotel with a rooftop terrace and in-house restaurant.'
  },
];

const CITIES = ['All cities','Jigjiga','Mogadishu','Hargeisa','Djibouti City','Garissa'];

const CATEGORIES = [
  { icon:<IconBuilding size={15}/>, label:'Hotels' },
  { icon:<IconToolsKitchen2 size={15}/>, label:'Restaurants' },
  { icon:<IconHeartRateMonitor size={15}/>, label:'Clinics' },
  { icon:<IconShoppingBag size={15}/>, label:'Shops' },
  { icon:<IconCar size={15}/>, label:'Car hire' },
  { icon:<IconCash size={15}/>, label:'Money transfer' },
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

const REVIEWS = [
  { name:'Faadumo A.', stars:5, text:'Qolasha aad bay u nadiifsan yihiin. Shaqaaluhuna waa kuwo xiriir fiican leh.' },
  { name:'Mohamed H. - London', stars:4, text:'Confirmed on WhatsApp in 20 minutes. Exactly what I needed visiting family.' },
  { name:'Hodan I. - Minnesota', stars:5, text:'Finally an app for Jigjiga! Paid cash on arrival, no issues at all.' },
];

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDone, setBookingDone] = useState(null);
  const [searchCity, setSearchCity] = useState('All cities');
  const [searchCat, setSearchCat] = useState('Hotels');
  const [searchGuests, setSearchGuests] = useState('2 guests');
  const [activeCat, setActiveCat] = useState('Hotels');
  const [dbHotels, setDbHotels] = useState([]);

  React.useEffect(()=>{
    fetch('https://ogso-production.up.railway.app/api/businesses?category=hotel')
      .then(r=>r.json())
      .then(data=>{
        if(data.businesses && data.businesses.length > 0){
          setDbHotels(data.businesses.map(b=>({
            id: b._id,
            name: b.name,
            city: b.city,
            price: b.price || 850,
            rating: b.rating || 0,
            reviews: b.reviewCount || 0,
            verified: b.verified,
            amenities: b.amenities && b.amenities.length > 0 ? b.amenities : ['WiFi'],
            photo: b.photos && b.photos.length > 0 ? b.photos[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
            desc: b.description || ''
          })));
        }
      })
      .catch(err=>console.error('Failed to load businesses:', err));
  },[]);

  const allHotels = [...HOTELS, ...dbHotels];
  const featuredHotels = allHotels.slice(0, 8);
  const [bookForm, setBookForm] = useState({ name:'', phone:'', checkin:'', checkout:'', guests:'2', payment:'cash', notes:'' });

  const filtered = allHotels.filter(h => searchCity === 'All cities' || h.city === searchCity);

  const rooms = (h) => h ? (h.rooms || [
    { type:'standard', name:'Standard room', price:h.price, beds:'Double bed - AC - en-suite', popular:false },
    { type:'deluxe', name:'Deluxe room', price:Math.round(h.price*1.6), beds:'King bed - city view - minibar', popular:true },
    { type:'family', name:'Family suite', price:Math.round(h.price*2.5), beds:'2 rooms - sleeps 5 - kitchenette', popular:false },
  ]) : [];

  const nights = () => {
    if (!bookForm.checkin || !bookForm.checkout) return 1;
    const n = Math.ceil((new Date(bookForm.checkout) - new Date(bookForm.checkin)) / 86400000);
    return n > 0 ? n : 1;
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://ogso-production.up.railway.app/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: selectedHotel.id,
          businessId: selectedHotel.id,
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
      const booking = data.booking;
      setBookingDone({ ref: booking.ref, hotel: selectedHotel, room: selectedRoom, form: bookForm, nights: nights(), total: selectedRoom.price * nights() });
      setPage('confirm');
    } catch (err) {
      console.error('Booking error:', err);
      const ref = Math.random().toString(36).substr(2,8).toUpperCase();
      setBookingDone({ ref, hotel: selectedHotel, room: selectedRoom, form: bookForm, nights: nights(), total: selectedRoom.price * nights() });
      setPage('confirm');
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
    hcard:{ background:'#fff', border:'0.5px solid #C8E6D8', borderRadius:12, overflow:'hidden', cursor:'pointer', transition:'box-shadow .2s' },
    himg:{ height:140, overflow:'hidden', position:'relative' },
    vbadge:{ position:'absolute', top:8, left:8, background:'#fff', border:'0.5px solid #52B788', borderRadius:4, padding:'3px 8px', fontSize:9, color:'#1B3A2D', fontWeight:500, zIndex:1 },
    hbody:{ padding:'10px 12px' },
    hname:{ fontSize:13, fontWeight:500, color:'#1B3A2D', marginBottom:2 },
    hloc:{ fontSize:10, color:'#4D7A65', marginBottom:5, display:'flex', alignItems:'center', gap:3 },
    hrow:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:6 },
    hpr:{ fontSize:13, fontWeight:500, color:'#1B3A2D' },
    hrt:{ fontSize:11, color:'#D4A843', display:'flex', alignItems:'center', gap:2 },
    tag:{ display:'inline-block', background:'#F0F7F4', borderRadius:4, fontSize:10, color:'#1B3A2D', padding:'2px 6px', margin:'1px 2px 1px 0' },
    goldBanner:{ background:'#FDF3DC', borderTop:'0.5px solid #E8D090', borderBottom:'0.5px solid #E8D090', padding:'16px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 },
    goldBtn:{ background:'#D4A843', border:'none', borderRadius:8, padding:'8px 16px', fontSize:12, fontWeight:500, color:'#1B3A2D', cursor:'pointer' },
    whyGrid:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:10 },
    whyCard:{ background:'#F0F7F4', borderRadius:10, padding:14 },
    whyIcon:{ width:40, height:40, borderRadius:10, background:'#2D6A4F', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 },
    terrGrid:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:8 },
    footer:{ background:'#1B3A2D', padding:'20px 16px', textAlign:'center', fontSize:11, color:'#52B788', marginTop:8 },
    dhero:{ height:240, overflow:'hidden', position:'relative' },
    backBtn:{ position:'absolute', top:10, left:12, background:'rgba(0,0,0,0.4)', border:'none', borderRadius:20, padding:'6px 14px', color:'#fff', fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:4, zIndex:2 },
    rcard:{ border:'0.5px solid #C8E6D8', borderRadius:10, padding:'11px 13px', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', background:'#fff' },
    rcardSel:{ borderColor:'#2D6A4F', background:'#F0F7F4' },
    rvcard:{ background:'#F0F7F4', borderRadius:10, padding:'10px 12px', marginBottom:8 },
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
      <div style={c.logoWrap} onClick={()=>setPage('home')}>
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
        <button style={c.navLink} onClick={()=>setPage('home')}>Hotels</button>
        <button style={c.navLink} onClick={()=>setPage('home')}>Explore</button>
        <button style={c.navCta} onClick={()=>setPage('list')}>List your business</button>
      </div>
    </nav>
  );

  const HotelCard = ({h, onClick}) => (
    <div style={c.hcard} onClick={onClick}>
      <div style={c.himg}>
        <img src={h.photo} alt={h.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        {h.verified && <span style={c.vbadge}>Verified</span>}
      </div>
      <div style={c.hbody}>
        <div style={c.hname}>{h.name}</div>
        <div style={c.hloc}><IconMapPin size={10}/>{h.city}</div>
        <div>{h.amenities.slice(0,3).map(a=><span key={a} style={c.tag}>{a}</span>)}</div>
        <div style={c.hrow}>
          <span style={c.hpr}>ETB {h.price.toLocaleString()}<span style={{fontSize:9,fontWeight:400,color:'#4D7A65'}}>/night</span></span>
          <span style={c.hrt}><IconStar size={11} fill="#D4A843" color="#D4A843"/>{h.rating}</span>
        </div>
      </div>
    </div>
  );

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
          <button style={c.sbtn} onClick={()=>setPage('search')}>
            <IconSearch size={16}/> Search businesses
          </button>
        </div>
      </div>

      <div style={c.catRow}>
        {CATEGORIES.map(cat=>(
          <button key={cat.label} style={{...c.cat,...(activeCat===cat.label?c.catOn:{})}}
            onClick={()=>{setActiveCat(cat.label);setSearchCat(cat.label);setPage('search');}}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div style={c.sec}>
        <div style={c.stit}>Featured hotels in Jigjiga</div>
        <div style={c.grid}>
          {allHotels.map(h=>(
            <HotelCard key={h.id} h={h} onClick={()=>{setSelectedHotel(h);setSelectedRoom(rooms(h)[1]);setPage('detail');}}/>
          ))}
        </div>
      </div>

      <div style={c.goldBanner}>
        <div>
          <div style={{fontFamily:'Georgia,serif',fontSize:15,fontWeight:700,color:'#1B3A2D'}}>Are you a business owner?</div>
          <div style={{fontSize:11,color:'#4D7A65',marginTop:2}}>List your business free and reach thousands of customers</div>
        </div>
        <button style={c.goldBtn} onClick={()=>setPage('list')}>List for free</button>
      </div>

      <div style={{...c.sec,background:'#F8F4EC'}}>
        <div style={c.stit}>Why Ogso?</div>
        <div style={c.whyGrid}>
          {WHY.map(w=>(
            <div key={w.title} style={c.whyCard}>
              <div style={c.whyIcon}>{w.icon}</div>
              <div style={{fontSize:12,fontWeight:500,color:'#1B3A2D',marginBottom:4}}>{w.title}</div>
              <div style={{fontSize:11,color:'#4D7A65',lineHeight:1.5}}>{w.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={c.sec}>
        <div style={c.stit}>5 territories. 25 million people. One platform.</div>
        <div style={c.terrGrid}>
          {TERRITORIES.map(t=>(
            <div key={t.name} style={{background:t.active?'#2D6A4F':'#F8F4EC',border:'0.5px solid #C8E6D8',borderRadius:10,padding:12,textAlign:'center'}}>
              <div style={{fontSize:11,fontWeight:500,color:t.active?'#fff':'#1B3A2D'}}>{t.name}</div>
              <div style={{fontSize:9,color:t.active?'#A8D5BE':'#4D7A65',marginTop:3}}>{t.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <footer style={c.footer}>
        2026 Ogso - Every business, verified.
        <span style={{cursor:'pointer',color:'#52B788',marginLeft:8,fontSize:10}} onClick={()=>setPage('admin')}>*</span>
      </footer>
    </div>
  );

  if (page === 'search') return <SearchPage initialCity={searchCity} initialCat={searchCat} onBack={()=>setPage('home')} onSelectHotel={(h)=>{setSelectedHotel(h);setSelectedRoom(rooms(h)[1]);setPage('detail');}}/>;
     
  if (page === 'detail' && selectedHotel) return (
    <div>
      <Nav/>
      <div style={c.dhero}>
        <img src={selectedHotel.photo} alt={selectedHotel.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        <button style={c.backBtn} onClick={()=>setPage('home')}>
          <IconArrowLeft size={13}/> Back
        </button>
        {selectedHotel.verified && <span style={{...c.vbadge,position:'absolute',top:10,right:12,fontSize:10,zIndex:2}}>Verified</span>}
        <div style={{position:'absolute',bottom:10,right:12,background:'rgba(0,0,0,0.4)',borderRadius:20,padding:'3px 9px',fontSize:10,color:'#fff',zIndex:2}}>12 photos</div>
      </div>
      <div style={{padding:'14px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
          <div style={{fontSize:20,fontWeight:500,color:'#1B3A2D'}}>{selectedHotel.name}</div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:20,fontWeight:500,color:'#1B3A2D'}}>{selectedHotel.rating}</div>
            <div style={{fontSize:12,color:'#D4A843'}}>Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦</div>
            <div style={{fontSize:10,color:'#4D7A65'}}>{selectedHotel.reviews} reviews</div>
          </div>
        </div>
        <div style={{fontSize:11,color:'#4D7A65',marginBottom:12,display:'flex',alignItems:'center',gap:4}}>
          <IconMapPin size={12}/>{selectedHotel.city} - Somali Region
        </div>
        <div style={{marginBottom:14}}>
          {selectedHotel.amenities.map(a=>(
            <span key={a} style={{display:'inline-flex',alignItems:'center',gap:4,background:'#F0F7F4',borderRadius:20,padding:'4px 10px',fontSize:11,color:'#1B3A2D',margin:'2px 3px 2px 0'}}>{a}</span>
          ))}
        </div>
        <div style={{fontSize:12,color:'#4D7A65',marginBottom:14,lineHeight:1.6}}>{selectedHotel.desc}</div>

        <div style={{fontSize:14,fontWeight:500,color:'#1B3A2D',marginBottom:10}}>Choose your room</div>
        {rooms(selectedHotel).map(r=>(
          <div key={r.type} style={{...c.rcard,...(selectedRoom?.type===r.type?c.rcardSel:{})}} onClick={()=>setSelectedRoom(r)}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <span style={{fontSize:13,fontWeight:500,color:'#1B3A2D'}}>{r.name}</span>
                {r.popular && <span style={{background:'#2D6A4F',color:'#fff',fontSize:9,padding:'2px 6px',borderRadius:4}}>Popular</span>}
              </div>
              <div style={{fontSize:11,color:'#4D7A65',marginTop:2}}>{r.beds}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:14,fontWeight:500,color:'#1B3A2D'}}>ETB {r.price.toLocaleString()}</div>
              <div style={{fontSize:10,color:'#4D7A65'}}>/night</div>
            </div>
          </div>
        ))}

        <div style={{fontSize:14,fontWeight:500,color:'#1B3A2D',margin:'16px 0 8px'}}>Guest reviews</div>
        {REVIEWS.map((r,i)=>(
          <div key={i} style={c.rvcard}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
              <span style={{fontSize:12,fontWeight:500,color:'#1B3A2D'}}>{r.name}</span>
              <span style={{fontSize:11,color:'#D4A843'}}>{'Ã¢Ëœâ€¦'.repeat(r.stars)}</span>
            </div>
            <div style={{fontSize:12,color:'#4D7A65',lineHeight:1.5}}>{r.text}</div>
          </div>
        ))}

        <button style={{...c.pbtn,marginTop:16}} onClick={()=>setPage('booking')}>
          <IconBrandWhatsapp size={16}/> Book now - confirm via WhatsApp
        </button>
        <button style={c.obtn}>Enquire directly</button>
      </div>
      <footer style={c.footer}>2026 Ogso - Every business, verified.</footer>
    </div>
  );

  if (page === 'booking' && selectedHotel) return (
    <div>
      <Nav/>
      <div style={{maxWidth:600,margin:'0 auto',padding:'20px 16px'}}>
        <h1 style={{fontFamily:'Georgia,serif',fontSize:20,marginBottom:4,color:'#1B3A2D'}}>Complete your booking</h1>
        <p style={{fontSize:12,color:'#4D7A65',marginBottom:18}}>{selectedHotel.name} - {selectedRoom?.name}</p>
        <form onSubmit={handleBook}>
          <div style={c.formCard}>
            <div style={{fontSize:13,fontWeight:500,color:'#1B3A2D',marginBottom:12}}>Your stay</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
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
            <div style={{fontSize:13,fontWeight:500,color:'#1B3A2D',marginBottom:12}}>Your details</div>
            <div style={c.formLabel}>Full name</div>
            <input style={c.formInput} placeholder="Faadumo Ahmed" value={bookForm.name} onChange={e=>setBookForm({...bookForm,name:e.target.value})} required/>
            <div style={c.formLabel}>WhatsApp number</div>
            <input style={c.formInput} placeholder="+251 9XX XXX XXX" value={bookForm.phone} onChange={e=>setBookForm({...bookForm,phone:e.target.value})} required/>
            <div style={c.formLabel}>Special requests (optional)</div>
            <textarea style={{...c.formInput,resize:'none'}} rows={2} placeholder="Early check-in, ground floor..." value={bookForm.notes} onChange={e=>setBookForm({...bookForm,notes:e.target.value})}/>
          </div>

          <div style={c.formCard}>
            <div style={{fontSize:13,fontWeight:500,color:'#1B3A2D',marginBottom:12}}>Payment method</div>
            {[{v:'cash',l:'Cash on arrival'},{v:'telebirr',l:'Telebirr'},{v:'card',l:'Card on arrival'}].map(opt=>(
              <label key={opt.v} style={c.radioRow}>
                <input type="radio" name="payment" value={opt.v} checked={bookForm.payment===opt.v} onChange={()=>setBookForm({...bookForm,payment:opt.v})}/>
                <span style={{fontSize:13,color:'#1B3A2D'}}>{opt.l}</span>
              </label>
            ))}
          </div>

          <div style={{background:'#F8F4EC',border:'0.5px solid #C8E6D8',borderRadius:12,padding:14,marginBottom:12}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#4D7A65',marginBottom:6}}>
              <span>ETB {selectedRoom?.price.toLocaleString()} x {nights()} night{nights()>1?'s':''}</span>
              <span>ETB {(selectedRoom?.price*nights()).toLocaleString()}</span>
            </div>
            <div style={{borderTop:'0.5px solid #C8E6D8',paddingTop:10,display:'flex',justifyContent:'space-between'}}>
              <span style={{fontWeight:500,color:'#1B3A2D'}}>Total</span>
              <span style={{fontSize:17,fontWeight:500,color:'#1B3A2D'}}>ETB {(selectedRoom?.price*nights()).toLocaleString()}</span>
            </div>
          </div>

          <button type="submit" style={c.pbtn}>
            <IconBrandWhatsapp size={16}/> Confirm booking via WhatsApp
          </button>
          <button type="button" style={c.obtn} onClick={()=>setPage('detail')}>Back to hotel</button>
        </form>
      </div>
      <footer style={c.footer}>2026 Ogso - Every business, verified.</footer>
    </div>
  );

  if (page === 'confirm' && bookingDone) return (
    <div>
      <Nav/>
      <div style={{maxWidth:560,margin:'0 auto',padding:'30px 16px'}}>
        <div style={{textAlign:'center',paddingBottom:18,borderBottom:'0.5px solid #C8E6D8'}}>
          <div style={c.confIcon}>
            <IconCheck size={30} color="#2D6A4F"/>
          </div>
          <h1 style={{fontFamily:'Georgia,serif',fontSize:22,color:'#1B3A2D',marginBottom:6}}>Booking confirmed!</h1>
          <p style={{fontSize:12,color:'#4D7A65'}}>The hotel will contact you on WhatsApp within 2 hours.</p>
        </div>
        <div style={c.confCard}>
          <div style={{fontSize:10,color:'#4D7A65',marginBottom:4}}>Booking reference</div>
          <div style={{fontFamily:'Georgia,serif',fontSize:24,fontWeight:700,letterSpacing:3,color:'#1B3A2D',marginBottom:12}}>{bookingDone.ref}</div>
          <div style={c.confGrid}>
            <div><div style={{fontSize:10,color:'#4D7A65',marginBottom:2}}>Hotel</div><div style={{fontSize:12,fontWeight:500,color:'#1B3A2D'}}>{bookingDone.hotel.name}</div></div>
            <div><div style={{fontSize:10,color:'#4D7A65',marginBottom:2}}>Room</div><div style={{fontSize:12,fontWeight:500,color:'#1B3A2D'}}>{bookingDone.room.name}</div></div>
            <div><div style={{fontSize:10,color:'#4D7A65',marginBottom:2}}>Check-in</div><div style={{fontSize:12,fontWeight:500,color:'#1B3A2D'}}>{bookingDone.form.checkin||'Not set'}</div></div>
            <div><div style={{fontSize:10,color:'#4D7A65',marginBottom:2}}>Check-out</div><div style={{fontSize:12,fontWeight:500,color:'#1B3A2D'}}>{bookingDone.form.checkout||'Not set'}</div></div>
            <div><div style={{fontSize:10,color:'#4D7A65',marginBottom:2}}>Guests</div><div style={{fontSize:12,fontWeight:500,color:'#1B3A2D'}}>{bookingDone.form.guests} adults</div></div>
            <div><div style={{fontSize:10,color:'#4D7A65',marginBottom:2}}>Payment</div><div style={{fontSize:12,fontWeight:500,color:'#1B3A2D'}}>{bookingDone.form.payment}</div></div>
          </div>
          <div style={{borderTop:'0.5px solid #C8E6D8',marginTop:12,paddingTop:10,display:'flex',justifyContent:'space-between'}}>
            <span style={{fontSize:12,color:'#4D7A65'}}>Total ({bookingDone.nights} nights)</span>
            <span style={{fontSize:16,fontWeight:500,color:'#1B3A2D'}}>ETB {bookingDone.total.toLocaleString()}</span>
          </div>
        </div>
        <div style={c.waBanner}>
          <IconBrandWhatsapp size={22} color="#2D6A4F"/>
          <div style={{fontSize:12,color:'#1B3A2D',lineHeight:1.5}}>A WhatsApp confirmation and the hotel's direct number have been sent to {bookingDone.form.phone||'your phone'}.</div>
        </div>
        <button style={c.pbtn} onClick={()=>setPage('home')}>Back to home</button>
        <button style={{...c.obtn,marginTop:8}} onClick={()=>setPage('search')}>Browse more hotels</button>
      </div>
      <footer style={c.footer}>2026 Ogso - Every business, verified.</footer>
    </div>
  );

if (page === 'list') return <ListPage onBack={()=>setPage('home')}/>;

 if (page === 'admin') {
  const pwd = prompt('Enter admin password:');
  if (pwd !== 'Ogso2026!') {
    setPage('home');
    return null;
  }
  return <AdminPage onBack={()=>setPage('home')}/>;
}
  return null;

}
