// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  const linkStyle = { 
    color: 'var(--bg-white)', 
    textDecoration: 'none',
    opacity: 0.9,
    transition: 'opacity 0.2s ease',
    fontFamily: 'Prompt, sans-serif',
    fontSize: '0.9rem' 
  };

  const dividerStyle = {
    color: 'rgba(255,255,255,0.4)',
    margin: '0 0.5rem' 
  };

  return (
    // Slightly balanced the outer padding to match the new inner gap
    <footer style={{ backgroundColor: 'var(--primary-navy)', color: 'var(--bg-white)', padding: '1.5rem 0' }}>
      
      {/* THE FIX: Increased the gap from 0.5rem to 1.25rem for comfortable breathing room */}
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>

        <div className="flex-gap" style={{ flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          <Link to="/policy/website" style={linkStyle}>{t('footer.websitePolicy')}</Link>
          <span style={dividerStyle}>|</span>
          <Link to="/policy/cookie" style={linkStyle}>{t('footer.cookiePolicy')}</Link>
          <span style={dividerStyle}>|</span>
          <Link to="/policy/security" style={linkStyle}>{t('footer.securityPolicy')}</Link>
          <span style={dividerStyle}>|</span>
          <Link to="/policy/privacy" style={linkStyle}>{t('footer.privacyPolicy')}</Link>
        </div>

        <div style={{ 
          textAlign: 'center',
          fontFamily: 'Sarabun, sans-serif',
          fontSize: '0.8rem',
          opacity: 0.7
        }}>
          {t('footer.copyright')}
        </div>

      </div>
    </footer>
  );
}