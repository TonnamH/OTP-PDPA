// src/pages/admin/InfographicUpload.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function InfographicUpload() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('basics');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // New state for image preview
  
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  // Handle the file selection AND generate a preview
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create a temporary local URL for the preview
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  // Cleanup the object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setStatus({ loading: false, error: t('adminUploadInfo.messages.errorAuth'), success: '' });
      setTimeout(() => navigate('/admin/login'), 2000);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', file); // We will expect 'image' in the backend Multer setup

    try {
      // NOTE: We will need to create this route on the Node backend!
      const response = await fetch('http://localhost:5000/api/infographics/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        setStatus({ loading: false, error: '', success: t('adminUploadInfo.messages.success') });
        setTitle('');
        setCategory('basics');
        setFile(null);
        setPreviewUrl(null);
        document.getElementById('imageInput').value = ''; 
      } else if (response.status === 401) {
        setStatus({ loading: false, error: t('adminUploadInfo.messages.errorAuth'), success: '' });
        localStorage.removeItem('adminToken');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        const data = await response.json();
        setStatus({ loading: false, error: data.error || t('adminUploadInfo.messages.errorGeneric'), success: '' });
      }
    } catch (error) {
      console.error('Upload Error:', error);
      setStatus({ loading: false, error: 'Cannot connect to the server.', success: '' });
    }
  };

  // Styles
  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem', borderRadius: '4px',
    border: '1px solid var(--border-color)', fontFamily: 'Sarabun, sans-serif',
    fontSize: '1rem', outlineColor: 'var(--primary-navy)', backgroundColor: '#fff',
    marginTop: '0.5rem', marginBottom: '1.5rem'
  };

  const labelStyle = { fontFamily: 'Prompt, sans-serif', fontWeight: '500', color: 'var(--text-dark)' };

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '80vh', padding: '3rem 1rem' }}>
      <div className="container" style={{ maxWidth: '700px', backgroundColor: 'white', padding: '3rem', borderRadius: '12px', boxShadow: 'var(--shadow-elegant)' }}>
        
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)', margin: '0 0 0.5rem 0' }}>
            {t('adminUploadInfo.title')}
          </h1>
          <p style={{ margin: 0, color: 'var(--text-gray)', fontFamily: 'Sarabun, sans-serif' }}>
            {t('adminUploadInfo.subtitle')}
          </p>
        </div>

        {status.error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', fontFamily: 'Sarabun, sans-serif' }}>
            {status.error}
          </div>
        )}
        {status.success && (
          <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', fontFamily: 'Sarabun, sans-serif' }}>
            {status.success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <label style={labelStyle}>{t('adminUploadInfo.form.titleLabel')} <span style={{color: 'red'}}>*</span></label>
          <input 
            type="text" required
            value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder={t('adminUploadInfo.form.titlePlaceholder')}
            style={inputStyle}
          />

          <label style={labelStyle}>{t('adminUploadInfo.form.categoryLabel')} <span style={{color: 'red'}}>*</span></label>
          <select 
            required value={category} onChange={(e) => setCategory(e.target.value)}
            style={{...inputStyle, cursor: 'pointer'}}
          >
            <option value="basics">{t('adminUploadInfo.form.categoryOptions.basics')}</option>
            <option value="roles">{t('adminUploadInfo.form.categoryOptions.roles')}</option>
            <option value="operations">{t('adminUploadInfo.form.categoryOptions.operations')}</option>
            <option value="it_security">{t('adminUploadInfo.form.categoryOptions.it_security')}</option>
          </select>

          <label style={labelStyle}>{t('adminUploadInfo.form.fileLabel')} <span style={{color: 'red'}}>*</span></label>
          <input 
            type="file" id="imageInput" required
            onChange={handleImageChange}
            accept="image/png, image/jpeg, image/webp" // Restrict to images only
            style={{...inputStyle, padding: '0.5rem', cursor: 'pointer'}}
          />

          {/* IMAGE PREVIEW BOX */}
          {previewUrl && (
            <div style={{ 
              marginBottom: '1.5rem', padding: '1rem', border: '1px dashed var(--border-color)', 
              borderRadius: '8px', backgroundColor: '#fafafa', textAlign: 'center' 
            }}>
              <p style={{ margin: '0 0 0.5rem 0', fontFamily: 'Sarabun, sans-serif', fontSize: '0.9rem', color: 'var(--text-gray)' }}>
                Image Preview:
              </p>
              <img 
                src={previewUrl} 
                alt="Preview" 
                style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
              />
            </div>
          )}

          <button 
            type="submit" disabled={status.loading || !file}
            style={{ 
              width: '100%', padding: '1rem', backgroundColor: (status.loading || !file) ? '#94a3b8' : 'var(--primary-navy)', 
              color: 'white', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontFamily: 'Prompt, sans-serif',
              cursor: (status.loading || !file) ? 'not-allowed' : 'pointer', fontWeight: '600'
            }}
          >
            {status.loading ? t('adminUploadInfo.form.uploading') : t('adminUploadInfo.form.uploadBtn')}
          </button>

        </form>
      </div>
    </div>
  );
}