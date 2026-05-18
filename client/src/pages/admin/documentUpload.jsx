// src/pages/admin/DocumentUpload.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function DocumentUpload() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('law');
    const [file, setFile] = useState(null);

    const [status, setStatus] = useState({ loading: false, error: '', success: '' });

    // Handle the file selection separately
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: '' });

        // 1. Grab the VIP wristband
        const token = localStorage.getItem('adminToken');
        if (!token) {
            setStatus({ loading: false, error: t('adminUploadDoc.messages.errorAuth'), success: '' });
            setTimeout(() => navigate('/admin/login'), 2000);
            return;
        }

        // 2. Pack the box (FormData is required for files)
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('file', file);

        try {
            // 3. Send it to the Mailroom Clerk
            const response = await fetch('http://localhost:5000/api/documents/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` // Show the wristband to the Security Guard
                    // Note: DO NOT set 'Content-Type' here. 
                    // The browser automatically sets it to 'multipart/form-data' with the correct boundary when it sees FormData!
                },
                body: formData
            });

            if (response.ok) {
                setStatus({ loading: false, error: '', success: t('adminUploadDoc.messages.success') });
                // Clear the form
                setTitle('');
                setCategory('law');
                setFile(null);
                document.getElementById('fileInput').value = ''; // Reset the actual file input UI
            } else if (response.status === 401) {
                // Wristband expired or invalid
                setStatus({ loading: false, error: t('adminUploadDoc.messages.errorAuth'), success: '' });
                localStorage.removeItem('adminToken');
                setTimeout(() => navigate('/admin/login'), 2000);
            } else {
                const data = await response.json();
                setStatus({ loading: false, error: data.error || t('adminUploadDoc.messages.errorGeneric'), success: '' });
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
            <div className="container" style={{ maxWidth: '600px', backgroundColor: 'white', padding: '3rem', borderRadius: '12px', boxShadow: 'var(--shadow-elegant)' }}>

                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.8rem', fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)', margin: '0 0 0.5rem 0' }}>
                        {t('adminUploadDoc.title')}
                    </h1>
                    <p style={{ margin: 0, color: 'var(--text-gray)', fontFamily: 'Sarabun, sans-serif' }}>
                        {t('adminUploadDoc.subtitle')}
                    </p>
                </div>

                {/* Status Messages */}
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

                    <label style={labelStyle}>{t('adminUploadDoc.form.docTitleLabel')} <span style={{ color: 'red' }}>*</span></label>
                    <input
                        type="text" required
                        value={title} onChange={(e) => setTitle(e.target.value)}
                        placeholder={t('adminUploadDoc.form.docTitlePlaceholder')}
                        style={inputStyle}
                    />

                    <label style={labelStyle}>{t('adminUploadDoc.form.categoryLabel')} <span style={{ color: 'red' }}>*</span></label>
                    <label style={labelStyle}>{t('adminUploadDoc.form.categoryLabel')} <span style={{ color: 'red' }}>*</span></label>
                    <select
                        required value={category} onChange={(e) => setCategory(e.target.value)}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                        <option value="law">{t('adminUploadDoc.form.categoryOptions.law')}</option>
                        <option value="order">{t('adminUploadDoc.form.categoryOptions.order')}</option>
                        <option value="policy">{t('adminUploadDoc.form.categoryOptions.policy')}</option>
                        <option value="form">{t('adminUploadDoc.form.categoryOptions.form')}</option>
                    </select>

                    <label style={labelStyle}>{t('adminUploadDoc.form.fileLabel')} <span style={{ color: 'red' }}>*</span></label>
                    <input
                        type="file" id="fileInput" required
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx" // Restrict file types for better UX
                        style={{ ...inputStyle, padding: '0.5rem', cursor: 'pointer' }}
                    />

                    <button
                        type="submit" disabled={status.loading || !file}
                        style={{
                            width: '100%', padding: '1rem', backgroundColor: (status.loading || !file) ? '#94a3b8' : 'var(--primary-navy)',
                            color: 'white', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontFamily: 'Prompt, sans-serif',
                            cursor: (status.loading || !file) ? 'not-allowed' : 'pointer', fontWeight: '600', marginTop: '1rem'
                        }}
                    >
                        {status.loading ? t('adminUploadDoc.form.uploading') : t('adminUploadDoc.form.uploadBtn')}
                    </button>

                </form>
            </div>
        </div>
    );
}