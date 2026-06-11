import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  IconSearch, IconArrowLeft, IconBuilding, IconMapPin,
  IconStar, IconShieldCheck, IconAdjustmentsHorizontal,
  IconLoader2
} from '@tabler/icons-react';
import Nav from '../components/Nav';
import { HARDCODED_HOTELS, CAT_MAP, API, DEFAULT_PHOTO } from '../shared/data';

const CITIES = ['All cities','Jigjiga','Mogadishu','Hargeisa','Djibouti City','Garissa','Dire Dawa','Harar'];
const CATEGORIES = ['Hotels','Restaurants','Clinics','Pharmacies','Shops','Car hire','Money transfer',
  'Bookshop','Mechanic','Repairs','Petrol Station','Hardware','Bridal Wear','Beauty Salon',
  'Barber','Bakery','Men Wear','Women Wear','Children Wear','Cleaning Service','Shopping Mall',
  'Educational Service','Used Items'];

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [city, setCity] = useState(searchParams.get('city') || 'All cities');
  const [category, setCategory] = useState(searchParams.get('cat') || 'Hotels');
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const LIMIT = 12;

  const fetchResults = useCallback(async (pageNum, replace) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const params = new URLSearchParams();
      if (city !== 'All cities') params.set('city', city);
      const mappedCat = CAT_MAP[category] || category.toLowerCase();
      params.set('category', mappedCat);
      if (verifiedOnly) params.set('verified', 'true');
      if (searchText) params.set('search', searchText);
      params.set('limit', LIMIT);
      params.set('page', pageNum);

      const res = await fetch(`${API}/businesses?${params}`);
      const data = await res.json();
      let businesses = (data.businesses || []).map(b => ({
        id: b._id, name: b.name, city: b.city, suburb: b.suburb || '',
        price: b.price || 0, rating: b.rating || 0, reviews: b.reviewCount || 0,
        verified: b.verified, amenities: b.amenities || [],
        photo: b.photos && b.photos.length > 0 ? b.photos[0] : DEFAULT_PHOTO,
        desc: b.description || '', category: b.category, phone: b.phone || '',
      }));

      if (mappedCat === 'hotel') {
        const dbNames = businesses.map(b => b.name);
        let hardcoded = HARDCODED_HOTELS.filter(h =>
          !dbNames.includes(h.name) &&
          (city === 'All cities' || h.city === city) &&
          (!verifiedOnly || h.verified) &&
          (!searchText || h.name.toLowerCase().includes(searchText.toLowerCase()))
        );
        businesses = [...hardcoded, ...businesses];
      }

      if (sortBy === 'rating') businesses.sort((a,b) => b.rating - a.rating);
      if (sortBy === 'price_low') businesses.sort((a,b) => a.price - b.price);
      if (sortBy === 'price_high') businesses.sort((a,b) => b.price - a.price);

      if (replace) setResults(businesses);
      else setResults(prev => [...prev, ...businesses]);
      setHasMore((data.businesses || []).length === LIMIT);
    } catch (err) {
      if (CAT_MAP[category] === 'hotel' && replace) {
        setResults(HARDCODED_HOTELS.filter(h => city === 'All cities' || h.city === city));
      }
    } finally { setLoading(false); setLoadingMore(false); }
  }, [city, category, verifiedOnly, sortBy, searchText]);

  useEffect(() => {
    setPage(1); setResults([]);
    fetchResults(1, true);
  }, [city, category, verifiedOnly, sortBy, fetchResults]);

  const doSearch = () => { setPage(1); setResults([]); fetchResults(1, true); };

  const s = {
    wrap: { minHeight: '100vh', background: '#F8F4EC' },
    header: { background: '#fff', padding: '12px 16px', borderBottom: '0.5px solid #C8E6D8', position: 'sticky', top: 56, zIndex: 90 },
    searchRow: { display: 'flex', gap: 8, marginBottom: 10 },
    searchBox: { flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#F0F7F4', borderRadius: 10, padding: '0 12px' },
    searchInput: { flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#1B3A2D', padding: '9px 0' },
    searchBtn: { background: '#2D6A4F', border: 'none', borderRadius: 8, padding: '8px 14px', color: '#fff', fontSize: 12, cursor: 'pointer' },
    filterBtn: { background: '#F0F7F4', border: '0.5px solid #C8E6D8', borderRadius: 10, padding: '8px 12px', fontSize: 11, color: '#2D6A4F', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 },
    filterPanel: { background: '#F8F4EC', borderRadius: 10, padding: 12, marginBottom: 10, border: '0.5px solid #C8E6D8' },
    filterGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
    filterLabel: { fontSize: 10, color: '#4D7A65', marginBottom: 3 },
    filterSelect: { width: '100%', padding: '7px 10px', border: '0.5px solid #C8E6D8', borderRadius: 8, fontSize: 12, color: '#1B3A2D', background: '#fff' },
    chips: { display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 },
    chip: { background: '#F0F7F4', border: '0.5px solid #C8E6D8', borderRadius: 20, padding: '4px 10px', fontSize: 10, color: '#2D6A4F', whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0 },
    chipOn: { background: '#2D6A4F', borderColor: '#2D6A4F', color: '#fff' },
    results: { padding: 16 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 },
    card: { background: '#fff', border: '0.5px solid #C8E6D8', borderRadius: 12, overflow: 'hidden', cursor: 'pointer' },
    cardImg: { height: 140, overflow: 'hidden', position: 'relative' },
    vbadge: { position: 'absolute', top: 8, left: 8, background: '#fff', border: '0.5px solid #52B788', borderRadius: 4, padding: '2px 8px', fontSize: 9, color: '#1B3A2D', fontWeight: 500 },
    cardBody: { padding: '10px 12px' },
    tag: { display: 'inline-block', background: '#F0F7F4', borderRadius: 4, fontSize: 9, color: '#1B3A2D', padding: '2px 5px', margin: '1px 2px 1px 0' },
    loading: { textAlign: 'center', padding: '60px 20px' },
    empty: { textAlign: 'center', padding: '50px 20px', background: '#fff', borderRadius: 14 },
    loadMore: { display: 'block', width: '100%', padding: 12, background: '#fff', border: '1px solid #2D6A4F', borderRadius: 10, color: '#2D6A4F', fontSize: 13, cursor: 'pointer', marginTop: 16 },
  };

  return (
    <div style={s.wrap}>
      <Nav/>
      <div style={s.header}>
        <div style={s.searchRow}>
          <div style={s.searchBox}>
            <IconSearch size={14} color="#4D7A65"/>
            <input style={s.searchInput}
              placeholder={`Search ${category.toLowerCase()} by name...`}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}/>
          </div>
          <button style={s.searchBtn} onClick={doSearch}>Search</button>
          <button style={s.filterBtn} onClick={() => setShowFilters(!showFilters)}>
            <IconAdjustmentsHorizontal size={13}/>
          </button>
          <button style={s.filterBtn} onClick={() => navigate(-1)}>
            <IconArrowLeft size={13}/>
          </button>
        </div>

        {showFilters && (
          <div style={s.filterPanel}>
            <div style={s.filterGrid}>
              <div>
                <div style={s.filterLabel}>City</div>
                <select style={s.filterSelect} value={city} onChange={e => setCity(e.target.value)}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div style={s.filterLabel}>Category</div>
                <select style={s.filterSelect} value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div style={s.filterLabel}>Sort by</div>
                <select style={s.filterSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="rating">Top rated</option>
                  <option value="price_low">Price: low to high</option>
                  <option value="price_high">Price: high to low</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 16 }}>
                <input type="checkbox" id="verified" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)}/>
                <label htmlFor="verified" style={{ fontSize: 12, color: '#1B3A2D', cursor: 'pointer' }}>Verified only</label>
              </div>
            </div>
          </div>
        )}

        <div style={s.chips}>
          {CATEGORIES.slice(0, 10).map(cat => (
            <span key={cat}
              style={{ ...s.chip, ...(category === cat ? s.chipOn : {}) }}
              onClick={() => setCategory(cat)}>
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div style={s.results}>
        {loading ? (
          <div style={s.loading}>
            <IconLoader2 size={32} color="#2D6A4F" style={{ animation: 'spin 1s linear infinite' }}/>
            <div style={{ fontSize: 13, color: '#4D7A65', marginTop: 12 }}>Searching...</div>
          </div>
        ) : results.length === 0 ? (
          <div style={s.empty}>
            <IconBuilding size={48} color="#C8E6D8" style={{ marginBottom: 14 }}/>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#1B3A2D', marginBottom: 8 }}>No results found</div>
            <div style={{ fontSize: 13, color: '#4D7A65' }}>Try a different search or be the first to list!</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 12, color: '#4D7A65', marginBottom: 12 }}>{results.length} {category.toLowerCase()} found</div>
            <div style={s.grid}>
              {results.map(h => (
                <div key={h.id} style={s.card} onClick={() => navigate(`/hotel/${h.id}`)}>
                  <div style={s.cardImg}>
                    <img src={h.photo} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    {h.verified && <span style={s.vbadge}><IconShieldCheck size={8} style={{ marginRight: 2 }}/>Verified</span>}
                  </div>
                  <div style={s.cardBody}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1B3A2D', marginBottom: 2 }}>{h.name}</div>
                    <div style={{ fontSize: 10, color: '#4D7A65', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <IconMapPin size={10}/>{h.suburb ? `${h.suburb}, ${h.city}` : h.city}
                    </div>
                    <div>{h.amenities.slice(0, 3).map(a => <span key={a} style={s.tag}>{a}</span>)}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#1B3A2D' }}>
                        {CAT_MAP[category] === 'hotel' && h.price > 0 ? <>ETB {h.price.toLocaleString()}<span style={{ fontSize: 9, color: '#4D7A65' }}>/night</span></> : 'View listing'}
                      </span>
                      {h.rating > 0 && <span style={{ fontSize: 11, color: '#D4A843', display: 'flex', alignItems: 'center', gap: 2 }}><IconStar size={11} fill="#D4A843" color="#D4A843"/>{h.rating}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {hasMore && (
              <button style={s.loadMore} onClick={() => { const n = page + 1; setPage(n); fetchResults(n, false); }} disabled={loadingMore}>
                {loadingMore ? 'Loading...' : 'Load more'}
              </button>
            )}
          </>
        )}
      </div>
      <style>{"@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}"}</style>
    </div>
  );
}
