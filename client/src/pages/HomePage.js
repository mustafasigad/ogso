import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconShieldCheck, IconBrandWhatsapp, IconLanguage, IconCash, IconMapPin, IconStar, IconSearch } from '@tabler/icons-react';
import Nav from '../components/Nav';
import { HARDCODED_HOTELS, CATEGORIES, API, DEFAULT_PHOTO, mapDbHotel } from '../shared/data';

const CITIES = ['All cities','Jigjiga','Mogadishu','Hargeisa','Djibouti City','Garissa'];
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

function HotelCard({ h }) {
  const navigate = useNavigate();
  return (
    <div onClick={()=>navigate(`/hotel/${h.id}`)} style={{ background:'#fff', border:'0.5px solid #C8E6D8', borderRadius:12, overflow:'hidden', cursor:'pointer' }}>
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
          <span style={{ color:'#D4A843', fontSize:12, display:'inline-flex', alignItems:'center', gap:2 }}><IconStar size={12} fill="#D4A843" color="#D4A843"/>{h.rating}</span>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState('All cities');
  const [searchCat, setSearchCat] = useState('Hotels');
  const [searchGuests, setSearchGuests] = useState('2 guests');
  const [dbHotels, setDbHotels] = useState([]);

  useEffect(() => {
    fetch(`${API}/businesses?category=hotel`)
      .then(r=>r.json())
      .then(data => { if (data.businesses) setDbHotels(data.businesses.map(mapDbHotel)); })
      .catch(()=>{});
  }, []);

  const allHotels = [...HARDCODED_HOTELS, ...dbHotels.filter(d => !HARDCODED_HOTELS.find(h=>h.name===d.name))];

  const c = {
    hero:{ background:'#2D6A4F', padding:'36px 16px', textAlign:'center' },
    h1:{ fontFamily:'Georgia,serif', fontSize:'clamp(20px,5vw,28px)', fontWeight:700, color:'#fff', marginBottom:6 },
    heroSub:{ fontSize:13, color:'#A8D5BE', marginBottom:20 },
    sbox:{ background:'#fff', borderRadius:12, padding:14, maxWidth:560, margin:'0 auto' },
    sgrid:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:8, marginBottom:10 },
    slabel:{ fontSize:10, color:'#4D7A65', marginBottom:3 },
    sinput:{ width:'100%', padding:'8px 10px', border:'0.5px solid #C8E6D8', borderRadius:8, fontSize:12, color:'#1B3A2D' },
    sbtn:{ width:'100%', padding:11, background:'#2D6A4F', border:'none', borderRadius:10, color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 },
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
  };

  return (
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
          </div>
          <button style={c.sbtn} onClick={()=>navigate(`/search?city=${searchCity}&cat=${searchCat}`)}>
            <IconSearch size={16}/> Search businesses
          </button>
        </div>
      </div>

      <div style={{padding:'16px 16px 0'}}>
        <div style={{fontSize:14,fontWeight:500,color:'#1B3A2D',marginBottom:10}}>Browse by category</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(90px,1fr))',gap:8}}>
          {CATEGORIES.map(cat=>(
            <div key={cat.label}
              onClick={()=>navigate(`/search?cat=${cat.label}`)}
              style={{background:'#fff',border:'0.5px solid #C8E6D8',borderRadius:10,padding:'10px 6px',textAlign:'center',cursor:'pointer'}}>
              <i className={`ti ${cat.icon}`} style={{fontSize:22,color:'#2D6A4F',display:'block',marginBottom:5}}></i>
              <div style={{fontSize:10,color:'#1B3A2D',fontWeight:500,lineHeight:1.3}}>{cat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={c.sec}>
        <div style={c.stit}>Featured hotels in Jigjiga</div>
        <div style={c.grid}>
          {allHotels.map(h=><HotelCard key={h.id} h={h}/>)}
        </div>
      </div>

      <div style={c.goldBanner}>
        <div>
          <div style={{ fontFamily:'Georgia,serif', fontSize:15, fontWeight:700, color:'#1B3A2D' }}>Are you a business owner?</div>
          <div style={{ fontSize:11, color:'#4D7A65', marginTop:2 }}>List your business free and reach thousands of customers</div>
        </div>
        <button style={c.goldBtn} onClick={()=>navigate('/list')}>List for free</button>
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
        <span style={{ cursor:'pointer', color:'#1B3A2D', marginLeft:8 }} onClick={()=>{const pwd=prompt('Admin password:');if(pwd==='Ogso2026!')navigate('/admin');}}>*</span>
      </footer>
    </div>
  );
}
