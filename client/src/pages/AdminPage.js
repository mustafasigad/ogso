import React, { useState, useEffect, useCallback } from 'react';
import {
  IconBuilding, IconCalendar, IconShieldCheck, IconShieldX,
  IconTrash, IconEdit, IconCheck, IconX,
  IconRefresh, IconCurrencyDollar, IconPlus, IconArrowLeft, IconEye,
  IconPhoto
} from '@tabler/icons-react';
import { initializeApp, getApps } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const API = 'https://ogso-production.up.railway.app/api';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

if (!getApps().length) initializeApp(firebaseConfig);

const EMPTY_FORM = {
  name:'', category:'hotel', city:'Jigjiga', territory:'ET-SO',
  address:'', phone:'', whatsapp:'', email:'',
  description:'', photos:[], amenities:'',
  price:'', verified:false, featured:false, plan:'free',
  rooms:[
    { type:'standard', name:'Standard Room', price:'', beds:'Double bed, AC, en-suite bathroom', popular:false },
    { type:'deluxe', name:'Deluxe Room', price:'', beds:'King bed, city view, minibar', popular:true },
  ]
};

const fs = {
  formCard:{ background:'#fff', borderRadius:12, border:'0.5px solid #C8E6D8', padding:16, marginBottom:14 },
  formLabel:{ fontSize:11, color:'#4D7A65', marginBottom:3, display:'block' },
  formInput:{ width:'100%', padding:'9px 11px', border:'0.5px solid #C8E6D8', borderRadius:8, fontSize:13, color:'#1B3A2D', marginBottom:12, background:'#fff', boxSizing:'border-box', outline:'none' },
  formGrid:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 },
  actionBtn:{ border:'none', borderRadius:6, padding:'5px 10px', fontSize:11, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:3 },
  roomCard:{ background:'#F8F4EC', borderRadius:10, padding:12, marginBottom:10, border:'0.5px solid #C8E6D8' },
};

function PhotoUpload({ photos, onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB'); return; }
    setError(''); setUploading(true); setProgress(0);
    try {
      const storage = getStorage();
      const filename = `ogso/hotels/${Date.now()}-${file.name.replace(/\s/g,'_')}`;
      const storageRef = ref(storage, filename);
      const task = uploadBytesResumable(storageRef, file);
      task.on('state_changed',
        snap => setProgress(Math.round(snap.bytesTransferred/snap.totalBytes*100)),
        err => { setError('Upload failed: '+err.message); setUploading(false); },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          onUpdate([...photos, url]);
          setUploading(false); setProgress(0);
        }
      );
    } catch (err) { setError('Upload failed'); setUploading(false); }
  };

  const addUrl = () => {
    if (!urlInput.trim()) return;
    onUpdate([...photos, urlInput.trim()]);
    setUrlInput('');
  };

  const removePhoto = (i) => onUpdate(photos.filter((_,idx) => idx !== i));

  return (
    <div style={{ marginBottom:12 }}>
      <label style={fs.formLabel}>Photos</label>
      {photos.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(90px,1fr))', gap:8, marginBottom:8 }}>
          {photos.map((url,i) => (
            <div key={i} style={{ position:'relative', height:80, borderRadius:8, overflow:'hidden', border:'0.5px solid #C8E6D8' }}>
              <img src={url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              <button onClick={() => removePhoto(i)}
                style={{ position:'absolute', top:3, right:3, background:'rgba(0,0,0,0.5)', border:'none', borderRadius:'50%', width:20, height:20, color:'#fff', cursor:'pointer', fontSize:11, display:'flex', alignItems:'center', justifyContent:'center' }}>
                x
              </button>
            </div>
          ))}
        </div>
      )}
      <label style={{ display:'flex', flexDirection:'column', alignItems:'center', border:'1.5px dashed #C8E6D8', borderRadius:8, padding:14, textAlign:'center', cursor:'pointer', background:'#F8F4EC', marginBottom:6 }}>
        <IconPhoto size={24} color="#4D7A65" style={{ marginBottom:4 }}/>
        <span style={{ fontSize:12, color:'#4D7A65' }}>{uploading ? `Uploading ${progress}%...` : 'Click to upload photo'}</span>
        <span style={{ fontSize:10, color:'#4D7A65', marginTop:2 }}>JPG, PNG up to 5MB</span>
        <input type="file" accept="image/*" style={{ display:'none' }} onChange={handleFile}/>
      </label>
      {uploading && (
        <div style={{ background:'#E8F5EE', borderRadius:4, height:6, overflow:'hidden', marginBottom:6 }}>
          <div style={{ background:'#2D6A4F', height:'100%', width:`${progress}%`, transition:'width 0.3s' }}/>
        </div>
      )}
      {error && <div style={{ fontSize:11, color:'#C00', marginBottom:6 }}>{error}</div>}
      <div style={{ display:'flex', gap:6 }}>
        <input style={{ ...fs.formInput, marginBottom:0, flex:1 }}
          placeholder="Or paste a photo URL and press Add"
          value={urlInput} onChange={e => setUrlInput(e.target.value)}
          onKeyDown={e => e.key==='Enter' && addUrl()}/>
        <button style={{ background:'#2D6A4F', border:'none', borderRadius:8, padding:'0 14px', color:'#fff', fontSize:12, cursor:'pointer' }} onClick={addUrl}>Add</button>
      </div>
    </div>
  );
}

function ListingForm({ form, setForm, onSave, onCancel, saving, msg, editId }) {
  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));
  const setRoom = (i, field, val) => setForm(prev => {
    const rooms = [...prev.rooms];
    rooms[i] = { ...rooms[i], [field]: val };
    return { ...prev, rooms };
  });
  const addRoom = () => setForm(prev => ({ ...prev, rooms: [...prev.rooms, { type:'standard', name:'', price:'', beds:'', popular:false }] }));
  const removeRoom = (i) => setForm(prev => ({ ...prev, rooms: prev.rooms.filter((_,idx) => idx !== i) }));

  return (
    <div style={{ maxWidth:700, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <button style={{ ...fs.actionBtn, background:'#F0F7F4', color:'#2D6A4F' }} onClick={onCancel}>
          <IconArrowLeft size={13}/> Back
        </button>
        <div style={{ fontSize:16, fontWeight:500, color:'#1B3A2D' }}>{editId ? 'Edit listing' : 'Add new listing'}</div>
      </div>

      {msg && <div style={{ background:msg.includes('Error')?'#FEE':'#E8F5EE', border:`0.5px solid ${msg.includes('Error')?'#F99':'#52B788'}`, borderRadius:8, padding:'10px 14px', fontSize:13, color:msg.includes('Error')?'#C00':'#2D6A4F', marginBottom:14 }}>{msg}</div>}

      <div style={fs.formCard}>
        <div style={{ fontSize:13, fontWeight:500, color:'#1B3A2D', marginBottom:14 }}>Basic details</div>
        <div style={fs.formGrid}>
          <div>
            <label style={fs.formLabel}>Business name *</label>
            <input style={fs.formInput} placeholder="e.g. Jigjiga Grand Hotel" value={form.name} onChange={e => set('name', e.target.value)}/>
          </div>
          <div>
            <label style={fs.formLabel}>Category</label>
            <select style={fs.formInput} value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="hotel">Hotel</option>
              <option value="restaurant">Restaurant</option>
              <option value="clinic">Clinic</option>
              <option value="shop">Shop</option>
              <option value="car_hire">Car hire</option>
              <option value="money_transfer">Money transfer</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label style={fs.formLabel}>City</label>
            <select style={fs.formInput} value={form.city} onChange={e => set('city', e.target.value)}>
              {['Jigjiga','Mogadishu','Hargeisa','Djibouti City','Garissa','Dire Dawa','Harar'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={fs.formLabel}>Territory</label>
            <select style={fs.formInput} value={form.territory} onChange={e => set('territory', e.target.value)}>
              <option value="ET-SO">Somali Region, Ethiopia</option>
              <option value="SO">Somalia</option>
              <option value="SO-SL">Somaliland</option>
              <option value="DJ">Djibouti</option>
              <option value="KE-NFD">Kenya NFD</option>
            </select>
          </div>
          <div>
            <label style={fs.formLabel}>Phone / WhatsApp *</label>
            <input style={fs.formInput} placeholder="+251 9XX XXX XXX" value={form.phone} onChange={e => { set('phone', e.target.value); set('whatsapp', e.target.value); }}/>
          </div>
          <div>
            <label style={fs.formLabel}>Base price (ETB/night)</label>
            <input style={fs.formInput} type="number" placeholder="850" value={form.price} onChange={e => set('price', e.target.value)}/>
          </div>
        </div>
        <label style={fs.formLabel}>Address</label>
        <input style={fs.formInput} placeholder="Street, District, City" value={form.address} onChange={e => set('address', e.target.value)}/>
        <label style={fs.formLabel}>Description</label>
        <textarea style={{ ...fs.formInput, resize:'none' }} rows={3} placeholder="Describe the business..." value={form.description} onChange={e => set('description', e.target.value)}/>
        <label style={fs.formLabel}>Amenities (comma separated)</label>
        <input style={fs.formInput} placeholder="WiFi, Breakfast, AC, Parking, Prayer room" value={form.amenities} onChange={e => set('amenities', e.target.value)}/>

        <PhotoUpload photos={form.photos} onUpdate={urls => set('photos', urls)}/>

        <div style={{ display:'flex', gap:20, marginTop:4 }}>
          <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#1B3A2D', cursor:'pointer' }}>
            <input type="checkbox" checked={form.verified} onChange={e => { set('verified', e.target.checked); set('active', e.target.checked); }}/>
            Verified
          </label>
          <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#1B3A2D', cursor:'pointer' }}>
            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}/>
            Featured (shows at top)
          </label>
        </div>
      </div>

      {form.category === 'hotel' && (
        <div style={fs.formCard}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:500, color:'#1B3A2D' }}>Room types</div>
            <button style={{ ...fs.actionBtn, background:'#F0F7F4', color:'#2D6A4F' }} onClick={addRoom}>
              <IconPlus size={12}/> Add room
            </button>
          </div>
          {form.rooms.map((r, i) => (
            <div key={i} style={fs.roomCard}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <div style={{ fontSize:12, fontWeight:500, color:'#1B3A2D' }}>Room {i+1}</div>
                {form.rooms.length > 1 && (
                  <button style={{ ...fs.actionBtn, background:'#FEE', color:'#C00' }} onClick={() => removeRoom(i)}>
                    <IconTrash size={11}/>
                  </button>
                )}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                <div>
                  <label style={fs.formLabel}>Room name</label>
                  <input style={{ ...fs.formInput, marginBottom:0 }} placeholder="Deluxe Room" value={r.name} onChange={e => setRoom(i,'name',e.target.value)}/>
                </div>
                <div>
                  <label style={fs.formLabel}>Price (ETB/night)</label>
                  <input style={{ ...fs.formInput, marginBottom:0 }} type="number" placeholder="1200" value={r.price} onChange={e => setRoom(i,'price',e.target.value)}/>
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={fs.formLabel}>Description</label>
                  <input style={{ ...fs.formInput, marginBottom:0 }} placeholder="King bed, city view, minibar, AC" value={r.beds} onChange={e => setRoom(i,'beds',e.target.value)}/>
                </div>
                <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#1B3A2D', cursor:'pointer' }}>
                  <input type="checkbox" checked={r.popular} onChange={e => setRoom(i,'popular',e.target.checked)}/>
                  Mark as popular
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      <button style={{ width:'100%', padding:13, background:'#2D6A4F', border:'none', borderRadius:10, color:'#fff', fontSize:14, fontWeight:500, cursor:'pointer', marginBottom:8, opacity:saving?0.7:1 }}
        onClick={onSave} disabled={saving}>
        {saving ? 'Saving...' : editId ? 'Update listing' : 'Add listing'}
      </button>
      <button style={{ width:'100%', padding:10, background:'transparent', border:'1px solid #2D6A4F', borderRadius:10, color:'#2D6A4F', fontSize:12, cursor:'pointer' }}
        onClick={onCancel}>Cancel</button>
    </div>
  );
}

export default function AdminPage({ onBack }) {
  const [tab, setTab] = useState('overview');
  const [businesses, setBusinesses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [bRes, bookRes] = await Promise.all([
        fetch(`${API}/businesses?admin=true`),
        fetch(`${API}/bookings/my`)
      ]);
      const bData = await bRes.json();
      const bookData = await bookRes.json();
      setBusinesses(bData.businesses || []);
      setBookings(Array.isArray(bookData) ? bookData : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const verify = async (id, verified) => {
    await fetch(`${API}/businesses/${id}`, {
      method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ verified, active: verified })
    });
    fetchAll();
  };

  const deleteBiz = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await fetch(`${API}/businesses/${id}`, { method:'DELETE' });
      setBusinesses(prev => prev.filter(b => b._id !== id));
    } catch (err) { alert('Error deleting listing'); }
  };

  const updateBooking = async (id, status) => {
    await fetch(`${API}/bookings/${id}/status`, {
      method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ status })
    });
    fetchAll();
  };

  const openEdit = (b) => {
    setEditId(b._id);
    setForm({
      name:b.name||'', category:b.category||'hotel', city:b.city||'Jigjiga',
      territory:b.territory||'ET-SO', address:b.address||'', phone:b.phone||'',
      whatsapp:b.whatsapp||'', email:b.email||'', description:b.description||'',
      photos:b.photos||[], amenities:(b.amenities||[]).join(', '),
      price:b.price||'', verified:b.verified||false, featured:b.featured||false,
      plan:b.plan||'free', rooms:b.rooms&&b.rooms.length>0?b.rooms:EMPTY_FORM.rooms,
    });
    setShowForm(true);
    setTab('form');
  };

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setTab('form');
  };

  const saveForm = async () => {
    if (!form.name || !form.phone) { setMsg('Please fill in name and phone.'); return; }
    setSaving(true); setMsg('');
    try {
      const payload = {
        ...form,
        photos: Array.isArray(form.photos) ? form.photos : [],
        amenities: form.amenities ? form.amenities.split(',').map(a=>a.trim()).filter(Boolean) : [],
        active: form.verified,
        price: Number(form.price) || 0,
        rooms: form.rooms.map(r => ({ ...r, price: Number(r.price) || 0 })),
      };
      const url = editId ? `${API}/businesses/${editId}` : `${API}/businesses`;
      const method = editId ? 'PUT' : 'POST';
      await fetch(url, { method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
      setMsg(editId ? 'Listing updated!' : 'Listing added!');
      fetchAll();
      setTimeout(() => { setTab('listings'); setShowForm(false); setMsg(''); }, 1500);
    } catch (err) { setMsg('Error saving. Please try again.'); }
    finally { setSaving(false); }
  };

  const totalRevenue = bookings.reduce((s,b) => s+(b.totalPrice||0), 0);
  const pendingListings = businesses.filter(b => !b.verified).length;
  const confirmedBookings = bookings.filter(b => b.status==='confirmed').length;
  const totalViews = businesses.reduce((s,b) => s+(b.views||0), 0);

  const cs = {
    wrap:{ minHeight:'100vh', background:'#F8F4EC' },
    nav:{ background:'#1B3A2D', padding:'0 20px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 },
    tabs:{ display:'flex', background:'#fff', borderBottom:'0.5px solid #C8E6D8', padding:'0 20px', overflowX:'auto' },
    tab:{ padding:'14px 16px', fontSize:13, color:'#4D7A65', cursor:'pointer', border:'none', background:'none', borderBottom:'2px solid transparent', whiteSpace:'nowrap' },
    tabOn:{ color:'#2D6A4F', borderBottom:'2px solid #2D6A4F', fontWeight:500 },
    content:{ padding:20 },
    statGrid:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:12, marginBottom:20 },
    stat:{ background:'#fff', borderRadius:12, padding:16, border:'0.5px solid #C8E6D8' },
    table:{ background:'#fff', borderRadius:12, border:'0.5px solid #C8E6D8', overflow:'hidden' },
    tableHead:{ background:'#F0F7F4', padding:'10px 16px', display:'grid', gap:10, fontSize:10, fontWeight:500, color:'#4D7A65', textTransform:'uppercase' },
    tableRow:{ padding:'12px 16px', display:'grid', gap:10, borderTop:'0.5px solid #C8E6D8', alignItems:'center', fontSize:13 },
    badge:{ display:'inline-block', borderRadius:4, padding:'2px 8px', fontSize:10, fontWeight:500 },
    btn:{ border:'none', borderRadius:6, padding:'5px 10px', fontSize:11, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:3 },
    addBtn:{ background:'#2D6A4F', border:'none', borderRadius:8, padding:'7px 14px', fontSize:12, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', gap:4 },
    refreshBtn:{ background:'#F0F7F4', border:'0.5px solid #C8E6D8', borderRadius:8, padding:'6px 12px', fontSize:11, color:'#2D6A4F', cursor:'pointer', display:'flex', alignItems:'center', gap:4 },
    emptyBox:{ textAlign:'center', padding:'40px 20px', color:'#4D7A65', fontSize:13 },
    sectionTitle:{ fontSize:15, fontWeight:500, color:'#1B3A2D', marginBottom:12 },
  };

  const bstatus = (s) => ({ background: s==='confirmed'?'#E8F5EE':s==='cancelled'?'#FEE':'#FDF3DC', color: s==='confirmed'?'#2D6A4F':s==='cancelled'?'#C00':'#8B6A00' });

  return (
    <div style={cs.wrap}>
      <nav style={cs.nav}>
        <div>
          <div style={{ fontFamily:'Georgia,serif', fontSize:18, fontWeight:700, color:'#fff' }}>Ogso Admin</div>
          <div style={{ fontSize:9, color:'#52B788' }}>Every business, verified.</div>
        </div>
        <button style={{ background:'transparent', border:'1px solid #52B788', borderRadius:8, padding:'6px 12px', color:'#52B788', fontSize:12, cursor:'pointer' }} onClick={onBack}>Back to site</button>
      </nav>

      <div style={cs.tabs}>
        {[
          { id:'overview', label:'Overview' },
          { id:'listings', label:`Listings (${businesses.length})` },
          { id:'bookings', label:`Bookings (${bookings.length})` },
          ...(showForm ? [{ id:'form', label: editId ? 'Edit listing' : 'Add listing' }] : []),
        ].map(t => (
          <button key={t.id} style={{ ...cs.tab, ...(tab===t.id?cs.tabOn:{}) }} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div style={cs.content}>
        {loading ? (
          <div style={{ textAlign:'center', padding:'60px 20px', color:'#4D7A65' }}>Loading...</div>
        ) : (
          <>
            {tab === 'overview' && (
              <div>
                <div style={cs.statGrid}>
                  {[
                    { icon:<IconBuilding size={18} color="#2D6A4F"/>, num:businesses.length, lbl:'Total listings' },
                    { icon:<IconShieldX size={18} color="#D4A843"/>, num:pendingListings, lbl:'Pending' },
                    { icon:<IconCalendar size={18} color="#2D6A4F"/>, num:bookings.length, lbl:'Bookings' },
                    { icon:<IconCheck size={18} color="#2D6A4F"/>, num:confirmedBookings, lbl:'Confirmed' },
                    { icon:<IconCurrencyDollar size={18} color="#D4A843"/>, num:`ETB ${totalRevenue.toLocaleString()}`, lbl:'Revenue' },
                    { icon:<IconEye size={18} color="#2D6A4F"/>, num:totalViews, lbl:'Views' },
                  ].map((st,i) => (
                    <div key={i} style={cs.stat}>
                      <div style={{ width:34, height:34, borderRadius:8, background:'#F0F7F4', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>{st.icon}</div>
                      <div style={{ fontSize:22, fontWeight:700, color:'#1B3A2D', marginBottom:2 }}>{st.num}</div>
                      <div style={{ fontSize:11, color:'#4D7A65' }}>{st.lbl}</div>
                    </div>
                  ))}
                </div>
                {pendingListings > 0 && (
                  <div style={{ background:'#FDF3DC', border:'0.5px solid #E8D090', borderRadius:12, padding:16, marginBottom:20 }}>
                    <div style={{ fontSize:14, fontWeight:500, color:'#1B3A2D', marginBottom:4 }}>{pendingListings} listing{pendingListings>1?'s':''} waiting for verification</div>
                    <div style={{ fontSize:12, color:'#4D7A65', marginBottom:10 }}>Review and approve new submissions</div>
                    <button style={{ ...cs.btn, background:'#2D6A4F', color:'#fff', padding:'7px 14px' }} onClick={() => setTab('listings')}>Review listings</button>
                  </div>
                )}
                <div style={cs.sectionTitle}>Recent bookings</div>
                {bookings.length === 0 ? <div style={cs.emptyBox}>No bookings yet</div> : (
                  <div style={cs.table}>
                    {bookings.slice(0,5).map((b,i) => (
                      <div key={b._id||i} style={{ ...cs.tableRow, gridTemplateColumns:'1fr 1fr 1fr auto' }}>
                        <div><div style={{ fontWeight:500, color:'#1B3A2D' }}>{b.ref}</div><div style={{ fontSize:11, color:'#4D7A65' }}>{b.guestName}</div></div>
                        <div style={{ fontSize:12, color:'#4D7A65' }}>{b.roomName}</div>
                        <div style={{ fontSize:13, fontWeight:500, color:'#1B3A2D' }}>ETB {b.totalPrice?.toLocaleString()}</div>
                        <span style={{ ...cs.badge, ...bstatus(b.status) }}>{b.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'listings' && (
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                  <div style={cs.sectionTitle}>All listings ({businesses.length})</div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button style={cs.refreshBtn} onClick={fetchAll}><IconRefresh size={13}/>Refresh</button>
                    <button style={cs.addBtn} onClick={openAdd}><IconPlus size={13}/>Add listing</button>
                  </div>
                </div>
                {businesses.length === 0 ? (
                  <div style={cs.emptyBox}>
                    <div style={{ marginBottom:12 }}>No listings yet</div>
                    <button style={cs.addBtn} onClick={openAdd}><IconPlus size={13}/>Add your first listing</button>
                  </div>
                ) : (
                  <div style={cs.table}>
                    <div style={{ ...cs.tableHead, gridTemplateColumns:'2fr 1fr 1fr 1fr auto' }}>
                      <span>Business</span><span>Category</span><span>City</span><span>Status</span><span>Actions</span>
                    </div>
                    {businesses.map(b => (
                      <div key={b._id} style={{ ...cs.tableRow, gridTemplateColumns:'2fr 1fr 1fr 1fr auto' }}>
                        <div>
                          {b.photos&&b.photos[0] && <img src={b.photos[0]} alt="" style={{ width:40, height:30, objectFit:'cover', borderRadius:4, marginRight:8, verticalAlign:'middle' }}/>}
                          <span style={{ fontWeight:500, color:'#1B3A2D' }}>{b.name}</span>
                          <div style={{ fontSize:11, color:'#4D7A65' }}>{b.phone}</div>
                        </div>
                        <div style={{ fontSize:12, color:'#4D7A65' }}>{b.category}</div>
                        <div style={{ fontSize:12, color:'#4D7A65' }}>{b.city}</div>
                        <span style={{ ...cs.badge, background:b.verified?'#E8F5EE':'#FDF3DC', color:b.verified?'#2D6A4F':'#8B6A00' }}>{b.verified?'Verified':'Pending'}</span>
                        <div style={{ display:'flex', gap:4 }}>
                          <button style={{ ...cs.btn, background:'#F0F7F4', color:'#2D6A4F' }} onClick={() => openEdit(b)} title="Edit"><IconEdit size={11}/></button>
                          {!b.verified
                            ? <button style={{ ...cs.btn, background:'#E8F5EE', color:'#2D6A4F' }} onClick={() => verify(b._id,true)} title="Verify"><IconShieldCheck size={11}/>Verify</button>
                            : <button style={{ ...cs.btn, background:'#FDF3DC', color:'#8B6A00' }} onClick={() => verify(b._id,false)} title="Unverify"><IconShieldX size={11}/></button>
                          }
                          <button style={{ ...cs.btn, background:'#FEE', color:'#C00' }} onClick={() => deleteBiz(b._id)} title="Delete"><IconTrash size={11}/>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'bookings' && (
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                  <div style={cs.sectionTitle}>All bookings ({bookings.length})</div>
                  <button style={cs.refreshBtn} onClick={fetchAll}><IconRefresh size={13}/>Refresh</button>
                </div>
                {bookings.length === 0 ? <div style={cs.emptyBox}>No bookings yet</div> : (
                  <div style={cs.table}>
                    <div style={{ ...cs.tableHead, gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr auto' }}>
                      <span>Ref</span><span>Guest</span><span>Room</span><span>Dates</span><span>Total</span><span>Status</span>
                    </div>
                    {bookings.map((b,i) => (
                      <div key={b._id||i} style={{ ...cs.tableRow, gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr auto' }}>
                        <div style={{ fontWeight:500, color:'#1B3A2D', fontFamily:'monospace' }}>{b.ref}</div>
                        <div><div style={{ fontSize:12, color:'#1B3A2D' }}>{b.guestName}</div><div style={{ fontSize:10, color:'#4D7A65' }}>{b.guestPhone}</div></div>
                        <div style={{ fontSize:12, color:'#4D7A65' }}>{b.roomName}</div>
                        <div><div style={{ fontSize:11, color:'#1B3A2D' }}>{b.checkIn?new Date(b.checkIn).toLocaleDateString():'-'}</div><div style={{ fontSize:10, color:'#4D7A65' }}>{b.nights} nights</div></div>
                        <div style={{ fontSize:13, fontWeight:500, color:'#1B3A2D' }}>ETB {b.totalPrice?.toLocaleString()}</div>
                        <div style={{ display:'flex', gap:4, flexDirection:'column' }}>
                          <span style={{ ...cs.badge, ...bstatus(b.status) }}>{b.status}</span>
                          {b.status==='pending' && (
                            <div style={{ display:'flex', gap:3 }}>
                              <button style={{ ...cs.btn, background:'#E8F5EE', color:'#2D6A4F', fontSize:10 }} onClick={() => updateBooking(b._id,'confirmed')}><IconCheck size={10}/>OK</button>
                              <button style={{ ...cs.btn, background:'#FEE', color:'#C00', fontSize:10 }} onClick={() => updateBooking(b._id,'cancelled')}><IconX size={10}/></button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'form' && (
              <ListingForm
                form={form} setForm={setForm}
                onSave={saveForm}
                onCancel={() => { setTab('listings'); setShowForm(false); }}
                saving={saving} msg={msg} editId={editId}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
