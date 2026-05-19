// src/pages/admin/EditDocument.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function EditDocument() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams(); // Grabs the '5' from /admin/documents/edit/5

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('law');
    const [currentFilePath, setCurrentFilePath] = useState('');
    const [newFile, setNewFile] = useState(null);

    const [status, setStatus] = useState({ loading: false, fetching: true, error: '', success: '' });

    // 1. Fetch existing data when the page loads
    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/documents/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setTitle(data.title);
                    setCategory(data.category);
                    setCurrentFilePath(data.file_path);
                    setStatus(prev => ({ ...prev, fetching: false }));
                } else {
                    setStatus(prev => ({ ...prev, fetching: false, error: t('adminEditDoc.messages.errorFetch') }));
                }
            } catch (error) {
                setStatus(prev => ({ ...prev, fetching: false, error: 'Cannot connect to server.' }));
            }
        };
        fetchDocument();
    }, [id, t]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewFile(e.target.files[0]);
        }
    };

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
        // Only append a file if the admin actually selected a new one to replace the old one!
        if (newFile) {
            formData.append('file', newFile);
        }

        try {
            // Note: We use PUT for editing! Make sure your backend route is router.put('/:id', ...)
            const response = await fetch(`http://localhost:5000/api/documents/${id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                setStatus({ loading: false, fetching: false, error: '', success: t('adminEditDoc.messages.success') });
                setTimeout(() => navigate('/admin/dashboard'), 1500); // Send them back to dashboard after success
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
        return <div style={{ padding: '5rem', textAlign: 'center', fontFamily: 'Prompt, sans-serif' }}>Loading document data...</div>;
    }

    return (
        <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh', padding: '3rem 1rem' }}>
            <div className="container" style={{ maxWidth: '650px', backgroundColor: 'white', padding: '3rem', borderRadius: '16px', boxShadow: 'var(--shadow-elegant)' }}>

                <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-gray)', textDecoration: 'none', fontFamily: 'Prompt, sans-serif', fontSize: '0.9rem', marginBottom: '2rem' }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    {t('adminUploadDoc.backToDashboard')}
                </Link>

                <div style={{ borderBottom: '2px solid var(--bg-light)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)', margin: '0 0 0.5rem 0' }}>
                        {t('adminEditDoc.title')}
                    </h1>
                    <p style={{ margin: 0, color: 'var(--text-gray)', fontFamily: 'Sarabun, sans-serif', fontSize: '1.1rem' }}>
                        {t('adminEditDoc.subtitle')}
                    </p>
                </div>

                {status.error && <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', fontFamily: 'Sarabun, sans-serif' }}>{status.error}</div>}
                {status.success && <div style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #22c55e', color: '#15803d', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', fontFamily: 'Sarabun, sans-serif' }}>{status.success}</div>}

                <form onSubmit={handleSubmit}>
                    
                    <label style={labelStyle}>{t('adminUploadDoc.form.docTitleLabel')} <span style={{ color: '#ef4444' }}>*</span></label>
                    <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />

                    <label style={labelStyle}>{t('adminUploadDoc.form.categoryLabel')} <span style={{ color: '#ef4444' }}>*</span></label>
                    <select required value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                        <option value="law">{t('adminUploadDoc.form.categoryOptions.law')}</option>
                        <option value="order">{t('adminUploadDoc.form.categoryOptions.order')}</option>
                        <option value="policy">{t('adminUploadDoc.form.categoryOptions.policy')}</option>
                        <option value="form">{t('adminUploadDoc.form.categoryOptions.form')}</option>
                    </select>

                    <label style={labelStyle}>{t('adminUploadDoc.form.fileLabel')}</label>
                    <div style={{
                        marginTop: '0.5rem', marginBottom: '2rem',
                        border: newFile ? '2px solid #10b981' : '2px dashed #cbd5e1',
                        borderRadius: '12px', padding: '2rem 1rem',
                        textAlign: 'center', backgroundColor: newFile ? '#f0fdf4' : '#f8fafc',
                        cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative'
                    }}>
                        <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                        
                        {newFile ? (
                            <div style={{ color: '#059669', fontFamily: 'Sarabun, sans-serif' }}>
                                <p style={{ margin: 0, fontWeight: '600' }}>{t('adminUploadDoc.form.fileSelected')} {newFile.name}</p>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#34d399' }}>{t('adminUploadDoc.form.clickToChange')}</p>
                            </div>
                        ) : (
                            <div style={{ color: 'var(--text-gray)', fontFamily: 'Sarabun, sans-serif' }}>
                                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: 'var(--primary-navy)' }}>
                                    {t('adminEditDoc.form.currentFile')} <a href={`http://localhost:5000${currentFilePath}`} target="_blank" rel="noreferrer" style={{color: '#3b82f6'}}>View Current</a>
                                </p>
                                <p style={{ margin: 0, fontSize: '0.95rem' }}>{t('adminEditDoc.form.uploadNew')}</p>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>{t('adminEditDoc.form.keepCurrent')}</p>
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={status.loading} style={{ width: '100%', padding: '1.2rem', backgroundColor: status.loading ? '#94a3b8' : '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontFamily: 'Prompt, sans-serif', cursor: status.loading ? 'not-allowed' : 'pointer', fontWeight: '600' }}>
                        {status.loading ? t('adminEditDoc.form.updating') : t('adminEditDoc.form.updateBtn')}
                    </button>

                </form>
            </div>
        </div>
    );
}