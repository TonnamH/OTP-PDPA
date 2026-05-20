// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import VisitorCounter from './VisitorCounter';

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
    <footer style={{ backgroundColor: 'var(--primary-navy)', color: 'var(--bg-white)', padding: '1.5rem 0' }}>
      
      {/* THE FIX: Changed to a horizontal flex row with space-between */}
      <div 
        className="container" 
        style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', // Ensures it stacks neatly on mobile phones
          gap: '1.5rem' 
        }}
      >

        {/* LEFT SIDE: Links and Copyright */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/privacy-policy" style={linkStyle}>{t('footer.privacyPolicy')}</Link>
            <span style={dividerStyle}>|</span>
            <Link to="/policy-cookie" style={linkStyle}>{t('footer.cookiePolicy')}</Link>
          </div>

          <div style={{ 
            fontFamily: 'Sarabun, sans-serif',
            fontSize: '0.8rem',
            opacity: 0.7
          }}>
            {t('footer.copyright')}
          </div>

        </div>

        {/* RIGHT SIDE: Visitor Counter */}
        <div>
          <VisitorCounter />
        </div>

      </div>
    </footer>
  );
}