import React, { useState, useRef } from 'react';
import { IconPhoto } from '@tabler/icons-react';

const CLOUD_NAME = 'dkpcbszza';
const UPLOAD_PRESET = 'ogso_hotels';

export default function PhotoUpload({ photos = [], onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [urlInput, setUrlInput] = useState('');
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
      formData.append('folder', 'ogso/hotels');

      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round(e.loaded / e.total * 100));
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          onUpdate([...photos, data.secure_url]);
          setUploading(false);
          setProgress(0);
        } else {
          setError('Upload failed. Please try again.');
          setUploading(false);
        }
      };

      xhr.onerror = () => { setError('Upload failed. Check your connection.'); setUploading(false); };
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
      xhr.send(formData);
    } catch (err) {
      setError('Upload failed: ' + err.message);
      setUploading(false);
    }

    e.target.value = '';
  };

  const addUrl = () => {
    if (!urlInput.trim()) return;
    onUpdate([...photos, urlInput.trim()]);
    setUrlInput('');
  };

  const removePhoto = (i) => onUpdate(photos.filter((_, idx) => idx !== i));

  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 11, color: '#4D7A65', marginBottom: 6, display: 'block' }}>Photos</label>

      {photos.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(90px,1fr))', gap: 8, marginBottom: 8 }}>
          {photos.map((url, i) => (
            <div key={i} style={{ position: 'relative', height: 80, borderRadius: 8, overflow: 'hidden', border: '0.5px solid #C8E6D8' }}>
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              <button onClick={() => removePhoto(i)}
                style={{ position: 'absolute', top: 3, right: 3, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 20, height: 20, color: '#fff', cursor: 'pointer', fontSize: 12, lineHeight: '20px', textAlign: 'center' }}>
                x
              </button>
            </div>
          ))}
        </div>
      )}

      <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1.5px dashed #C8E6D8', borderRadius: 8, padding: 14, textAlign: 'center', cursor: uploading ? 'not-allowed' : 'pointer', background: '#F8F4EC', marginBottom: 6 }}>
        <IconPhoto size={24} color="#4D7A65" style={{ marginBottom: 4 }}/>
        <span style={{ fontSize: 12, color: '#4D7A65' }}>
          {uploading ? `Uploading ${progress}%...` : 'Click to upload photo'}
        </span>
        <span style={{ fontSize: 10, color: '#4D7A65', marginTop: 2 }}>JPG, PNG up to 10MB</span>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} disabled={uploading}/>
      </label>

      {uploading && (
        <div style={{ background: '#E8F5EE', borderRadius: 4, height: 6, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ background: '#2D6A4F', height: '100%', width: `${progress}%`, transition: 'width 0.3s' }}/>
        </div>
      )}

      {error && <div style={{ fontSize: 11, color: '#C00', marginBottom: 6 }}>{error}</div>}

      <div style={{ display: 'flex', gap: 6 }}>
        <input
          style={{ flex: 1, padding: '8px 10px', border: '0.5px solid #C8E6D8', borderRadius: 8, fontSize: 12, color: '#1B3A2D', background: '#fff' }}
          placeholder="Or paste a photo URL..."
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addUrl()}
        />
        <button
          style={{ background: '#2D6A4F', border: 'none', borderRadius: 8, padding: '0 14px', color: '#fff', fontSize: 12, cursor: 'pointer' }}
          onClick={addUrl}>Add</button>
      </div>
    </div>
  );
}
