import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconCheck, IconX, IconCalendar, IconUser, IconBuildingSkyscraper } from '@tabler/icons-react';
import { API } from '../shared/data';

export default function ConfirmHotelPage() {
  const { ref } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [done, setDone] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ref) return;
    fetch(`${API}/bookings/ref/${ref}`)
      .then(r => r.json())
      .then(data => { setBooking(data); setLoading(false); })
      .catch(() => { setError('Booking not found'); setLoading(false); });
  }, [ref]);

  const act = async (status) => {
    setActing(true);
    try {
      const res = await fetch(`${API}/bookings/ref/${ref}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      setDone(status);
      setBooking(data);
    } catch { setError('Something went wrong. Please try again.'); }
    setActing(false);
  };

  const s = {
    wrap: { minHeight: '100vh', background: '#F8F4EC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16 },
    card: { background: '#fff', borderRadius: 16, padding: 24, maxWidth: 440, width: '100%', border: '0.5px solid #C8E6D8' },
    logo: { fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 700, color: '#2D6A4F', marginBottom: 4 },
    tag: { fontSize: 10, color: '#52B788', marginBottom: 24 },
    ref: { fontFamily: 'monospace', fontSize: 22, fontWeight: 700, color: '#2D6A4F', letterSpacing: 3, textAlign: 'center', padding: '12px 0', marginBottom: 16 },
    divider: { borderTop: '0.5px solid #C8E6D8', margin: '16px 0' },
    confirmBtn: { width: '100%', padding: 14, background: '#2D6A4F', border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
    cancelBtn: { width: '100%', padding: 12, background: 'transparent', border: '1px solid #C00', borderRadius: 10, color: '#C00', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  };

  if (loading) return <div style={s.wrap}><div style={s.card}><div style={{ textAlign:'center', color:'#4D7A65', padding:'40px 0' }}>Loading booking...</div></div></div>;
  if (error) return <div style={s.wrap}><div style={s.card}><div style={{ textAlign:'center', color:'#C00', padding:'40px 0' }}>{error}</div><button style={{...s.confirmBtn, background:'#4D7A65'}} onClick={()=>navigate('/')}>Go to Ogso</button></div></div>;

  if (done === 'confirmed') return (
    <div style={s.wrap}><div style={s.card}>
      <div style={s.logo}>ogso</div>
      <div style={{ textAlign:'center', padding:'20px 0' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:'#E8F5EE', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}><IconCheck size={32} color="#2D6A4F"/></div>
        <div style={{ fontSize:20, fontWeight:500, color:'#1B3A2D', marginBottom:8 }}>Booking Confirmed!</div>
        <div style={{ fontSize:13, color:'#4D7A65' }}>The guest has been notified on WhatsApp.</div>
        <div style={{ fontFamily:'monospace', fontSize:18, color:'#2D6A4F', fontWeight:700, marginTop:12 }}>{booking?.ref}</div>
      </div>
    </div></div>
  );

  if (done === 'cancelled') return (
    <div style={s.wrap}><div style={s.card}>
      <div style={s.logo}>ogso</div>
      <div style={{ textAlign:'center', padding:'20px 0' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:'#FEE', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}><IconX size={32} color="#C00"/></div>
        <div style={{ fontSize:20, fontWeight:500, color:'#1B3A2D', marginBottom:8 }}>Booking Cancelled</div>
        <div style={{ fontSize:13, color:'#4D7A65' }}>The guest has been notified on WhatsApp.</div>
      </div>
    </div></div>
  );

  if (booking?.status === 'confirmed') return (
    <div style={s.wrap}><div style={s.card}>
      <div style={s.logo}>ogso</div>
      <div style={{ textAlign:'center', padding:'20px 0' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:'#E8F5EE', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}><IconCheck size={32} color="#2D6A4F"/></div>
        <div style={{ fontSize:16, fontWeight:500, color:'#1B3A2D' }}>Already confirmed!</div>
        <div style={{ fontFamily:'monospace', fontSize:18, color:'#2D6A4F', marginTop:8 }}>{booking?.ref}</div>
      </div>
    </div></div>
  );

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.logo}>ogso</div>
        <div style={{ fontSize:10, color:'#52B788', marginBottom:24 }}>Every business, verified.</div>
        <div style={{ fontSize:18, fontWeight:500, color:'#1B3A2D', marginBottom:16 }}>New Booking Request</div>
        <div style={s.ref}>{booking?.ref}</div>

        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
          <IconUser size={18} color="#2D6A4F"/>
          <div>
            <div style={{ fontSize:11, color:'#4D7A65', marginBottom:2 }}>Guest</div>
            <div style={{ fontSize:14, fontWeight:500, color:'#1B3A2D' }}>{booking?.guestName}</div>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
          <IconBuildingSkyscraper size={18} color="#2D6A4F"/>
          <div>
            <div style={{ fontSize:11, color:'#4D7A65', marginBottom:2 }}>Room</div>
            <div style={{ fontSize:14, fontWeight:500, color:'#1B3A2D' }}>{booking?.roomName}</div>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
          <IconCalendar size={18} color="#2D6A4F"/>
          <div>
            <div style={{ fontSize:11, color:'#4D7A65', marginBottom:2 }}>Check-in / Check-out</div>
            <div style={{ fontSize:14, fontWeight:500, color:'#1B3A2D' }}>{booking?.checkIn} → {booking?.checkOut}</div>
          </div>
        </div>

        <div style={s.divider}/>

        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
          <div><div style={{ fontSize:11, color:'#4D7A65' }}>Nights</div><div style={{ fontSize:14, fontWeight:500, color:'#1B3A2D' }}>{booking?.nights}</div></div>
          <div><div style={{ fontSize:11, color:'#4D7A65' }}>Guests</div><div style={{ fontSize:14, fontWeight:500, color:'#1B3A2D' }}>{booking?.guests}</div></div>
          <div><div style={{ fontSize:11, color:'#4D7A65' }}>Payment</div><div style={{ fontSize:14, fontWeight:500, color:'#1B3A2D' }}>{booking?.paymentMethod}</div></div>
          <div style={{ textAlign:'right' }}><div style={{ fontSize:11, color:'#4D7A65' }}>Total</div><div style={{ fontSize:16, fontWeight:700, color:'#2D6A4F' }}>ETB {booking?.totalPrice?.toLocaleString()}</div></div>
        </div>

        {booking?.notes && (
          <div style={{ background:'#F8F4EC', borderRadius:8, padding:'10px 12px', marginBottom:16, fontSize:12, color:'#4D7A65' }}>
            <strong>Notes:</strong> {booking.notes}
          </div>
        )}

        <button style={s.confirmBtn} onClick={() => act('confirmed')} disabled={acting}>
          <IconCheck size={18}/> {acting ? 'Confirming...' : 'Confirm Booking'}
        </button>
        <button style={s.cancelBtn} onClick={() => act('cancelled')} disabled={acting}>
          <IconX size={16}/> {acting ? 'Cancelling...' : 'Cancel Booking'}
        </button>

        <div style={{ fontSize:10, color:'#4D7A65', textAlign:'center', marginTop:12 }}>
          The guest will be notified on WhatsApp automatically.
        </div>
      </div>
    </div>
  );
}
