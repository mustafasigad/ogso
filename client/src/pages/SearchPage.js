import React, { useState, useEffect, useCallback } from 'react';
import {
  IconSearch, IconArrowLeft, IconBuilding, IconMapPin,
  IconStar, IconShieldCheck, IconAdjustmentsHorizontal,
  IconLoader2
} from '@tabler/icons-react';

const CITIES = ['All cities','Jigjiga','Mogadishu','Hargeisa','Djibouti City','Garissa','Dire Dawa','Harar'];
const CATEGORIES = ['Hotels','Restaurants','Clinics','Shops','Car hire','Money transfer'];

const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80';

export default function SearchPage({ initialCity, initialCat, onBack, onSelectHotel }) {
  const [city, setCity] = useState(initialCity || 'All cities');
  const [category, setCategory] = useState(initialCat || 'Hotels');
  const [sortBy, setSortBy] = useState('rating');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const LIMIT = 12;

  const fetchResults = useCallback(async (pageNum, replace) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = new URLSearchParams();
      if (city !== 'All cities') params.set('city', city);
   const catMap = { 'Hotels':'hotel', 'Restaurants':'restaurant', 'Clinics':'clinic', 'Shops':'shop', 'Car hire':'car_hire', 'Money transfer':'money_transfer' };
params.set('category', catMap[category] || category.toLowerCase());
      if (verifiedOnly) params.set('verified', 'true');
      params.set('limit', LIMIT);
      params.set('page', pageNum);

      const res = await fetch(`https://ogso-production.up.railway.app/api/businesses?${params}`);
      const data = await res.json();
      const businesses = (data.businesses || []).map(b => ({
        id: b._id,
        name: b.name,
        city: b.city,
        price: b.price || 850,
        rating: b.rating || 0,
        reviews: b.reviewCount || 0,
        verified: b.verified,
        amenities: b.amenities && b.amenities.length > 0 ? b.amenities : [],
        photo: b.photos && b.photos.length > 0 ? b.photos[0] : DEFAULT_PHOTO,
        desc: b.description || '',
        category: b.category,
      }));

      // Sort client side
      if (sortBy === 'rating') businesses.sort((a,b) => b.rating - a.rating);
      if (sortBy === 'price_low') businesses.sort((a,b) => a.price - b.price);
      if (sortBy === 'price_high') businesses.sort((a,b) => b.price - a.price);

      if (replace) setResults(businesses);
      else setResults(prev => [...prev, ...businesses]);

      setTotal(data.total || businesses.length);
      setHasMore(businesses.length === LIMIT);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [city, category, verifiedOnly, sortBy]);

  useEffect(() => {
    setPage(1);
    setResults([]);
    fetchResults(1, true);
  }, [city, category, verifiedOnly, sortBy]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchResults(next, false);
  };

  const s = {
    wrap: { minHeight: '100vh', background: '#F8F4EC' },
    header: { background: '#fff', padding: '12px 16px', borderBottom: '0.5px solid #C8E6D8', position: 'sticky', top: 56, zIndex: 90 },
    searchBar: { display: 'flex', gap: 8, marginBottom: 10 },
    searchInput: { flex: 1, background: '#F0F7F4', borderRadius: 10, padding: '9px 12px', fontSize: 12, color: '#4D7A65', display: 'flex', alignItems: 'center', gap: 6 },
    backBtn: { background: '#F0F7F4', border: '0.5px solid #C8E6D8', borderRadius: 10, padding: '8px 12px', fontSize: 11, color: '#2D6A4F', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 },
    filterBtn: { background: '#F0F7F4', border: '0.5px solid #C8E6D8', borderRadius: 10, padding: '8px 12px', fontSize: 11, color: '#2D6A4F', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 },
    filterPanel: { background: '#F8F4EC', borderRadius: 10, padding: 12, marginBottom: 10, border: '0.5px solid #C8E6D8' },
    filterGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
    filterLabel: { fontSize: 10, color: '#4D7A65', marginBottom: 3 },
    filterSelect: { width: '100%', padding: '7px 10px', border: '0.5px solid #C8E6D8', borderRadius: 8, fontSize: 12, color: '#1B3A2D', background: '#fff' },
    chips: { display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' },
    chip: { background: '#F0F7F4', border: '0.5px solid #C8E6D8', borderRadius: 20, padding: '4px 10px', fontSize: 10, color: '#2D6A4F', whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0 },
    chipOn: { background: '#2D6A4F', borderColor: '#2D6A4F', color: '#fff' },
    results: { padding: 16 },
    countBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    count: { fontSize: 12, color: '#4D7A65' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 },
    card: { background: '#fff', border: '0.5px solid #C8E6D8', borderRadius: 12, overflow: 'hidden', cursor: 'pointer' },
    cardImg: { height: 140, overflow: 'hidden', position: 'relative' },
    vbadge: { position: 'absolute', top: 8, left: 8, background: '#fff', border: '0.5px solid #52B788', borderRadius: 4, padding: '2px 8px', fontSize: 9, color: '#1B3A2D', fontWeight: 500 },
    cardBody: { padding: '10px 12px' },
    cardName: { fontSize: 13, fontWeight: 500, color: '#1B3A2D', marginBottom: 2 },
    cardLoc: { fontSize: 10, color: '#4D7A65', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 3 },
    cardRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
    cardPrice: { fontSize: 13, fontWeight: 500, color: '#1B3A2D' },
    cardRating: { fontSize: 11, color: '#D4A843', display: 'flex', alignItems: 'center', gap: 2 },
    tag: { display: 'inline-block', background: '#F0F7F4', borderRadius: 4, fontSize: 9, color: '#1B3A2D', padding: '2px 5px', margin: '1px 2px 1px 0' },
    loadMore: { display: 'block', width: '100%', padding: 12, background: '#fff', border: '1px solid #2D6A4F', borderRadius: 10, color: '#2D6A4F', fontSize: 13, fontWeight: 500, cursor: 'pointer', marginTop: 16, textAlign: 'center' },
    loading: { textAlign: 'center', padding: '60px 20px' },
    empty: { textAlign: 'center', padding: '50px 20px', background: '#fff', borderRadius: 14 },
  };

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div style={s.searchBar}>
          <div style={s.searchInput}>
            <IconSearch size={14}/> {category} in {city === 'All cities' ? 'Jigjiga' : city}
          </div>
          <button style={s.filterBtn} onClick={()=>setShowFilters(!showFilters)}>
            <IconAdjustmentsHorizontal size={13}/> Filter
          </button>
          <button style={s.backBtn} onClick={onBack}>
            <IconArrowLeft size={13}/> Back
          </button>
        </div>

        {showFilters && (
          <div style={s.filterPanel}>
            <div style={s.filterGrid}>
              <div>
                <div style={s.filterLabel}>City</div>
                <select style={s.filterSelect} value={city} onChange={e=>setCity(e.target.value)}>
                  {CITIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div style={s.filterLabel}>Category</div>
                <select style={s.filterSelect} value={category} onChange={e=>setCategory(e.target.value)}>
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div style={s.filterLabel}>Sort by</div>
                <select style={s.filterSelect} value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                  <option value="rating">Top rated</option>
                  <option value="price_low">Price: low to high</option>
                  <option value="price_high">Price: high to low</option>
                </select>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8,paddingTop:16}}>
                <input type="checkbox" id="verified" checked={verifiedOnly} onChange={e=>setVerifiedOnly(e.target.checked)}/>
                <label htmlFor="verified" style={{fontSize:12,color:'#1B3A2D',cursor:'pointer'}}>Verified only</label>
              </div>
            </div>
          </div>
        )}

        <div style={s.chips}>
          {['All','Verified','Top rated','Price: low','Price: high'].map(f=>(
            <span key={f} style={{...s.chip,...((f==='Verified'&&verifiedOnly)||(f==='Top rated'&&sortBy==='rating')||(f==='Price: low'&&sortBy==='price_low')||(f==='Price: high'&&sortBy==='price_high')?s.chipOn:{})}}
              onClick={()=>{
                if(f==='Verified') setVerifiedOnly(!verifiedOnly);
                if(f==='Top rated') setSortBy('rating');
                if(f==='Price: low') setSortBy('price_low');
                if(f==='Price: high') setSortBy('price_high');
              }}>
              {f}
            </span>
          ))}
        </div>
      </div>

      <div style={s.results}>
        {loading ? (
          <div style={s.loading}>
            <IconLoader2 size={32} color="#2D6A4F" style={{animation:'spin 1s linear infinite'}}/>
            <div style={{fontSize:13,color:'#4D7A65',marginTop:12}}>Finding businesses...</div>
          </div>
        ) : results.length === 0 ? (
          <div style={s.empty}>
            <IconBuilding size={48} color="#C8E6D8" style={{marginBottom:14}}/>
            <div style={{fontSize:16,fontWeight:500,color:'#1B3A2D',marginBottom:8}}>No {category} found</div>
            <div style={{fontSize:13,color:'#4D7A65',marginBottom:20}}>Be the first to list a {category.toLowerCase()} in {city==='All cities'?'Jigjiga':city}!</div>
          </div>
        ) : (
          <>
            <div style={s.countBar}>
              <div style={s.count}>{total} {category.toLowerCase()} found</div>
              <div style={{fontSize:11,color:'#4D7A65'}}>Page {page}</div>
            </div>
            <div style={s.grid}>
              {results.map(h=>(
                <div key={h.id} style={s.card} onClick={()=>onSelectHotel && onSelectHotel(h)}>
                  <div style={s.cardImg}>
                    <img src={h.photo} alt={h.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    {h.verified && <span style={s.vbadge}><IconShieldCheck size={8} style={{marginRight:2}}/>Verified</span>}
                  </div>
                  <div style={s.cardBody}>
                    <div style={s.cardName}>{h.name}</div>
                    <div style={s.cardLoc}><IconMapPin size={10}/>{h.city}</div>
                    <div>{h.amenities.slice(0,3).map(a=><span key={a} style={s.tag}>{a}</span>)}</div>
                    <div style={s.cardRow}>
                      <span style={s.cardPrice}>
                        {category==='Hotels' ? <>ETB {h.price.toLocaleString()}<span style={{fontSize:9,fontWeight:400,color:'#4D7A65'}}>/night</span></> : 'View listing'}
                      </span>
                      {h.rating > 0 && <span style={s.cardRating}><IconStar size={11} fill="#D4A843" color="#D4A843"/>{h.rating}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {hasMore && (
              <button style={s.loadMore} onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading...' : `Load more ${category.toLowerCase()}`}
              </button>
            )}
            {!hasMore && results.length > 0 && (
              <div style={{textAlign:'center',fontSize:11,color:'#4D7A65',marginTop:16}}>
                Showing all {results.length} results
              </div>
            )}
          </>
        )}
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}


