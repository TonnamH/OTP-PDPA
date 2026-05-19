// src/pages/Ropa.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import FadeIn from '../components/FadeIn'; // <-- Import the FadeIn component

export default function Ropa() {
  const { t } = useTranslation();
  
  // The path to the file in your public folder
  const pdfFilePath = '/6.PDPA_ROPA_OTP-2568-10-30.pdf';

  return (
    <div style={{ backgroundColor: 'var(--bg-white)', minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* 1. Page Header */}
      <FadeIn delay={0.1}>
        <section className="section-full" style={{ paddingBottom: '2rem' }}>
          <div className="container">
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'Prompt, sans-serif' }}>
                {t('ropa.title')}
              </h1>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-gray)', fontWeight: '400' }}>
                {t('ropa.subtitle')}
              </h2>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* 2. Document Viewer Section */}
      <FadeIn delay={0.2}>
        <section className="section-full" style={{ paddingTop: '0' }}>
          <div className="container">
            
            {/* --- Flex Container for Title and Button --- */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <h3 style={{ fontSize: '1.6rem', margin: 0, fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)' }}>
                {t('ropa.viewerTitle')}
              </h3>

              {/* External Link Button */}
              <a 
                href="http://ropa.otp.go.th:8081/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.6rem 1.2rem', backgroundColor: 'var(--primary-navy)', color: 'white',
                  borderRadius: '8px', textDecoration: 'none', fontFamily: 'Prompt, sans-serif',
                  fontWeight: '500', boxShadow: 'var(--shadow-elegant)', transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span>{t('ropa.systemLink', 'ระบบ ROPA (ROPA System)')}</span>
                {/* External Link SVG Icon */}
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* The PDF Container */}
            <div style={{ 
              width: '100%', 
              height: '800px',
              border: '1px solid var(--border-color)',
              backgroundColor: '#f1f5f9',
              marginBottom: '1rem',
              boxShadow: 'var(--shadow-elegant)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <iframe 
                src={`${pdfFilePath}#toolbar=1&navpanes=0&view=FitH`} 
                title="ROPA Document Viewer"
                width="100%" 
                height="100%" 
                style={{ border: 'none' }}
              >
                <p>Your browser does not support PDFs. <a href={pdfFilePath}>Download the PDF</a>.</p>
              </iframe>
            </div>

            {/* Download Link */}
            <div style={{ fontSize: '0.95rem', color: 'var(--text-gray)' }}>
              {t('ropa.download')} <a href={pdfFilePath} download="pdpa_ropa_files.pdf" style={{ color: 'var(--primary-navy)', textDecoration: 'underline' }}>pdpa_ropa_files.pdf</a>
            </div>

          </div>
        </section>
      </FadeIn>

    </div>
  );
}