import React, { useState, useEffect } from 'react';
import { IconStar, IconCheck } from '@tabler/icons-react';

const API = 'https://ogso-production.up.railway.app/api';

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display:'flex', gap:4, marginBottom:12 }}>
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          style={{ background:'none', border:'none', cursor:'pointer', padding:2 }}>
          <IconStar size={24}
            fill={(hover||value)>=n ? '#D4A843' : 'none'}
            color={(hover||value)>=n ? '#D4A843' : '#C8E6D8'}/>
        </button>
      ))}
      <span style={{ fontSize:12, color:'#4D7A65', marginLeft:6, alignSelf:'center' }}>
        {value ? ['','Poor','Fair','Good','Very good','Excellent'][value] : 'Select rating'}
      </span>
    </div>
  );
}

export default function ReviewSection({ hotelId, hotelName }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name:'', rating:0, text:'' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hotelId) return;
    fetch(`${API}/reviews/${hotelId}`)
      .then(r => r.json())
      .then(data => { setReviews(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [hotelId]);

  const submit = async () => {
    if (!form.name) { setError('Please enter your name'); return; }
    if (!form.rating) { setError('Please select a rating'); return; }
    if (!form.text || form.text.length < 10) { setError('Please write at least 10 characters'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch(`${API}/reviews`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          business: hotelId,
          rating: form.rating,
          text: form.text,
          language: 'en',
          user: { name: form.name },
          guestName: form.name,
        })
      });
      if (res.ok) {
        const newReview = { _id: Date.now(), rating: form.rating, text: form.text, guestName: form.name, createdAt: new Date() };
        setReviews(prev => [newReview, ...prev]);
        setSubmitted(true);
        setShowForm(false);
        setForm({ name:'', rating:0, text:'' });
      }
    } catch (err) { setError('Failed to submit. Please try again.'); }
    finally { setSaving(false); }
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((s,r) => s+r.rating, 0) / reviews.length).toFixed(1) : null;

  const s = {
    section:{ marginTop:20 },
    header:{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
    title:{ fontSize:14, fontWeight:500, color:'#1B3A2D' },
    writeBtn:{ background:'#F0F7F4', border:'0.5px solid #2D6A4F', borderRadius:8, padding:'6px 14px', fontSize:12, color:'#2D6A4F', cursor:'pointer' },
    avgBox:{ background:'#F0F7F4', borderRadius:10, padding:'12px 16px', marginBottom:14, display:'flex', alignItems:'center', gap:16 },
    avgNum:{ fontSize:32, fontWeight:700, color:'#1B3A2D' },
    reviewCard:{ background:'#F0F7F4', borderRadius:10, padding:'10px 12px', marginBottom:8 },
    formCard:{ background:'#F8F4EC', border:'0.5px solid #C8E6D8', borderRadius:12, padding:16, marginBottom:14 },
    input:{ width:'100%', padding:'9px 11px', border:'0.5px solid #C8E6D8', borderRadius:8, fontSize:13, color:'#1B3A2D', marginBottom:10, background:'#fff', boxSizing:'border-box' },
    submitBtn:{ width:'100%', padding:11, background:'#2D6A4F', border:'none', borderRadius:10, color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer' },
    successBox:{ background:'#E8F5EE', border:'0.5px solid #52B788', borderRadius:10, padding:14, marginBottom:14, display:'flex', alignItems:'center', gap:10 },
  };

  return (
    <div style={s.section}>
      <div style={s.header}>
        <div style={s.title}>
          Guest reviews {reviews.length > 0 && `(${reviews.length})`}
        </div>
        {!showForm && !submitted && (
          <button style={s.writeBtn} onClick={() => setShowForm(true)}>Write a review</button>
        )}
      </div>

      {submitted && (
        <div style={s.successBox}>
          <IconCheck size={20} color="#2D6A4F"/>
          <div style={{ fontSize:13, color:'#2D6A4F' }}>Thank you for your review!</div>
        </div>
      )}

      {avgRating && (
        <div style={s.avgBox}>
          <div>
            <div style={s.avgNum}>{avgRating}</div>
            <div style={{ display:'flex', gap:2 }}>
              {[1,2,3,4,5].map(n => (
                <IconStar key={n} size={14} fill={n<=Math.round(avgRating)?'#D4A843':'none'} color={n<=Math.round(avgRating)?'#D4A843':'#C8E6D8'}/>
              ))}
            </div>
          </div>
          <div style={{ fontSize:12, color:'#4D7A65' }}>{reviews.length} review{reviews.length!==1?'s':''} for {hotelName}</div>
        </div>
      )}

      {showForm && (
        <div style={s.formCard}>
          <div style={{ fontSize:13, fontWeight:500, color:'#1B3A2D', marginBottom:12 }}>Write your review</div>
          <div style={{ fontSize:11, color:'#4D7A65', marginBottom:6 }}>Your name</div>
          <input style={s.input} placeholder="Faadumo Ahmed" value={form.name} onChange={e => setForm({...form, name:e.target.value})}/>
          <div style={{ fontSize:11, color:'#4D7A65', marginBottom:6 }}>Rating</div>
          <StarPicker value={form.rating} onChange={r => setForm({...form, rating:r})}/>
          <div style={{ fontSize:11, color:'#4D7A65', marginBottom:6 }}>Your review</div>
          <textarea style={{ ...s.input, resize:'none' }} rows={3}
            placeholder="Tell other guests about your experience..."
            value={form.text} onChange={e => setForm({...form, text:e.target.value})}/>
          {error && <div style={{ fontSize:12, color:'#C00', marginBottom:8 }}>{error}</div>}
          <button style={s.submitBtn} onClick={submit} disabled={saving}>
            {saving ? 'Submitting...' : 'Submit review'}
          </button>
          <button style={{ width:'100%', padding:9, background:'transparent', border:'none', color:'#4D7A65', fontSize:12, cursor:'pointer', marginTop:6 }}
            onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}

      {loading ? (
        <div style={{ fontSize:12, color:'#4D7A65', textAlign:'center', padding:20 }}>Loading reviews...</div>
      ) : reviews.length === 0 && !showForm ? (
        <div style={{ fontSize:12, color:'#4D7A65', textAlign:'center', padding:20, background:'#F0F7F4', borderRadius:10 }}>
          No reviews yet. Be the first to review {hotelName}!
        </div>
      ) : (
        reviews.map((r,i) => (
          <div key={r._id||i} style={s.reviewCard}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
              <span style={{ fontSize:12, fontWeight:500, color:'#1B3A2D' }}>
                {r.guestName || (r.user && r.user.name) || 'Guest'}
              </span>
              <div style={{ display:'flex', gap:2 }}>
                {[1,2,3,4,5].map(n => (
                  <IconStar key={n} size={12} fill={n<=r.rating?'#D4A843':'none'} color={n<=r.rating?'#D4A843':'#C8E6D8'}/>
                ))}
              </div>
            </div>
            <div style={{ fontSize:12, color:'#4D7A65', lineHeight:1.5 }}>{r.text}</div>
            <div style={{ fontSize:10, color:'#4D7A65', marginTop:4 }}>
              {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
