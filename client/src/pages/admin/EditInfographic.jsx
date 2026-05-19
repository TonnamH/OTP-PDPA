// src/pages/admin/EditInfographic.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function EditInfographic() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('basics');
    const [currentImagePath, setCurrentImagePath] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [status, setStatus] = useState({ loading: false, fetching: true, error: '', success: '' });

    // 1. Fetch existing data
    useEffect(() => {
        const fetchInfographic = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/infographics/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setTitle(data.title);
                    setCategory(data.category);
                    setCurrentImagePath(data.image_path); // Adjust if your DB column is named differently
                    setStatus(prev => ({ ...prev, fetching: false }));
                } else {
                    setStatus(prev => ({ ...prev, fetching: false, error: t('adminEditInfo.messages.errorFetch') }));
                }
            } catch (error) {
                setStatus(prev => ({ ...prev, fetching: false, error: 'Cannot connect to server.' }));
            }
        };
        fetchInfographic();
    }, [id, t]);

    // Handle new image selection & preview
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setNewImage(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    // Cleanup object URL
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, fetching: false, error: '', success: '' });

        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        // Ensure this key ('image') matches your backend multer configuration!
        if (newImage) {
            formData.append('image', newImage); 
        }

        try {
            const response = await fetch(`http://localhost:5000/api/infographics/${id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                setStatus({ loading: false, fetching: false, error: '', success: t('adminEditInfo.messages.success') });
                setTimeout(() => navigate('/admin/dashboard'), 1500);
            } else {
                const data = await response.json();
                setStatus({ loading: false, fetching: false, error: data.error || 'Update failed', success: '' });
            }
        } catch (error) {
            setStatus({ loading: false, fetching: false, error: 'Cannot connect to server.', success: '' });
        }
    };

    // UI Styles
    const inputStyle = {
        width: '100%', padding: '0.9rem 1rem', borderRadius: '8px',
        border: '1px solid var(--border-color)', fontFamily: 'Sarabun, sans-serif',
        fontSize: '1rem', outlineColor: 'var(--primary-navy)', backgroundColor: '#f8fafc',
        marginTop: '0.5rem', marginBottom: '1.5rem', transition: 'border-color 0.2s'
    };
    const labelStyle = { fontFamily: 'Prompt, sans-serif', fontWeight: '600', color: 'var(--primary-navy)' };

    if (status.fetching) {
        return <div style={{ padding: '5rem', textAlign: 'center', fontFamily: 'Prompt, sans-serif' }}>Loading infographic data...</div>;
    }

    return (
        <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh', padding: '3rem 1rem' }}>
            <div className="container" style={{ maxWidth: '650px', backgroundColor: 'white', padding: '3rem', borderRadius: '16px', boxShadow: 'var(--shadow-elegant)' }}>

                <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-gray)', textDecoration: 'none', fontFamily: 'Prompt, sans-serif', fontSize: '0.9rem', marginBottom: '2rem' }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    {t('adminUploadInfo.backToDashboard')}
                </Link>

                <div style={{ borderBottom: '2px solid var(--bg-light)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)', margin: '0 0 0.5rem 0' }}>
                        {t('adminEditInfo.title')}
                    </h1>
                    <p style={{ margin: 0, color: 'var(--text-gray)', fontFamily: 'Sarabun, sans-serif', fontSize: '1.1rem' }}>
                        {t('adminEditInfo.subtitle')}
                    </p>
                </div>

                {status.error && <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', fontFamily: 'Sarabun, sans-serif' }}>{status.error}</div>}
                {status.success && <div style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #22c55e', color: '#15803d', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', fontFamily: 'Sarabun, sans-serif' }}>{status.success}</div>}

                <form onSubmit={handleSubmit}>
                    
                    <label style={labelStyle}>{t('adminUploadInfo.form.titleLabel')} <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />

                    <label style={labelStyle}>{t('adminUploadInfo.form.categoryLabel')} <span style={{ color: '#ef4444' }}>*</span></label>
                    <select required value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                        <option value="basics">{t('adminUploadInfo.form.categoryOptions.basics')}</option>
                        <option value="roles">{t('adminUploadInfo.form.categoryOptions.roles')}</option>
                        <option value="operations">{t('adminUploadInfo.form.categoryOptions.operations')}</option>
                        <option value="it_security">{t('adminUploadInfo.form.categoryOptions.it_security')}</option>
                    </select>

                    <label style={labelStyle}>{t('adminUploadInfo.form.fileLabel')}</label>
                    
                    <div style={{
                        marginTop: '0.5rem', marginBottom: '2rem',
                        border: newImage ? '2px solid #10b981' : '2px dashed #cbd5e1',
                        borderRadius: '12px', padding: '1.5rem',
                        textAlign: 'center', backgroundColor: newImage ? '#f0fdf4' : '#f8fafc',
                        cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative'
                    }}>
                        <input type="file" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }} />
                        
                        {previewUrl ? (
                            <div style={{ color: '#059669', fontFamily: 'Sarabun, sans-serif' }}>
                                <div style={{ backgroundColor: 'white', padding: '0.5rem', borderRadius: '8px', display: 'inline-block', marginBottom: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <img src={previewUrl} alt="New Preview" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '4px' }} />
                                </div>
                                <p style={{ margin: 0, fontWeight: '600' }}>{t('adminUploadInfo.form.fileSelected')} {newImage.name}</p>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#34d399' }}>{t('adminUploadInfo.form.clickToChange')}</p>
                            </div>
                        ) : (
                            <div style={{ color: 'var(--text-gray)', fontFamily: 'Sarabun, sans-serif' }}>
                                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: 'var(--primary-navy)' }}>
                                    {t('adminEditInfo.form.currentImage')}
                                </p>
                                {currentImagePath && (
                                    <div style={{ backgroundColor: 'white', padding: '0.5rem', borderRadius: '8px', display: 'inline-block', marginBottom: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative', zIndex: 5 }}>
                                        <img src={`http://localhost:5000${currentImagePath}`} alt="Current" style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain', borderRadius: '4px' }} />
                                    </div>
                                )}
                                <p style={{ margin: 0, fontSize: '0.95rem' }}>{t('adminEditInfo.form.uploadNew')}</p>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>{t('adminEditInfo.form.keepCurrent')}</p>
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={status.loading} style={{ width: '100%', padding: '1.2rem', backgroundColor: status.loading ? '#94a3b8' : '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontFamily: 'Prompt, sans-serif', cursor: status.loading ? 'not-allowed' : 'pointer', fontWeight: '600', boxShadow: status.loading ? 'none' : '0 4px 12px rgba(245, 158, 11, 0.2)' }}>
                        {status.loading ? t('adminEditInfo.form.updating') : t('adminEditInfo.form.updateBtn')}
                    </button>

                </form>
            </div>
        </div>
    );
}