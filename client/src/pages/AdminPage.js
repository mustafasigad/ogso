import React, { useState, useEffect } from 'react';
import {
  IconBuilding, IconCalendar, IconShieldCheck, IconShieldX,
  IconTrash, IconEdit, IconEye, IconCheck, IconX,
  IconRefresh, IconCurrencyDollar, IconPlus, IconArrowLeft,
  IconPhoto, IconPhone, IconMapPin
} from '@tabler/icons-react';

const API = 'https://ogso-production.up.railway.app/api';

const EMPTY_FORM = {
  name: '', category: 'hotel', city: 'Jigjiga', territory: 'ET-SO',
  address: '', phone: '', whatsapp: '', email: '',
  description: '', photos: '', amenities: '',
  price: '', verified: false, featured: false, plan: 'free',
  rooms: [
    { type: 'standard', name: 'Standard Room', price: '', beds: 'Double bed, AC, en-suite bathroom', popular: false },
    { type: 'deluxe', name: 'Deluxe Room', price: '', beds: 'King bed, city view, minibar', popular: true },
  ]
};

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

  const fetchAll = async () => {
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
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const verify = async (id, verified) => {
    await fetch(`${API}/businesses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified, active: verified })
    });
    fetchAll();
  };

  const deleteBiz = async (id) => {
    if (!window.confirm('Deactivate this listing?')) return;
    await fetch(`${API}/businesses/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const updateBooking = async (id, status) => {
    await fetch(`${API}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchAll();
  };

  const openEdit = (b) => {
    setEditId(b._id);
    setForm({
      name: b.name || '',
      category: b.category || 'hotel',
      city: b.city || 'Jigjiga',
      territory: b.territory || 'ET-SO',
      address: b.address || '',
      phone: b.phone || '',
      whatsapp: b.whatsapp || '',
      email: b.email || '',
      description: b.description || '',
      photos: (b.photos || []).join('\n'),
      amenities: (b.amenities || []).join(', '),
      price: b.price || '',
      verified: b.verified || false,
      featured: b.featured || false,
      plan: b.plan || 'free',
      rooms: b.rooms || EMPTY_FORM.rooms,
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
    setSaving(true);
    setMsg('');
    try {
      const payload = {
        ...form,
        photos: form.photos ? form.photos.split('\n').map(p => p.trim()).filter(Boolean) : [],
        amenities: form.amenities ? form.amenities.split(',').map(a => a.trim()).filter(Boolean) : [],
        active: form.verified,
        price: Number(form.price) || 0,
        rooms: form.rooms.map(r => ({ ...r, price: Number(r.price) || 0 })),
      };

      if (editId) {
        await fetch(`${API}/businesses/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        setMsg('Listing updated!');
      } else {
        await fetch(`${API}/businesses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        setMsg('Listing added!');
      }
      fetchAll();
      setTimeout(() => { setTab('listings'); setShowForm(false); setMsg(''); }, 1500);
    } catch (err) {
      setMsg('Error saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateRoom = (i, field, val) => {
    const rooms = [...form.rooms];
    rooms[i] = { ...rooms[i], [field]: val };
    setForm({ ...form, rooms });
  };

  const addRoom = () => {
    setForm({ ...form, rooms: [...form.rooms, { type: 'standard', name: '', price: '', beds: '', popular: false }] });
  };

  const removeRoom = (i) => {
    setForm({ ...form, rooms: form.rooms.filter((_, idx) => idx !== i) });
  };

  const totalRevenue = bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
  const pendingListings = businesses.filter(b => !b.verified).length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalViews = businesses.reduce((s, b) => s + (b.views || 0), 0);

  const s = {
    wrap: { minHeight: '100vh', background: '#F8F4EC' },
    nav: { background: '#1B3A2D', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 },
    navTitle: { fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 700, color: '#fff' },
    navSub: { fontSize: 9, color: '#52B788' },
    backBtn: { background: 'transparent', border: '1px solid #52B788', borderRadius: 8, padding: '6px 12px', color: '#52B788', fontSize: 12, cursor: 'pointer' },
    tabs: { display: 'flex', background: '#fff', borderBottom: '0.5px solid #C8E6D8', padding: '0 20px', overflowX: 'auto' },
    tab: { padding: '14px 16px', fontSize: 13, color: '#4D7A65', cursor: 'pointer', border: 'none', background: 'none', borderBottom: '2px solid transparent', whiteSpace: 'nowrap' },
    tabOn: { color: '#2D6A4F', borderBottom: '2px solid #2D6A4F', fontWeight: 500 },
    content: { padding: 20 },
    statGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 12, marginBottom: 20 },
    stat: { background: '#fff', borderRadius: 12, padding: 16, border: '0.5px solid #C8E6D8' },
    statNum: { fontSize: 22, fontWeight: 700, color: '#1B3A2D', marginBottom: 2 },
    statLbl: { fontSize: 11, color: '#4D7A65' },
    statIcon: { width: 34, height: 34, borderRadius: 8, background: '#F0F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
    table: { background: '#fff', borderRadius: 12, border: '0.5px solid #C8E6D8', overflow: 'hidden' },
    tableHead: { background: '#F0F7F4', padding: '10px 16px', display: 'grid', gap: 10, fontSize: 10, fontWeight: 500, color: '#4D7A65', textTransform: 'uppercase', letterSpacing: '.05em' },
    tableRow: { padding: '12px 16px', display: 'grid', gap: 10, borderTop: '0.5px solid #C8E6D8', alignItems: 'center', fontSize: 13 },
    badge: { display: 'inline-block', borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 500 },
    actionBtn: { border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 11, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3 },
    sectionTitle: { fontSize: 15, fontWeight: 500, color: '#1B3A2D', marginBottom: 12 },
    refreshBtn: { background: '#F0F7F4', border: '0.5px solid #C8E6D8', borderRadius: 8, padding: '6px 12px', fontSize: 11, color: '#2D6A4F', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 },
    addBtn: { background: '#2D6A4F', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 },
    emptyBox: { textAlign: 'center', padding: '40px 20px', color: '#4D7A65', fontSize: 13 },
    formCard: { background: '#fff', borderRadius: 12, border: '0.5px solid #C8E6D8', padding: 16, marginBottom: 14 },
    formLabel: { fontSize: 11, color: '#4D7A65', marginBottom: 3, display: 'block' },
    formInput: { width: '100%', padding: '9px 11px', border: '0.5px solid #C8E6D8', borderRadius: 8, fontSize: 13, color: '#1B3A2D', marginBottom: 12, background: '#fff', boxSizing: 'border-box' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
    saveBtn: { width: '100%', padding: 13, background: '#2D6A4F', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 8 },
    cancelBtn: { width: '100%', padding: 10, background: 'transparent', border: '1px solid #2D6A4F', borderRadius: 10, color: '#2D6A4F', fontSize: 12, cursor: 'pointer' },
    roomCard: { background: '#F8F4EC', borderRadius: 10, padding: 12, marginBottom: 10, border: '0.5px solid #C8E6D8' },
  };

  const FormView = () => (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button style={{ ...s.actionBtn, background: '#F0F7F4', color: '#2D6A4F' }} onClick={() => { setTab('listings'); setShowForm(false); }}>
          <IconArrowLeft size={13}/> Back
        </button>
        <div style={{ fontSize: 16, fontWeight: 500, color: '#1B3A2D' }}>{editId ? 'Edit listing' : 'Add new listing'}</div>
      </div>

      {msg && <div style={{ background: msg.includes('Error') ? '#FEE' : '#E8F5EE', border: `0.5px solid ${msg.includes('Error') ? '#F99' : '#52B788'}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: msg.includes('Error') ? '#C00' : '#2D6A4F', marginBottom: 14 }}>{msg}</div>}

      <div style={s.formCard}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#1B3A2D', marginBottom: 14 }}>Basic details</div>
        <div style={s.formGrid}>
          <div>
            <label style={s.formLabel}>Business name *</label>
            <input style={s.formInput} placeholder="e.g. Jigjiga Grand Hotel" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/>
          </div>
          <div>
            <label style={s.formLabel}>Category</label>
            <select style={s.formInput} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
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
            <label style={s.formLabel}>City</label>
            <select style={s.formInput} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}>
              {['Jigjiga','Mogadishu','Hargeisa','Djibouti City','Garissa','Dire Dawa','Harar'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={s.formLabel}>Territory</label>
            <select style={s.formInput} value={form.territory} onChange={e => setForm({ ...form, territory: e.target.value })}>
              <option value="ET-SO">Somali Region, Ethiopia</option>
              <option value="SO">Somalia</option>
              <option value="SO-SL">Somaliland</option>
              <option value="DJ">Djibouti</option>
              <option value="KE-NFD">Kenya NFD</option>
            </select>
          </div>
          <div>
            <label style={s.formLabel}>Phone / WhatsApp *</label>
            <input style={s.formInput} placeholder="+251 9XX XXX XXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value, whatsapp: e.target.value })}/>
          </div>
          <div>
            <label style={s.formLabel}>Base price (ETB/night)</label>
            <input style={s.formInput} type="number" placeholder="850" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}/>
          </div>
        </div>
        <div>
          <label style={s.formLabel}>Address</label>
          <input style={s.formInput} placeholder="Street, District, City" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}/>
        </div>
        <div>
          <label style={s.formLabel}>Description</label>
          <textarea style={{ ...s.formInput, resize: 'none' }} rows={3} placeholder="Describe the business..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}/>
        </div>
        <div>
          <label style={s.formLabel}>Amenities (comma separated)</label>
          <input style={s.formInput} placeholder="WiFi, Breakfast, AC, Parking, Prayer room" value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })}/>
        </div>
        <div>
          <label style={s.formLabel}>Photo URLs (one per line)</label>
          <textarea style={{ ...s.formInput, resize: 'none' }} rows={2} placeholder="https://images.unsplash.com/..." value={form.photos} onChange={e => setForm({ ...form, photos: e.target.value })}/>
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 4 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#1B3A2D', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.verified} onChange={e => setForm({ ...form, verified: e.target.checked, active: e.target.checked })}/>
            Verified
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#1B3A2D', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })}/>
            Featured
          </label>
        </div>
      </div>

      {form.category === 'hotel' && (
        <div style={s.formCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#1B3A2D' }}>Room types</div>
            <button style={{ ...s.actionBtn, background: '#F0F7F4', color: '#2D6A4F' }} onClick={addRoom}>
              <IconPlus size={12}/> Add room
            </button>
          </div>
          {form.rooms.map((r, i) => (
            <div key={i} style={s.roomCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#1B3A2D' }}>Room {i + 1}</div>
                {form.rooms.length > 1 && (
                  <button style={{ ...s.actionBtn, background: '#FEE', color: '#C00' }} onClick={() => removeRoom(i)}>
                    <IconTrash size={11}/>
                  </button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label style={s.formLabel}>Room name</label>
                  <input style={{ ...s.formInput, marginBottom: 0 }} placeholder="Deluxe Room" value={r.name} onChange={e => updateRoom(i, 'name', e.target.value)}/>
                </div>
                <div>
                  <label style={s.formLabel}>Price (ETB/night)</label>
                  <input style={{ ...s.formInput, marginBottom: 0 }} type="number" placeholder="1200" value={r.price} onChange={e => updateRoom(i, 'price', e.target.value)}/>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={s.formLabel}>Room description</label>
                  <input style={{ ...s.formInput, marginBottom: 0 }} placeholder="King bed, city view, minibar, AC" value={r.beds} onChange={e => updateRoom(i, 'beds', e.target.value)}/>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#1B3A2D', cursor: 'pointer' }}>
                  <input type="checkbox" checked={r.popular} onChange={e => updateRoom(i, 'popular', e.target.checked)}/>
                  Mark as popular
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      <button style={s.saveBtn} onClick={saveForm} disabled={saving}>
        {saving ? 'Saving...' : editId ? 'Update listing' : 'Add listing'}
      </button>
      <button style={s.cancelBtn} onClick={() => { setTab('listings'); setShowForm(false); }}>Cancel</button>
    </div>
  );

  const Overview = () => (
    <div>
      <div style={s.statGrid}>
        {[
          { icon: <IconBuilding size={18} color="#2D6A4F"/>, num: businesses.length, lbl: 'Total listings' },
          { icon: <IconShieldX size={18} color="#D4A843"/>, num: pendingListings, lbl: 'Pending verification' },
          { icon: <IconCalendar size={18} color="#2D6A4F"/>, num: bookings.length, lbl: 'Total bookings' },
          { icon: <IconCheck size={18} color="#2D6A4F"/>, num: confirmedBookings, lbl: 'Confirmed' },
          { icon: <IconCurrencyDollar size={18} color="#D4A843"/>, num: `ETB ${totalRevenue.toLocaleString()}`, lbl: 'Booking value' },
          { icon: <IconEye size={18} color="#2D6A4F"/>, num: totalViews, lbl: 'Total views' },
        ].map((st, i) => (
          <div key={i} style={s.stat}>
            <div style={s.statIcon}>{st.icon}</div>
            <div style={s.statNum}>{st.num}</div>
            <div style={s.statLbl}>{st.lbl}</div>
          </div>
        ))}
      </div>

      {pendingListings > 0 && (
        <div style={{ background: '#FDF3DC', border: '0.5px solid #E8D090', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#1B3A2D', marginBottom: 4 }}>{pendingListings} listing{pendingListings > 1 ? 's' : ''} waiting for verification</div>
          <div style={{ fontSize: 12, color: '#4D7A65', marginBottom: 10 }}>Review and verify new business submissions</div>
          <button style={{ ...s.actionBtn, background: '#2D6A4F', color: '#fff', padding: '7px 14px' }} onClick={() => setTab('listings')}>Review listings</button>
        </div>
      )}

      <div style={s.sectionTitle}>Recent bookings</div>
      {bookings.length === 0 ? (
        <div style={s.emptyBox}>No bookings yet</div>
      ) : (
        <div style={s.table}>
          {bookings.slice(0, 5).map((b, i) => (
            <div key={b._id || i} style={{ ...s.tableRow, gridTemplateColumns: '1fr 1fr 1fr auto' }}>
              <div>
                <div style={{ fontWeight: 500, color: '#1B3A2D' }}>{b.ref}</div>
                <div style={{ fontSize: 11, color: '#4D7A65' }}>{b.guestName}</div>
              </div>
              <div style={{ fontSize: 12, color: '#4D7A65' }}>{b.roomName}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#1B3A2D' }}>ETB {b.totalPrice?.toLocaleString()}</div>
              <span style={{ ...s.badge, background: b.status === 'confirmed' ? '#E8F5EE' : b.status === 'cancelled' ? '#FEE' : '#FDF3DC', color: b.status === 'confirmed' ? '#2D6A4F' : b.status === 'cancelled' ? '#C00' : '#8B6A00' }}>{b.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const Listings = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={s.sectionTitle}>All listings ({businesses.length})</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={s.refreshBtn} onClick={fetchAll}><IconRefresh size={13}/>Refresh</button>
          <button style={s.addBtn} onClick={openAdd}><IconPlus size={13}/>Add listing</button>
        </div>
      </div>
      {businesses.length === 0 ? (
        <div style={s.emptyBox}>
          <div style={{ marginBottom: 12 }}>No listings yet</div>
          <button style={s.addBtn} onClick={openAdd}><IconPlus size={13}/>Add your first listing</button>
        </div>
      ) : (
        <div style={s.table}>
          <div style={{ ...s.tableHead, gridTemplateColumns: '2fr 1fr 1fr 1fr auto' }}>
            <span>Business</span><span>Category</span><span>City</span><span>Status</span><span>Actions</span>
          </div>
          {businesses.map(b => (
            <div key={b._id} style={{ ...s.tableRow, gridTemplateColumns: '2fr 1fr 1fr 1fr auto' }}>
              <div>
                <div style={{ fontWeight: 500, color: '#1B3A2D' }}>{b.name}</div>
                <div style={{ fontSize: 11, color: '#4D7A65' }}>{b.phone}</div>
              </div>
              <div style={{ fontSize: 12, color: '#4D7A65' }}>{b.category}</div>
              <div style={{ fontSize: 12, color: '#4D7A65' }}>{b.city}</div>
              <div>
                <span style={{ ...s.badge, background: b.verified ? '#E8F5EE' : '#FDF3DC', color: b.verified ? '#2D6A4F' : '#8B6A00' }}>
                  {b.verified ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={{ ...s.actionBtn, background: '#F0F7F4', color: '#2D6A4F' }} onClick={() => openEdit(b)}>
                  <IconEdit size={11}/>
                </button>
                {!b.verified ? (
                  <button style={{ ...s.actionBtn, background: '#E8F5EE', color: '#2D6A4F' }} onClick={() => verify(b._id, true)}>
                    <IconShieldCheck size={11}/>Verify
                  </button>
                ) : (
                  <button style={{ ...s.actionBtn, background: '#FDF3DC', color: '#8B6A00' }} onClick={() => verify(b._id, false)}>
                    <IconShieldX size={11}/>
                  </button>
                )}
                <button style={{ ...s.actionBtn, background: '#FEE', color: '#C00' }} onClick={() => deleteBiz(b._id)}>
                  <IconTrash size={11}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const Bookings = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={s.sectionTitle}>All bookings ({bookings.length})</div>
        <button style={s.refreshBtn} onClick={fetchAll}><IconRefresh size={13}/>Refresh</button>
      </div>
      {bookings.length === 0 ? (
        <div style={s.emptyBox}>No bookings yet</div>
      ) : (
        <div style={s.table}>
          <div style={{ ...s.tableHead, gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto' }}>
            <span>Ref</span><span>Guest</span><span>Room</span><span>Dates</span><span>Total</span><span>Status</span>
          </div>
          {bookings.map((b, i) => (
            <div key={b._id || i} style={{ ...s.tableRow, gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto' }}>
              <div style={{ fontWeight: 500, color: '#1B3A2D', fontFamily: 'monospace' }}>{b.ref}</div>
              <div>
                <div style={{ fontSize: 12, color: '#1B3A2D' }}>{b.guestName}</div>
                <div style={{ fontSize: 10, color: '#4D7A65' }}>{b.guestPhone}</div>
              </div>
              <div style={{ fontSize: 12, color: '#4D7A65' }}>{b.roomName}</div>
              <div>
                <div style={{ fontSize: 11, color: '#1B3A2D' }}>{b.checkIn ? new Date(b.checkIn).toLocaleDateString() : '-'}</div>
                <div style={{ fontSize: 10, color: '#4D7A65' }}>{b.nights} nights</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#1B3A2D' }}>ETB {b.totalPrice?.toLocaleString()}</div>
              <div style={{ display: 'flex', gap: 4, flexDirection: 'column' }}>
                <span style={{ ...s.badge, background: b.status === 'confirmed' ? '#E8F5EE' : b.status === 'cancelled' ? '#FEE' : '#FDF3DC', color: b.status === 'confirmed' ? '#2D6A4F' : b.status === 'cancelled' ? '#C00' : '#8B6A00' }}>{b.status}</span>
                {b.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 3 }}>
                    <button style={{ ...s.actionBtn, background: '#E8F5EE', color: '#2D6A4F', fontSize: 10 }} onClick={() => updateBooking(b._id, 'confirmed')}><IconCheck size={10}/>OK</button>
                    <button style={{ ...s.actionBtn, background: '#FEE', color: '#C00', fontSize: 10 }} onClick={() => updateBooking(b._id, 'cancelled')}><IconX size={10}/></button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={s.wrap}>
      <nav style={s.nav}>
        <div>
          <div style={s.navTitle}>Ogso Admin</div>
          <div style={s.navSub}>Every business, verified.</div>
        </div>
        <button style={s.backBtn} onClick={onBack}>Back to site</button>
      </nav>

      <div style={s.tabs}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'listings', label: `Listings (${businesses.length})` },
          { id: 'bookings', label: `Bookings (${bookings.length})` },
          ...(showForm ? [{ id: 'form', label: editId ? 'Edit listing' : 'Add listing' }] : []),
        ].map(t => (
          <button key={t.id} style={{ ...s.tab, ...(tab === t.id ? s.tabOn : {}) }} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={s.content}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4D7A65' }}>Loading admin data...</div>
        ) : (
          <>
            {tab === 'overview' && <Overview/>}
            {tab === 'listings' && <Listings/>}
            {tab === 'bookings' && <Bookings/>}
            {tab === 'form' && <FormView/>}
          </>
        )}
      </div>
    </div>
  );
}
