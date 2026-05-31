import React, { useState, useEffect } from 'react';
import {
  IconBuilding, IconCalendar, IconShieldCheck, IconShieldX,
  IconTrash, IconEdit, IconEye, IconCheck, IconX,
  IconRefresh, IconUsers, IconCurrencyDollar, IconStar
} from '@tabler/icons-react';

const API = 'https://ogso-production.up.railway.app/api';

export default function AdminPage({ onBack }) {
  const [tab, setTab] = useState('overview');
  const [businesses, setBusinesses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [bRes, bookRes] = await Promise.all([
        fetch(`${API}/businesses`),
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
      body: JSON.stringify({ verified })
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

  // Stats
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
    tabs: { display: 'flex', background: '#fff', borderBottom: '0.5px solid #C8E6D8', padding: '0 20px' },
    tab: { padding: '14px 16px', fontSize: 13, color: '#4D7A65', cursor: 'pointer', border: 'none', background: 'none', borderBottom: '2px solid transparent' },
    tabOn: { color: '#2D6A4F', borderBottom: '2px solid #2D6A4F', fontWeight: 500 },
    content: { padding: 20 },
    statGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 20 },
    stat: { background: '#fff', borderRadius: 12, padding: 16, border: '0.5px solid #C8E6D8' },
    statNum: { fontSize: 26, fontWeight: 700, color: '#1B3A2D', marginBottom: 2 },
    statLbl: { fontSize: 11, color: '#4D7A65' },
    statIcon: { width: 36, height: 36, borderRadius: 8, background: '#F0F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
    table: { background: '#fff', borderRadius: 12, border: '0.5px solid #C8E6D8', overflow: 'hidden' },
    tableHead: { background: '#F0F7F4', padding: '10px 16px', display: 'grid', gap: 10, fontSize: 10, fontWeight: 500, color: '#4D7A65', textTransform: 'uppercase', letterSpacing: '.05em' },
    tableRow: { padding: '12px 16px', display: 'grid', gap: 10, borderTop: '0.5px solid #C8E6D8', alignItems: 'center', fontSize: 13 },
    badge: { display: 'inline-block', borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 500 },
    actionBtn: { border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3 },
    sectionTitle: { fontSize: 15, fontWeight: 500, color: '#1B3A2D', marginBottom: 12 },
    refreshBtn: { background: '#F0F7F4', border: '0.5px solid #C8E6D8', borderRadius: 8, padding: '6px 12px', fontSize: 11, color: '#2D6A4F', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 },
    emptyBox: { textAlign: 'center', padding: '40px 20px', color: '#4D7A65', fontSize: 13 },
  };

  const Overview = () => (
    <div>
      <div style={s.statGrid}>
        <div style={s.stat}>
          <div style={s.statIcon}><IconBuilding size={20} color="#2D6A4F"/></div>
          <div style={s.statNum}>{businesses.length}</div>
          <div style={s.statLbl}>Total listings</div>
        </div>
        <div style={s.stat}>
          <div style={s.statIcon}><IconShieldX size={20} color="#D4A843"/></div>
          <div style={s.statNum}>{pendingListings}</div>
          <div style={s.statLbl}>Pending verification</div>
        </div>
        <div style={s.stat}>
          <div style={s.statIcon}><IconCalendar size={20} color="#2D6A4F"/></div>
          <div style={s.statNum}>{bookings.length}</div>
          <div style={s.statLbl}>Total bookings</div>
        </div>
        <div style={s.stat}>
          <div style={s.statIcon}><IconCheck size={20} color="#2D6A4F"/></div>
          <div style={s.statNum}>{confirmedBookings}</div>
          <div style={s.statLbl}>Confirmed bookings</div>
        </div>
        <div style={s.stat}>
          <div style={s.statIcon}><IconCurrencyDollar size={20} color="#D4A843"/></div>
          <div style={s.statNum}>ETB {totalRevenue.toLocaleString()}</div>
          <div style={s.statLbl}>Total booking value</div>
        </div>
        <div style={s.stat}>
          <div style={s.statIcon}><IconEye size={20} color="#2D6A4F"/></div>
          <div style={s.statNum}>{totalViews}</div>
          <div style={s.statLbl}>Total listing views</div>
        </div>
      </div>

      {pendingListings > 0 && (
        <div style={{background:'#FDF3DC',border:'0.5px solid #E8D090',borderRadius:12,padding:16,marginBottom:20}}>
          <div style={{fontSize:14,fontWeight:500,color:'#1B3A2D',marginBottom:4}}>
            {pendingListings} listing{pendingListings>1?'s':''} waiting for verification
          </div>
          <div style={{fontSize:12,color:'#4D7A65',marginBottom:10}}>Review and verify new business submissions</div>
          <button style={{...s.actionBtn,background:'#2D6A4F',color:'#fff',padding:'7px 14px'}} onClick={()=>setTab('listings')}>
            Review listings
          </button>
        </div>
      )}

      <div style={s.sectionTitle}>Recent bookings</div>
      {bookings.slice(0,5).length === 0 ? (
        <div style={s.emptyBox}>No bookings yet</div>
      ) : (
        <div style={s.table}>
          {bookings.slice(0,5).map((b,i)=>(
            <div key={b._id||i} style={{...s.tableRow, gridTemplateColumns:'1fr 1fr 1fr auto'}}>
              <div>
                <div style={{fontWeight:500,color:'#1B3A2D'}}>{b.ref}</div>
                <div style={{fontSize:11,color:'#4D7A65'}}>{b.guestName}</div>
              </div>
              <div style={{fontSize:12,color:'#4D7A65'}}>{b.roomName}</div>
              <div style={{fontSize:13,fontWeight:500,color:'#1B3A2D'}}>ETB {b.totalPrice?.toLocaleString()}</div>
              <span style={{...s.badge, background: b.status==='confirmed'?'#E8F5EE':b.status==='cancelled'?'#FEE':b.status==='pending'?'#FDF3DC':'#F0F7F4', color: b.status==='confirmed'?'#2D6A4F':b.status==='cancelled'?'#C00':b.status==='pending'?'#8B6A00':'#1B3A2D'}}>
                {b.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const Listings = () => (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div style={s.sectionTitle}>All listings ({businesses.length})</div>
        <button style={s.refreshBtn} onClick={fetchAll}><IconRefresh size={13}/>Refresh</button>
      </div>
      {businesses.length === 0 ? (
        <div style={s.emptyBox}>No listings yet</div>
      ) : (
        <div style={s.table}>
          <div style={{...s.tableHead, gridTemplateColumns:'2fr 1fr 1fr 1fr auto'}}>
            <span>Business</span><span>Category</span><span>City</span><span>Status</span><span>Actions</span>
          </div>
          {businesses.map(b=>(
            <div key={b._id} style={{...s.tableRow, gridTemplateColumns:'2fr 1fr 1fr 1fr auto'}}>
              <div>
                <div style={{fontWeight:500,color:'#1B3A2D'}}>{b.name}</div>
                <div style={{fontSize:11,color:'#4D7A65'}}>{b.phone}</div>
              </div>
              <div style={{fontSize:12,color:'#4D7A65'}}>{b.category}</div>
              <div style={{fontSize:12,color:'#4D7A65'}}>{b.city}</div>
              <div>
                <span style={{...s.badge, background: b.verified?'#E8F5EE':'#FDF3DC', color: b.verified?'#2D6A4F':'#8B6A00'}}>
                  {b.verified ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div style={{display:'flex',gap:4}}>
                {!b.verified ? (
                  <button style={{...s.actionBtn,background:'#E8F5EE',color:'#2D6A4F'}} onClick={()=>verify(b._id,true)}>
                    <IconShieldCheck size={12}/>Verify
                  </button>
                ) : (
                  <button style={{...s.actionBtn,background:'#FDF3DC',color:'#8B6A00'}} onClick={()=>verify(b._id,false)}>
                    <IconShieldX size={12}/>Unverify
                  </button>
                )}
                <button style={{...s.actionBtn,background:'#FEE',color:'#C00'}} onClick={()=>deleteBiz(b._id)}>
                  <IconTrash size={12}/>
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
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div style={s.sectionTitle}>All bookings ({bookings.length})</div>
        <button style={s.refreshBtn} onClick={fetchAll}><IconRefresh size={13}/>Refresh</button>
      </div>
      {bookings.length === 0 ? (
        <div style={s.emptyBox}>No bookings yet</div>
      ) : (
        <div style={s.table}>
          <div style={{...s.tableHead, gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr auto'}}>
            <span>Ref</span><span>Guest</span><span>Room</span><span>Dates</span><span>Total</span><span>Status</span>
          </div>
          {bookings.map((b,i)=>(
            <div key={b._id||i} style={{...s.tableRow, gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr auto'}}>
              <div style={{fontWeight:500,color:'#1B3A2D',fontFamily:'monospace'}}>{b.ref}</div>
              <div>
                <div style={{fontSize:12,color:'#1B3A2D'}}>{b.guestName}</div>
                <div style={{fontSize:10,color:'#4D7A65'}}>{b.guestPhone}</div>
              </div>
              <div style={{fontSize:12,color:'#4D7A65'}}>{b.roomName}</div>
              <div>
                <div style={{fontSize:11,color:'#1B3A2D'}}>{b.checkIn ? new Date(b.checkIn).toLocaleDateString() : '-'}</div>
                <div style={{fontSize:10,color:'#4D7A65'}}>{b.nights} nights</div>
              </div>
              <div style={{fontSize:13,fontWeight:500,color:'#1B3A2D'}}>ETB {b.totalPrice?.toLocaleString()}</div>
              <div style={{display:'flex',gap:4,flexDirection:'column'}}>
                <span style={{...s.badge, background: b.status==='confirmed'?'#E8F5EE':b.status==='cancelled'?'#FEE':b.status==='pending'?'#FDF3DC':'#F0F7F4', color: b.status==='confirmed'?'#2D6A4F':b.status==='cancelled'?'#C00':b.status==='pending'?'#8B6A00':'#1B3A2D'}}>
                  {b.status}
                </span>
                {b.status === 'pending' && (
                  <div style={{display:'flex',gap:3}}>
                    <button style={{...s.actionBtn,background:'#E8F5EE',color:'#2D6A4F',fontSize:10}} onClick={()=>updateBooking(b._id,'confirmed')}>
                      <IconCheck size={10}/>OK
                    </button>
                    <button style={{...s.actionBtn,background:'#FEE',color:'#C00',fontSize:10}} onClick={()=>updateBooking(b._id,'cancelled')}>
                      <IconX size={10}/>
                    </button>
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
          {id:'overview', label:'Overview'},
          {id:'listings', label:`Listings (${businesses.length})`},
          {id:'bookings', label:`Bookings (${bookings.length})`},
        ].map(t=>(
          <button key={t.id} style={{...s.tab,...(tab===t.id?s.tabOn:{})}} onClick={()=>setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={s.content}>
        {loading ? (
          <div style={{textAlign:'center',padding:'60px 20px',color:'#4D7A65'}}>Loading admin data...</div>
        ) : (
          <>
            {tab === 'overview' && <Overview/>}
            {tab === 'listings' && <Listings/>}
            {tab === 'bookings' && <Bookings/>}
          </>
        )}
      </div>
    </div>
  );
}

