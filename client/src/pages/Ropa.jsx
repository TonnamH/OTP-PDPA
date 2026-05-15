// src/pages/Ropa.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Ropa() {
  const { t } = useTranslation();
  
  // The path to the file in your public folder
  const pdfFilePath = '/6.PDPA_ROPA_OTP-2568-10-30.pdf';

  return (
    <div style={{ backgroundColor: 'var(--bg-white)', minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* 1. Page Header */}
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

      {/* 2. Document Viewer Section */}
      <section className="section-full" style={{ paddingTop: '0' }}>
        <div className="container">
          
          <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)' }}>
            {t('ropa.viewerTitle')}
          </h3>

          {/* The PDF Container */}
          <div style={{ 
            width: '100%', 
            height: '800px', /* A nice tall height for reading */
            border: '1px solid var(--border-color)',
            backgroundColor: '#f1f5f9', /* A light gray fallback background */
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-elegant)'
          }}>
            <iframe 
              src={`${pdfFilePath}#toolbar=1&navpanes=0&view=FitH`} 
              title="ROPA Document Viewer"
              width="100%" 
              height="100%" 
              style={{ border: 'none' }}
            >
              {/* Fallback text if their browser strictly blocks iframes */}
              <p>Your browser does not support PDFs. <a href={pdfFilePath}>Download the PDF</a>.</p>
            </iframe>
          </div>

          {/* Download Link (Exactly as shown in your wireframe) */}
          <div style={{ fontSize: '0.95rem', color: 'var(--text-gray)' }}>
            {t('ropa.download')} <a href={pdfFilePath} download="pdpa_ropa_files.pdf" style={{ color: 'var(--primary-navy)', textDecoration: 'underline' }}>pdpa_ropa_files.pdf</a>
          </div>

        </div>
      </section>

    </div>
  );
}