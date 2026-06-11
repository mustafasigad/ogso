import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconMapPin, IconStar, IconBrandWhatsapp, IconArrowLeft } from '@tabler/icons-react';
import Nav from '../components/Nav';
import ReviewSection from '../components/common/ReviewSection';
import { RoomPhotoGallery } from '../components/common/RoomPhotoUploadMulti';
import { HARDCODED_HOTELS, API, DEFAULT_PHOTO, mapDbHotel, getDefaultRooms } from '../shared/data';

export default function HotelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roomGallery, setRoomGallery] = useState(null);

  useEffect(() => {
    // Check hardcoded hotels first
    const hardcoded = HARDCODED_HOTELS.find(h => h.id === id);
    if (hardcoded) {
      setHotel(hardcoded);
      const rooms = hardcoded.rooms || getDefaultRooms(hardcoded);
      setSelectedRoom(rooms[1] || rooms[0]);
      setLoading(false);
      return;
    }
    // Fetch from DB
    fetch(`${API}/businesses/${id}`)
      .then(r => r.json())
      .then(data => {
        const h = mapDbHotel(data);
        setHotel(h);
        const rooms = h.rooms && h.rooms.length > 0 ? h.rooms : getDefaultRooms(h);
        setSelectedRoom(rooms[1] || rooms[0]);
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, [id]);

  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#4D7A65' }}>Loading...</div>;
  if (!hotel) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#C00' }}>Hotel not found</div>;

  const rooms = hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms : getDefaultRooms(hotel);

  const c = {
    dhero:{ height:220, overflow:'hidden', position:'relative' },
    backBtn:{ position:'absolute', top:10, left:12, background:'rgba(0,0,0,0.4)', border:'none', borderRadius:20, padding:'6px 14px', color:'#fff', fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:4, zIndex:2 },
    rcard:{ border:'0.5px solid #C8E6D8', borderRadius:10, padding:'11px 13px', marginBottom:8, display:'flex', alignItems:'center', cursor:'pointer', background:'#fff' },
    pbtn:{ width:'100%', padding:12, background:'#2D6A4F', border:'none', borderRadius:10, color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', marginBottom:6, display:'flex', alignItems:'center', justifyContent:'center', gap:6 },
    footer:{ background:'#1B3A2D', padding:'20px 16px', textAlign:'center', fontSize:11, color:'#52B788', marginTop:8 },
  };

  return (
    <div>
      <Nav/>
      <div style={c.dhero}>
        <img src={hotel.photo || DEFAULT_PHOTO} alt={hotel.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
        <button style={c.backBtn} onClick={()=>navigate(-1)}><IconArrowLeft size={13}/> Back</button>
        {hotel.verified && <span style={{ position:'absolute', top:10, right:12, background:'#fff', border:'0.5px solid #52B788', borderRadius:4, padding:'3px 9px', fontSize:10, color:'#1B3A2D', fontWeight:500, zIndex:2 }}>Verified</span>}
      </div>

      <div style={{ padding:'14px 16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
          <div style={{ fontSize:20, fontWeight:500, color:'#1B3A2D', flex:1 }}>{hotel.name}</div>
          <div style={{ textAlign:'right', marginLeft:12 }}>
            <div style={{ fontSize:20, fontWeight:500, color:'#1B3A2D' }}>{hotel.rating}</div>
            <span style={{ color:'#D4A843', fontSize:11, display:'inline-flex', alignItems:'center', gap:2 }}><IconStar size={11} fill="#D4A843" color="#D4A843"/>{hotel.rating}</span>
            <div style={{ fontSize:10, color:'#4D7A65' }}>{hotel.reviews} reviews</div>
          </div>
        </div>

        <div style={{ fontSize:11, color:'#4D7A65', marginBottom:12, display:'flex', alignItems:'center', gap:4 }}>
          <IconMapPin size={12}/>{hotel.suburb ? `${hotel.suburb}, ` : ''}{hotel.city} - Somali Region
        </div>

        <div style={{ marginBottom:14 }}>
          {hotel.amenities.map(a=>(
            <span key={a} style={{ display:'inline-flex', alignItems:'center', gap:4, background:'#F0F7F4', borderRadius:20, padding:'4px 10px', fontSize:11, color:'#1B3A2D', margin:'2px 3px 2px 0' }}>{a}</span>
          ))}
        </div>

        <div style={{ fontSize:12, color:'#4D7A65', marginBottom:14, lineHeight:1.6 }}>{hotel.desc}</div>

        <div style={{ fontSize:14, fontWeight:500, color:'#1B3A2D', marginBottom:10 }}>Choose your room</div>
        {rooms.map(r=>(
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

        <ReviewSection hotelId={hotel.id} hotelName={hotel.name}/>

        <button style={{...c.pbtn, marginTop:16}}
          onClick={()=>navigate(`/booking/${hotel.id}`, { state: { hotel, room: selectedRoom } })}>
          <IconBrandWhatsapp size={16}/> Book now - confirm via WhatsApp
        </button>
      </div>
      <footer style={c.footer}>2026 Ogso - Every business, verified.</footer>
      {roomGallery && <RoomPhotoGallery photos={roomGallery.photos} roomName={roomGallery.name} onClose={() => setRoomGallery(null)}/>}
    </div>
  );
}
