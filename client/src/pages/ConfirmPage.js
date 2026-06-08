import React, { useState, useEffect } from 'react';
import { IconCheck, IconX, IconCalendar, IconUser, IconBuildingSkyscraper } from '@tabler/icons-react';

const API = 'https://ogso-production.up.railway.app/api';

export default function ConfirmPage({ bookingRef, onBack }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [done, setDone] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingRef) return;
    fetch(`${API}/bookings/ref/${bookingRef}`)
      .then(r => r.json())
      .then(data => { setBooking(data); setLoading(false); })
      .catch(() => { setError('Booking not found'); setLoading(false); });
  }, [bookingRef]);

  const act = async (status) => {
    setActing(true);
    try {
      const res = await fetch(`${API}/bookings/ref/${bookingRef}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      setDone(status);
      setBooking(data);
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setActing(false);
  };

  const s = {
    wrap: { minHeight: '100vh', background: '#F8F4EC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16 },
    card: { background: '#fff', borderRadius: 16, padding: 24, maxWidth: 440, width: '100%', border: '0.5px solid #C8E6D8' },
    logo: { fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 700, color: '#2D6A4F', marginBottom: 4 },
    tag: { fontSize: 10, color: '#52B788', marginBottom: 24 },
    title: { fontSize: 18, fontWeight: 500, color: '#1B3A2D', marginBottom: 16 },
    row: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
    label: { fontSize: 11, color: '#4D7A65', marginBottom: 2 },
    value: { fontSize: 14, fontWeight: 500, color: '#1B3A2D' },
    ref: { fontFamily: 'monospace', fontSize: 22, fontWeight: 700, color: '#2D6A4F', letterSpacing: 3, textAlign: 'center', padding: '12px 0', marginBottom: 16 },
    divider: { borderTop: '0.5px solid #C8E6D8', margin: '16px 0' },
    confirmBtn: { width: '100%', padding: 14, background: '#2D6A4F', border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
    cancelBtn: { width: '100%', padding: 12, background: 'transparent', border: '1px solid #C00', borderRadius: 10, color: '#C00', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
    successBox: { textAlign: 'center', padding: '20px 0' },
    successIcon: { width: 64, height: 64, borderRadius: '50%', background: '#E8F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
    cancelBox: { textAlign: 'center', padding: '20px 0' },
    cancelIcon: { width: 64, height: 64, borderRadius: '50%', background: '#FEE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  };

  if (loading) return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={{ textAlign: 'center', color: '#4D7A65', padding: '40px 0' }}>Loading booking...</div>
      </div>
    </div>
  );

  if (error) return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={{ textAlign: 'center', color: '#C00', padding: '40px 0' }}>{error}</div>
        <button style={{ ...s.confirmBtn, background: '#4D7A65' }} onClick={onBack}>Go to Ogso</button>
      </div>
    </div>
  );

  if (done === 'confirmed') return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.logo}>ogso</div>
        <div style={s.tag}>Every business, verified.</div>
        <div style={s.successBox}>
          <div style={s.successIcon}><IconCheck size={32} color="#2D6A4F"/></div>
          <div style={{ fontSize: 20, fontWeight: 500, color: '#1B3A2D', marginBottom: 8 }}>Booking Confirmed!</div>
          <div style={{ fontSize: 13, color: '#4D7A65', marginBottom: 16 }}>The guest has been notified on WhatsApp.</div>
          <div style={{ fontFamily: 'monospace', fontSize: 18, color: '#2D6A4F', fontWeight: 700 }}>{booking?.ref}</div>
        </div>
      </div>
    </div>
  );

  if (done === 'cancelled') return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.logo}>ogso</div>
        <div style={s.tag}>Every business, verified.</div>
        <div style={s.cancelBox}>
          <div style={s.cancelIcon}><IconX size={32} color="#C00"/></div>
          <div style={{ fontSize: 20, fontWeight: 500, color: '#1B3A2D', marginBottom: 8 }}>Booking Cancelled</div>
          <div style={{ fontSize: 13, color: '#4D7A65' }}>The guest has been notified on WhatsApp.</div>
        </div>
      </div>
    </div>
  );

  if (booking?.status === 'confirmed') return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.logo}>ogso</div>
        <div style={s.successBox}>
          <div style={s.successIcon}><IconCheck size={32} color="#2D6A4F"/></div>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#1B3A2D' }}>Already confirmed!</div>
          <div style={{ fontFamily: 'monospace', fontSize: 18, color: '#2D6A4F', marginTop: 8 }}>{booking?.ref}</div>
        </div>
      </div>
    </div>
  );

  if (booking?.status === 'cancelled') return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.logo}>ogso</div>
        <div style={s.cancelBox}>
          <div style={s.cancelIcon}><IconX size={32} color="#C00"/></div>
          <div style={{ fontSize: 16, fontWeight: 500, color: '#1B3A2D' }}>Already cancelled</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.logo}>ogso</div>
        <div style={s.tag}>Every business, verified.</div>
        <div style={s.title}>New Booking Request</div>

        <div style={s.ref}>{booking?.ref}</div>

        <div style={s.row}>
          <IconUser size={18} color="#2D6A4F"/>
          <div>
            <div style={s.label}>Guest</div>
            <div style={s.value}>{booking?.guestName}</div>
          </div>
        </div>

        <div style={s.row}>
          <IconBuildingSkyscraper size={18} color="#2D6A4F"/>
          <div>
            <div style={s.label}>Room</div>
            <div style={s.value}>{booking?.roomName}</div>
          </div>
        </div>

        <div style={s.row}>
          <IconCalendar size={18} color="#2D6A4F"/>
          <div>
            <div style={s.label}>Check-in / Check-out</div>
            <div style={s.value}>{booking?.checkIn} → {booking?.checkOut}</div>
          </div>
        </div>

        <div style={s.divider}/>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={s.label}>Nights</div>
            <div style={s.value}>{booking?.nights}</div>
          </div>
          <div>
            <div style={s.label}>Guests</div>
            <div style={s.value}>{booking?.guests}</div>
          </div>
          <div>
            <div style={s.label}>Payment</div>
            <div style={s.value}>{booking?.paymentMethod}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={s.label}>Total</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#2D6A4F' }}>ETB {booking?.totalPrice?.toLocaleString()}</div>
          </div>
        </div>

        {booking?.notes && (
          <div style={{ background: '#F8F4EC', borderRadius: 8, padding: '10px 12px', marginBottom: 16, fontSize: 12, color: '#4D7A65' }}>
            <strong>Notes:</strong> {booking.notes}
          </div>
        )}

        <button style={s.confirmBtn} onClick={() => act('confirmed')} disabled={acting}>
          <IconCheck size={18}/> {acting ? 'Confirming...' : 'Confirm Booking'}
        </button>
        <button style={s.cancelBtn} onClick={() => act('cancelled')} disabled={acting}>
          <IconX size={16}/> {acting ? 'Cancelling...' : 'Cancel Booking'}
        </button>

        <div style={{ fontSize: 10, color: '#4D7A65', textAlign: 'center', marginTop: 12 }}>
          The guest will be notified on WhatsApp automatically.
        </div>
      </div>
    </div>
  );
}
