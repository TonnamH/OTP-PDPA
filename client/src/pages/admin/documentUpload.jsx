// src/pages/admin/DocumentUpload.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FadeIn from '../../components/FadeIn';
import adminApi from '../../utils/adminApi';

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

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('file', file);

        try {
            // Let adminApi handle the token, the headers, and the 401 checks automatically!
            const response = await adminApi.post('/documents/upload', formData);

            // If we get here, the upload was a success
            setStatus({ loading: false, error: '', success: t('adminUploadDoc.messages.success') });
            setTitle('');
            setCategory('law');
            setFile(null);
            document.getElementById('fileInput').value = '';

        } catch (error) {
            console.error('Upload Error:', error);
            // If it's a 401 error, adminApi already kicked them to the login screen.
            // For other errors (like file too large), we show the error message.
            const errorMsg = error.response?.data?.error || t('adminUploadDoc.messages.errorGeneric') || 'Cannot connect to the server.';
            setStatus({ loading: false, error: errorMsg, success: '' });
        }
    };

    // --- Premium UI Styles ---
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

                {/* Header Section (Back button, Title, Subtitle, and Status) */}
                <FadeIn delay={0.1}>
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
                        {t('adminUploadDoc.backToDashboard')}
                    </Link>

                    {/* Header */}
                    <div style={{ borderBottom: '2px solid var(--bg-light)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '2rem', fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)', margin: '0 0 0.5rem 0' }}>
                            {t('adminUploadDoc.title')}
                        </h1>
                        <p style={{ margin: 0, color: 'var(--text-gray)', fontFamily: 'Sarabun, sans-serif', fontSize: '1.1rem' }}>
                            {t('adminUploadDoc.subtitle')}
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
                </FadeIn>

                {/* Form Section */}
                <FadeIn delay={0.2}>
                    <form onSubmit={handleSubmit}>

                        {/* Title Input */}
                        <label style={labelStyle}>{t('adminUploadDoc.form.docTitleLabel')} <span style={{ color: '#ef4444' }}>*</span></label>
                        <input
                            type="text" required
                            value={title} onChange={(e) => setTitle(e.target.value)}
                            placeholder={t('adminUploadDoc.form.docTitlePlaceholder')}
                            style={inputStyle}
                        />

                        {/* Category Select */}
                        <label style={labelStyle}>{t('adminUploadDoc.form.categoryLabel')} <span style={{ color: '#ef4444' }}>*</span></label>
                        <select
                            required value={category} onChange={(e) => setCategory(e.target.value)}
                            style={{ ...inputStyle, cursor: 'pointer' }}
                        >
                            <option value="law">{t('adminUploadDoc.form.categoryOptions.law')}</option>
                            <option value="order">{t('adminUploadDoc.form.categoryOptions.order')}</option>
                            <option value="policy">{t('adminUploadDoc.form.categoryOptions.policy')}</option>
                            <option value="form">{t('adminUploadDoc.form.categoryOptions.form')}</option>
                        </select>

                        {/* Premium Custom File Upload Area */}
                        <label style={labelStyle}>{t('adminUploadDoc.form.fileLabel')} <span style={{ color: '#ef4444' }}>*</span></label>

                        <div style={{
                            marginTop: '0.5rem', marginBottom: '2rem',
                            border: file ? '2px solid #10b981' : '2px dashed #cbd5e1',
                            borderRadius: '12px', padding: '2.5rem 1rem',
                            textAlign: 'center', backgroundColor: file ? '#f0fdf4' : '#f8fafc',
                            cursor: 'pointer', transition: 'all 0.2s ease',
                            position: 'relative'
                        }}>
                            {/* Hidden Actual Input */}
                            <input
                                type="file" id="fileInput" required={!file}
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            />

                            {/* Visual UI */}
                            {file ? (
                                <div style={{ color: '#059669', fontFamily: 'Sarabun, sans-serif' }}>
                                    <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ margin: '0 auto 0.5rem' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p style={{ margin: 0, fontWeight: '600' }}>{t('adminUploadDoc.form.fileSelected')} {file.name}</p>
                                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#34d399' }}>{t('adminUploadDoc.form.clickToChange')}</p>
                                </div>
                            ) : (
                                <div style={{ color: 'var(--text-gray)', fontFamily: 'Sarabun, sans-serif' }}>
                                    <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem', color: '#94a3b8' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-dark)' }}>{t('adminUploadDoc.form.clickToBrowse')}</p>
                                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>{t('adminUploadDoc.form.supportedFiles')}</p>
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
                            {status.loading ? t('adminUploadDoc.form.uploading') : t('adminUploadDoc.form.uploadBtn')}
                        </button>

                    </form>
                </FadeIn>
            </div>
        </div>
    );
}