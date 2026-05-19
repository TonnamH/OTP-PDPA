// src/pages/admin/InfographicUpload.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function InfographicUpload() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('basics');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
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
    formData.append('image', file);

    try {
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

  // --- Premium UI Styles (Matched with DocumentUpload) ---
  const inputStyle = {
    width: '100%', padding: '0.9rem 1rem', borderRadius: '8px',
    border: '1px solid var(--border-color)', fontFamily: 'Sarabun, sans-serif',
    fontSize: '1rem', outlineColor: 'var(--primary-navy)', backgroundColor: '#f8fafc',
    marginTop: '0.5rem', marginBottom: '1.5rem', transition: 'border-color 0.2s'
  };

  const labelStyle = { fontFamily: 'Prompt, sans-serif', fontWeight: '600', color: 'var(--primary-navy)' };

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh', padding: '3rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1400px', backgroundColor: 'white', padding: '3rem', borderRadius: '16px', boxShadow: 'var(--shadow-elegant)' }}>
        
        {/* Back Button */}
        <Link 
            to="/admin/dashboard" 
            style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
                color: 'var(--text-gray)', textDecoration: 'none', 
                fontFamily: 'Prompt, sans-serif', fontSize: '0.9rem', marginBottom: '2rem',
                transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary-navy)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-gray)'}
        >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t('adminUploadInfo.backToDashboard')}
        </Link>

        {/* Header */}
        <div style={{ borderBottom: '2px solid var(--bg-light)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)', margin: '0 0 0.5rem 0' }}>
            {t('adminUploadInfo.title')}
          </h1>
          <p style={{ margin: 0, color: 'var(--text-gray)', fontFamily: 'Sarabun, sans-serif', fontSize: '1.1rem' }}>
            {t('adminUploadInfo.subtitle')}
          </p>
        </div>

        {/* Status Messages */}
        {status.error && (
            <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', fontFamily: 'Sarabun, sans-serif' }}>
                {status.error}
            </div>
        )}
        {status.success && (
            <div style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #22c55e', color: '#15803d', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', fontFamily: 'Sarabun, sans-serif' }}>
                {status.success}
            </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <label style={labelStyle}>{t('adminUploadInfo.form.titleLabel')} <span style={{color: '#ef4444'}}>*</span></label>
          <input 
            type="text" required
            value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder={t('adminUploadInfo.form.titlePlaceholder')}
            style={inputStyle}
          />

          <label style={labelStyle}>{t('adminUploadInfo.form.categoryLabel')} <span style={{color: '#ef4444'}}>*</span></label>
          <select 
            required value={category} onChange={(e) => setCategory(e.target.value)}
            style={{...inputStyle, cursor: 'pointer'}}
          >
            <option value="basics">{t('adminUploadInfo.form.categoryOptions.basics')}</option>
            <option value="roles">{t('adminUploadInfo.form.categoryOptions.roles')}</option>
            <option value="operations">{t('adminUploadInfo.form.categoryOptions.operations')}</option>
            <option value="it_security">{t('adminUploadInfo.form.categoryOptions.it_security')}</option>
          </select>

          {/* Premium Custom Image Upload Area */}
          <label style={labelStyle}>{t('adminUploadInfo.form.fileLabel')} <span style={{color: '#ef4444'}}>*</span></label>
          
          <div style={{
              marginTop: '0.5rem', marginBottom: '2rem',
              border: file ? '2px solid #10b981' : '2px dashed #cbd5e1',
              borderRadius: '12px', padding: file ? '1rem' : '2.5rem 1rem',
              textAlign: 'center', backgroundColor: file ? '#f0fdf4' : '#f8fafc',
              cursor: 'pointer', transition: 'all 0.2s ease',
              position: 'relative'
          }}>
              {/* Hidden Actual Input */}
              <input 
                type="file" id="imageInput" required={!file}
                onChange={handleImageChange}
                accept="image/png, image/jpeg, image/webp"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
              />
              
              {/* Visual UI (Shows Preview if file is selected) */}
              {previewUrl ? (
                  <div style={{ color: '#059669', fontFamily: 'Sarabun, sans-serif' }}>
                      <div style={{ backgroundColor: 'white', padding: '0.5rem', borderRadius: '8px', display: 'inline-block', marginBottom: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <img 
                            src={previewUrl} 
                            alt="Preview" 
                            style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '4px' }} 
                        />
                      </div>
                      <p style={{ margin: 0, fontWeight: '600' }}>{t('adminUploadInfo.form.fileSelected')} {file.name}</p>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#34d399' }}>{t('adminUploadInfo.form.clickToChange')}</p>
                  </div>
              ) : (
                  <div style={{ color: 'var(--text-gray)', fontFamily: 'Sarabun, sans-serif' }}>
                      <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem', color: '#94a3b8' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-dark)' }}>{t('adminUploadInfo.form.clickToBrowse')}</p>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>{t('adminUploadInfo.form.supportedFiles')}</p>
                  </div>
              )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" disabled={status.loading || !file}
            style={{ 
              width: '100%', padding: '1.2rem', 
              backgroundColor: (status.loading || !file) ? '#94a3b8' : 'var(--primary-navy)', 
              color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', 
              fontFamily: 'Prompt, sans-serif', cursor: (status.loading || !file) ? 'not-allowed' : 'pointer', 
              fontWeight: '600', transition: 'background-color 0.2s',
              boxShadow: (status.loading || !file) ? 'none' : '0 4px 12px rgba(24, 35, 55, 0.2)'
            }}
          >
            {status.loading ? t('adminUploadInfo.form.uploading') : t('adminUploadInfo.form.uploadBtn')}
          </button>

        </form>
      </div>
    </div>
  );
}