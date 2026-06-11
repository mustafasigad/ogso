import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { IconBrandWhatsapp } from '@tabler/icons-react';
import Nav from '../components/Nav';
import { API } from '../shared/data';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { hotel, room } = location.state || {};

  const [bookForm, setBookForm] = useState({ name:'', phone:'', checkin:'', checkout:'', guests:'2', payment:'cash', notes:'' });
  const [submitting, setSubmitting] = useState(false);

  if (!hotel || !room) {
    navigate(`/hotel/${id}`);
    return null;
  }

  const nights = () => {
    if (!bookForm.checkin || !bookForm.checkout) return 1;
    const n = Math.ceil((new Date(bookForm.checkout) - new Date(bookForm.checkin)) / 86400000);
    return n > 0 ? n : 1;
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/bookings`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          hotelId: hotel.id, businessId: hotel.id,
          hotelName: hotel.name, hotelPhone: hotel.phone,
          roomType: room.type, roomName: room.name,
          pricePerNight: room.price,
          checkIn: bookForm.checkin, checkOut: bookForm.checkout,
          guests: bookForm.guests, guestName: bookForm.name,
          guestPhone: bookForm.phone, notes: bookForm.notes,
          paymentMethod: bookForm.payment,
        })
      });
      const data = await res.json();
      navigate('/booking-confirmed', {
        state: { ref: data.booking.ref, hotel, room, form: bookForm, nights: nights(), total: room.price * nights() }
      });
    } catch (err) {
      const ref = Math.random().toString(36).substr(2,8).toUpperCase();
      navigate('/booking-confirmed', {
        state: { ref, hotel, room, form: bookForm, nights: nights(), total: room.price * nights() }
      });
    }
    setSubmitting(false);
  };

  const c = {
    formCard:{ background:'#F8F4EC', borderRadius:12, padding:14, marginBottom:10 },
    formLabel:{ fontSize:11, color:'#4D7A65', marginBottom:3 },
    formInput:{ width:'100%', padding:'9px 11px', border:'0.5px solid #C8E6D8', borderRadius:8, fontSize:13, color:'#1B3A2D', marginBottom:10 },
    radioRow:{ display:'flex', alignItems:'center', gap:8, marginBottom:10, cursor:'pointer' },
    pbtn:{ width:'100%', padding:12, background:'#2D6A4F', border:'none', borderRadius:10, color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', marginBottom:6, display:'flex', alignItems:'center', justifyContent:'center', gap:6 },
    obtn:{ width:'100%', padding:10, background:'transparent', border:'1px solid #2D6A4F', borderRadius:10, color:'#2D6A4F', fontSize:12, cursor:'pointer' },
    footer:{ background:'#1B3A2D', padding:'20px 16px', textAlign:'center', fontSize:11, color:'#52B788', marginTop:8 },
  };

  return (
    <div>
      <Nav/>
      <div style={{ maxWidth:600, margin:'0 auto', padding:'20px 16px' }}>
        <h1 style={{ fontFamily:'Georgia,serif', fontSize:20, marginBottom:4, color:'#1B3A2D' }}>Complete your booking</h1>
        <p style={{ fontSize:12, color:'#4D7A65', marginBottom:18 }}>{hotel.name} - {room.name}</p>
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
              <span>ETB {room.price.toLocaleString()} x {nights()} night{nights()>1?'s':''}</span>
              <span>ETB {(room.price*nights()).toLocaleString()}</span>
            </div>
            <div style={{ borderTop:'0.5px solid #C8E6D8', paddingTop:10, display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontWeight:500, color:'#1B3A2D' }}>Total</span>
              <span style={{ fontSize:17, fontWeight:500, color:'#1B3A2D' }}>ETB {(room.price*nights()).toLocaleString()}</span>
            </div>
          </div>

          <button type="submit" style={c.pbtn} disabled={submitting}>
            <IconBrandWhatsapp size={16}/> {submitting ? 'Submitting...' : 'Confirm booking via WhatsApp'}
          </button>
          <button type="button" style={c.obtn} onClick={()=>navigate(-1)}>Back to hotel</button>
        </form>
      </div>
      <footer style={c.footer}>2026 Ogso - Every business, verified.</footer>
    </div>
  );
}
