import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Nav() {
  const navigate = useNavigate();
  const c = {
    nav:{ background:'#1B3A2D', padding:'0 16px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 },
    logoWrap:{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' },
    logoName:{ fontFamily:'Georgia,serif', fontSize:18, fontWeight:700, color:'#fff', lineHeight:1 },
    logoTag:{ fontSize:8, color:'#52B788', letterSpacing:'.05em' },
    navLinks:{ display:'flex', gap:12, alignItems:'center' },
    navLink:{ fontSize:12, color:'#A8D5BE', background:'none', border:'none', cursor:'pointer' },
    navCta:{ background:'#D4A843', border:'none', borderRadius:8, padding:'6px 12px', fontSize:11, fontWeight:500, color:'#1B3A2D', cursor:'pointer' },
  };
  return (
    <nav style={c.nav}>
      <div style={c.logoWrap} onClick={()=>navigate('/')}>
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
        <button style={c.navLink} onClick={()=>navigate('/')}>Hotels</button>
        <button style={c.navLink} onClick={()=>navigate('/search')}>Explore</button>
        <button style={c.navCta} onClick={()=>navigate('/list')}>List your business</button>
      </div>
    </nav>
  );
}
