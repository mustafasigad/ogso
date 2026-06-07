import React, { useState, useRef } from 'react';
import { IconPhoto, IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';

const CLOUD_NAME = 'dkpcbszza';
const UPLOAD_PRESET = 'ogso_hotels';

export function RoomPhotoUpload({ photos = [], onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image file'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10MB'); return; }
    setError(''); setUploading(true); setProgress(0);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'ogso/rooms');
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round(e.loaded / e.total * 100));
      };
      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          onUpdate([...photos, data.secure_url]);
          setUploading(false); setProgress(0);
        } else { setError('Upload failed'); setUploading(false); }
      };
      xhr.onerror = () => { setError('Upload failed'); setUploading(false); };
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
      xhr.send(formData);
    } catch (err) { setError('Upload failed'); setUploading(false); }
    e.target.value = '';
  };

  const removePhoto = (i) => onUpdate(photos.filter((_, idx) => idx !== i));

  return (
    <div style={{ marginTop: 8 }}>
      <label style={{ fontSize: 11, color: '#4D7A65', marginBottom: 6, display: 'block' }}>Room photos ({photos.length})</label>
      {photos.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(80px,1fr))', gap: 6, marginBottom: 8 }}>
          {photos.map((url, i) => (
            <div key={i} style={{ position: 'relative', height: 70, borderRadius: 6, overflow: 'hidden', border: '0.5px solid #C8E6D8' }}>
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              <button onClick={() => removePhoto(i)}
                style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 18, height: 18, color: '#fff', cursor: 'pointer', fontSize: 10, lineHeight: '18px', textAlign: 'center' }}>
                x
              </button>
            </div>
          ))}
        </div>
      )}
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1.5px dashed #C8E6D8', borderRadius: 8, padding: '7px 12px', cursor: uploading ? 'not-allowed' : 'pointer', background: '#fff', marginBottom: 4 }}>
        <IconPhoto size={16} color="#4D7A65"/>
        <span style={{ fontSize: 12, color: '#4D7A65' }}>{uploading ? `Uploading ${progress}%...` : 'Add room photo'}</span>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} disabled={uploading}/>
      </label>
      {uploading && (
        <div style={{ background: '#E8F5EE', borderRadius: 4, height: 4, overflow: 'hidden', marginBottom: 4 }}>
          <div style={{ background: '#2D6A4F', height: '100%', width: `${progress}%`, transition: 'width 0.3s' }}/>
        </div>
      )}
      {error && <div style={{ fontSize: 11, color: '#C00' }}>{error}</div>}
    </div>
  );
}

export function RoomPhotoGallery({ photos = [], roomName, onClose }) {
  const [current, setCurrent] = useState(0);
  if (!photos || photos.length === 0) return null;

  const prev = () => setCurrent(i => (i - 1 + photos.length) % photos.length);
  const next = () => setCurrent(i => (i + 1) % photos.length);

  return (
    <div onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={onClose}
        style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, color: '#fff', cursor: 'pointer', fontSize: 18 }}>x</button>
      
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>{roomName}</div>
      
      <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '70vh' }} onClick={e => e.stopPropagation()}>
        <img src={photos[current]} alt={roomName}
          style={{ maxWidth: '90vw', maxHeight: '70vh', objectFit: 'contain', borderRadius: 8 }}/>
        {photos.length > 1 && (
          <>
            <button onClick={e => { e.stopPropagation(); prev(); }}
              style={{ position: 'absolute', left: -50, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconChevronLeft size={20}/>
            </button>
            <button onClick={e => { e.stopPropagation(); next(); }}
              style={{ position: 'absolute', right: -50, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconChevronRight size={20}/>
            </button>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
          {photos.map((url, i) => (
            <img key={i} src={url} alt="" onClick={e => { e.stopPropagation(); setCurrent(i); }}
              style={{ width: 50, height: 38, objectFit: 'cover', borderRadius: 4, cursor: 'pointer', border: i === current ? '2px solid #fff' : '2px solid transparent', opacity: i === current ? 1 : 0.6 }}/>
          ))}
        </div>
      )}

      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 10 }}>
        {current + 1} / {photos.length} — tap outside to close
      </div>
    </div>
  );
}
