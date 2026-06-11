import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconCheck, IconBrandWhatsapp } from '@tabler/icons-react';
import Nav from '../components/Nav';

export default function BookingConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ref, hotel, room, form, nights, total } = location.state || {};

  if (!ref) { navigate('/'); return null; }

  const c = {
    confIcon:{ width:60, height:60, borderRadius:'50%', background:'#F0F7F4', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' },
    confCard:{ background:'#F8F4EC', borderRadius:12, padding:14, margin:'14px 0 10px' },
    confGrid:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:10 },
    waBanner:{ background:'#FDF3DC', border:'0.5px solid #E8D090', borderRadius:10, padding:'10px 13px', display:'flex', gap:10, alignItems:'center', marginBottom:14 },
    pbtn:{ width:'100%', padding:12, background:'#2D6A4F', border:'none', borderRadius:10, color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', marginBottom:6 },
    obtn:{ width:'100%', padding:10, background:'transparent', border:'1px solid #2D6A4F', borderRadius:10, color:'#2D6A4F', fontSize:12, cursor:'pointer' },
    footer:{ background:'#1B3A2D', padding:'20px 16px', textAlign:'center', fontSize:11, color:'#52B788', marginTop:8 },
  };

  return (
    <div>
      <Nav/>
      <div style={{ maxWidth:560, margin:'0 auto', padding:'30px 16px' }}>
        <div style={{ textAlign:'center', paddingBottom:18, borderBottom:'0.5px solid #C8E6D8' }}>
          <div style={c.confIcon}><IconCheck size={30} color="#2D6A4F"/></div>
          <h1 style={{ fontFamily:'Georgia,serif', fontSize:22, color:'#1B3A2D', marginBottom:6 }}>Booking confirmed!</h1>
          <p style={{ fontSize:12, color:'#4D7A65' }}>The hotel will confirm via WhatsApp within 2 hours.</p>
        </div>
        <div style={c.confCard}>
          <div style={{ fontSize:10, color:'#4D7A65', marginBottom:4 }}>Booking reference</div>
          <div style={{ fontFamily:'Georgia,serif', fontSize:24, fontWeight:700, letterSpacing:3, color:'#1B3A2D', marginBottom:12 }}>{ref}</div>
          <div style={c.confGrid}>
            <div><div style={{ fontSize:10, color:'#4D7A65', marginBottom:2 }}>Hotel</div><div style={{ fontSize:12, fontWeight:500, color:'#1B3A2D' }}>{hotel?.name}</div></div>
            <div><div style={{ fontSize:10, color:'#4D7A65', marginBottom:2 }}>Room</div><div style={{ fontSize:12, fontWeight:500, color:'#1B3A2D' }}>{room?.name}</div></div>
            <div><div style={{ fontSize:10, color:'#4D7A65', marginBottom:2 }}>Check-in</div><div style={{ fontSize:12, fontWeight:500, color:'#1B3A2D' }}>{form?.checkin||'Not set'}</div></div>
            <div><div style={{ fontSize:10, color:'#4D7A65', marginBottom:2 }}>Check-out</div><div style={{ fontSize:12, fontWeight:500, color:'#1B3A2D' }}>{form?.checkout||'Not set'}</div></div>
            <div><div style={{ fontSize:10, color:'#4D7A65', marginBottom:2 }}>Guests</div><div style={{ fontSize:12, fontWeight:500, color:'#1B3A2D' }}>{form?.guests} adults</div></div>
            <div><div style={{ fontSize:10, color:'#4D7A65', marginBottom:2 }}>Payment</div><div style={{ fontSize:12, fontWeight:500, color:'#1B3A2D' }}>{form?.payment}</div></div>
          </div>
          <div style={{ borderTop:'0.5px solid #C8E6D8', marginTop:12, paddingTop:10, display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:12, color:'#4D7A65' }}>Total ({nights} nights)</span>
            <span style={{ fontSize:16, fontWeight:500, color:'#1B3A2D' }}>ETB {total?.toLocaleString()}</span>
          </div>
        </div>
        <div style={c.waBanner}>
          <IconBrandWhatsapp size={22} color="#2D6A4F"/>
          <div style={{ fontSize:12, color:'#1B3A2D', lineHeight:1.5 }}>A WhatsApp confirmation has been sent to {form?.phone||'your phone'}.</div>
        </div>
        <button style={c.pbtn} onClick={()=>navigate('/')}>Back to home</button>
        <button style={{...c.obtn, marginTop:8}} onClick={()=>navigate('/search')}>Browse more hotels</button>
      </div>
      <footer style={c.footer}>2026 Ogso - Every business, verified.</footer>
    </div>
  );
}
