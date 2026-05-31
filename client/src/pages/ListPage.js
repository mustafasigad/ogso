import React, { useState } from 'react';
import { IconBrandWhatsapp, IconShieldCheck, IconBuilding, IconArrowLeft } from '@tabler/icons-react';

export default function ListPage({ onBack }) {
  const [form, setForm] = useState({
    name: '', category: 'Hotel', city: 'Jigjiga', phone: '', description: ''
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const s = {
    wrap: { maxWidth: 600, margin: '0 auto', padding: '30px 16px' },
    h1: { fontFamily: 'Georgia,serif', fontSize: 22, color: '#1B3A2D', marginBottom: 6 },
    sub: { fontSize: 13, color: '#4D7A65', marginBottom: 24 },
    card: { background: '#F8F4EC', borderRadius: 12, padding: 16, marginBottom: 14 },
    label: { fontSize: 11, color: '#4D7A65', marginBottom: 3 },
    input: { width: '100%', padding: '9px 11px', border: '0.5px solid #C8E6D8', borderRadius: 8, fontSize: 13, color: '#1B3A2D', marginBottom: 10, background: '#fff' },
    pbtn: { width: '100%', padding: 13, background: '#2D6A4F', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 8 },
    obtn: { width: '100%', padding: 11, background: 'transparent', border: '1px solid #2D6A4F', borderRadius: 10, color: '#2D6A4F', fontSize: 13, cursor: 'pointer' },
    greenBox: { background: '#E8F5EE', border: '0.5px solid #52B788', borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 12, color: '#1B3A2D', lineHeight: 1.6 },
    successBox: { textAlign: 'center', padding: '40px 20px' },
    successIcon: { width: 60, height: 60, borderRadius: '50%', background: '#F0F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      alert('Please fill in business name and phone number.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.business) {
        setDone(true);
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Could not submit. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div>
      <div style={s.wrap}>
        <div style={s.successBox}>
          <div style={s.successIcon}>
            <IconShieldCheck size={30} color="#2D6A4F"/>
          </div>
          <h1 style={{...s.h1, textAlign:'center', marginBottom:8}}>Listing submitted!</h1>
          <p style={{fontSize:13, color:'#4D7A65', marginBottom:20, lineHeight:1.6}}>
            Thank you! We will verify <strong>{form.name}</strong> and publish it within 24 hours. We will contact you on WhatsApp at {form.phone}.
          </p>
          <div style={{background:'#FDF3DC', border:'0.5px solid #E8D090', borderRadius:10, padding:'12px 14px', display:'flex', gap:10, alignItems:'center', marginBottom:20, textAlign:'left'}}>
            <IconBrandWhatsapp size={20} color="#2D6A4F"/>
            <div style={{fontSize:12, color:'#1B3A2D', lineHeight:1.5}}>Our team will WhatsApp you to complete verification and add photos to your listing.</div>
          </div>
          <button style={s.pbtn} onClick={onBack}>Back to home</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={s.wrap}>
        <button style={{display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:'#4D7A65', fontSize:12, cursor:'pointer', marginBottom:16}} onClick={onBack}>
          <IconArrowLeft size={14}/> Back to home
        </button>
        <h1 style={s.h1}>List your business on Ogso</h1>
        <p style={s.sub}>Reach thousands of customers across the Somali world. Free to start — no credit card needed.</p>

        <div style={s.card}>
          <div style={{fontSize:13, fontWeight:500, color:'#1B3A2D', marginBottom:14}}>Business details</div>

          <div style={s.label}>Business name *</div>
          <input style={s.input} placeholder="e.g. Jigjiga Grand Hotel"
            value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>

          <div style={s.label}>Category</div>
          <select style={s.input} value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
            <option>Hotel</option>
            <option>Restaurant</option>
            <option>Clinic</option>
            <option>Shop</option>
            <option>Car hire</option>
            <option>Money transfer</option>
            <option>Other</option>
          </select>

          <div style={s.label}>City</div>
          <select style={s.input} value={form.city} onChange={e=>setForm({...form, city:e.target.value})}>
            <option>Jigjiga</option>
            <option>Mogadishu</option>
            <option>Hargeisa</option>
            <option>Djibouti City</option>
            <option>Garissa</option>
            <option>Dire Dawa</option>
            <option>Harar</option>
          </select>

          <div style={s.label}>Phone / WhatsApp *</div>
          <input style={s.input} placeholder="+251 9XX XXX XXX"
            value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>

          <div style={s.label}>Description (optional)</div>
          <textarea style={{...s.input, resize:'none'}} rows={3}
            placeholder="Tell customers about your business..."
            value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
        </div>

        <div style={s.greenBox}>
          <strong>Free listing includes:</strong> Business name, phone number, location, category and customer reviews.
          <br/>Upgrade anytime to add photos, featured placement and direct booking.
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:16}}>
          {['Free to list','Verified badge','WhatsApp booking'].map(f=>(
            <div key={f} style={{background:'#F0F7F4', borderRadius:8, padding:'10px', textAlign:'center', fontSize:11, color:'#1B3A2D', fontWeight:500}}>
              <IconShieldCheck size={16} color="#2D6A4F" style={{marginBottom:4}}/><br/>{f}
            </div>
          ))}
        </div>

        <button style={{...s.pbtn, opacity: loading?0.7:1}} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit free listing'}
        </button>
        <button style={s.obtn} onClick={onBack}>Cancel</button>
      </div>
      <div style={{background:'#1B3A2D', padding:'20px 16px', textAlign:'center', fontSize:11, color:'#52B788', marginTop:8}}>
        2026 Ogso - Every business, verified.
      </div>
    </div>
  );
}
