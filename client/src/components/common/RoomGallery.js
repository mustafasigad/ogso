import React, { useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';

export default function PhotoGallery({ photos, hotelName }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!photos || photos.length === 0) return null;

  const prev = () => setCurrent(i => (i - 1 + photos.length) % photos.length);
  const next = () => setCurrent(i => (i + 1) % photos.length);

  return (
    <>
      {/* Main photo with navigation */}
      <div style={{ position:'relative', height:220, overflow:'hidden', cursor:'pointer' }} onClick={() => setLightbox(true)}>
        <img src={photos[current]} alt={hotelName}
          style={{ width:'100%', height:'100%', objectFit:'cover', transition:'opacity 0.3s' }}/>
        
        {/* Navigation arrows */}
        {photos.length > 1 && (
          <>
            <button onClick={e => { e.stopPropagation(); prev(); }}
              style={{ position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.4)', border:'none', borderRadius:'50%', width:32, height:32, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <IconChevronLeft size={18}/>
            </button>
            <button onClick={e => { e.stopPropagation(); next(); }}
              style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.4)', border:'none', borderRadius:'50%', width:32, height:32, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <IconChevronRight size={18}/>
            </button>
          </>
        )}

        {/* Photo counter */}
        {photos.length > 1 && (
          <div style={{ position:'absolute', bottom:8, right:8, background:'rgba(0,0,0,0.5)', borderRadius:12, padding:'2px 8px', fontSize:11, color:'#fff' }}>
            {current + 1} / {photos.length}
          </div>
        )}

        {/* Thumbnail strip */}
        {photos.length > 1 && (
          <div style={{ position:'absolute', bottom:8, left:8, display:'flex', gap:4 }}>
            {photos.slice(0,5).map((_, i) => (
              <div key={i} onClick={e => { e.stopPropagation(); setCurrent(i); }}
                style={{ width:6, height:6, borderRadius:'50%', background: i===current ? '#fff' : 'rgba(255,255,255,0.5)', cursor:'pointer' }}/>
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail row */}
      {photos.length > 1 && (
        <div style={{ display:'flex', gap:4, padding:'4px 0', overflowX:'auto', scrollbarWidth:'none' }}>
          {photos.map((url, i) => (
            <img key={i} src={url} alt="" onClick={() => setCurrent(i)}
              style={{ width:60, height:45, objectFit:'cover', borderRadius:6, cursor:'pointer', border: i===current ? '2px solid #2D6A4F' : '2px solid transparent', flexShrink:0 }}/>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center' }}
          onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)}
            style={{ position:'absolute', top:16, right:16, background:'rgba(255,255,255,0.2)', border:'none', borderRadius:'50%', width:36, height:36, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <IconX size={20}/>
          </button>
          {photos.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prev(); }}
                style={{ position:'absolute', left:16, background:'rgba(255,255,255,0.2)', border:'none', borderRadius:'50%', width:40, height:40, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <IconChevronLeft size={22}/>
              </button>
              <button onClick={e => { e.stopPropagation(); next(); }}
                style={{ position:'absolute', right:16, background:'rgba(255,255,255,0.2)', border:'none', borderRadius:'50%', width:40, height:40, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <IconChevronRight size={22}/>
              </button>
            </>
          )}
          <img src={photos[current]} alt={hotelName}
            style={{ maxWidth:'90vw', maxHeight:'85vh', objectFit:'contain', borderRadius:8 }}
            onClick={e => e.stopPropagation()}/>
          <div style={{ position:'absolute', bottom:16, color:'rgba(255,255,255,0.7)', fontSize:13 }}>
            {current + 1} / {photos.length} — tap outside to close
          </div>
        </div>
      )}
    </>
  );
}
