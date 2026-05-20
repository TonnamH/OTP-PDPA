// src/components/Navbar.jsx
import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation(); 
  const [searchQuery, setSearchQuery] = useState('');

  // Check if the user is currently logged in as an admin
  const isLoggedIn = Boolean(localStorage.getItem('adminToken'));

  // --- Handlers ---
  const toggleLanguage = () => {
    const newLang = i18n.language === 'th' ? 'en' : 'th';
    i18n.changeLanguage(newLang);
    localStorage.setItem('preferredLanguage', newLang);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login'); // Send back to login screen
  };

  // --- Styles ---
  const getLinkStyle = ({ isActive }) => ({
    fontFamily: 'Prompt, sans-serif',
    fontWeight: isActive ? '700' : '400',
    color: isActive ? 'var(--primary-navy)' : 'var(--text-dark)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  });

  const getTextStyle = (isActive) => ({
    textDecoration: isActive ? 'underline' : 'none',
    textUnderlineOffset: '6px'
  });

  // --- Helper variables ---
  const isAboutActive = location.pathname.startsWith('/about');
  const isServicesActive = location.pathname.startsWith('/services');
  const isContactActive = location.pathname.startsWith('/contact');
  const isAdminActive = location.pathname.startsWith('/admin');

  return (
    <header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 100, 
      backgroundColor: 'rgba(253, 252, 248, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)', 
      padding: '1rem 0',
      width: '100%'
    }}>
      <div className="container flex-between">
        
        {/* Brand / Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img 
            src="/otplogo.png" 
            alt="OTP Logo" 
            style={{ height: '45px', width: 'auto', objectFit: 'contain', borderRadius: '4px' }} 
          />
        </Link>

        <nav className="flex-gap">
          
          <NavLink to="/" style={getLinkStyle}>
            {({ isActive }) => (
              <span style={getTextStyle(isActive)}>{t('nav.home')}</span>
            )}
          </NavLink>

          {/* About Dropdown */}
          <div className="nav-dropdown">
            <div style={getLinkStyle({ isActive: isAboutActive })}>
              <span style={getTextStyle(isAboutActive)}>{t('nav.about')}</span> 
              <span style={{ fontSize: '0.7em', marginTop: '2px' }}>▾</span>
            </div>
            <div className="dropdown-content">
              <Link to="/about/dpo">{t('nav.aboutDpo')}</Link>
              <Link to="/about/documents">{t('nav.aboutDocs')}</Link>
              <Link to="/about/ropa">{t('nav.aboutRopa')}</Link>
            </div>
          </div>

          {/* Services Dropdown */}
          <div className="nav-dropdown">
            <div style={getLinkStyle({ isActive: isServicesActive })}>
              <span style={getTextStyle(isServicesActive)}>{t('nav.services')}</span> 
              <span style={{ fontSize: '0.7em', marginTop: '2px' }}>▾</span>
            </div>
            <div className="dropdown-content">
              <Link to="/services/infographics">{t('nav.servicesInfographics')}</Link>
              <Link to="/services/videos">{t('nav.servicesVideos')}</Link>
              <Link to="/services/training">{t('nav.servicesTraining')}</Link>
              <Link to="https://www.pdpc.or.th/pdpc-book/">{t('nav.servicesEbook')}</Link>
              <Link to="http://otpboard.otp.go.th/">{t('nav.servicesOTPBoard')}</Link>
            </div>
          </div>

          {/* Contact Dropdown */}
          <div className="nav-dropdown">
            <div style={getLinkStyle({ isActive: isContactActive })}>
              <span style={getTextStyle(isContactActive)}>{t('nav.contact')}</span> 
              <span style={{ fontSize: '0.7em', marginTop: '2px' }}>▾</span>
            </div>
            <div className="dropdown-content">
              <Link to="/contact">{t('nav.contact')}</Link>
              <Link to="/contact/report">{t('nav.Report')}</Link>
            </div>
          </div>

          {/* --- NEW: Admin Dropdown --- */}
          {/* Moved this next to the other text links so it flows perfectly */}
          {isLoggedIn && (
            <div className="nav-dropdown">
              <div style={getLinkStyle({ isActive: isAdminActive })}>
                <span style={getTextStyle(isAdminActive)}>{t('nav.admin', 'Admin')}</span> 
                <span style={{ fontSize: '0.7em', marginTop: '2px' }}>▾</span>
              </div>
              <div className="dropdown-content">
                <Link to="/admin/dashboard">{t('nav.dashboard', 'Dashboard')}</Link>
                
                {/* We use an 'a' tag here so it automatically inherits your dropdown CSS styling! */}
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault(); // Prevents the page from jumping to the top
                    handleLogout();
                  }}
                  style={{ color: '#ef4444', fontWeight: '500' }}
                >
                  {t('nav.logout', 'Log out')}
                </a>
              </div>
            </div>
          )}
          
          {/* --- Action Group Wrapper (Search & Language) --- */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            
            {/* Search Bar */}
            <input 
              type="text" 
              placeholder={t('nav.search')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              style={{ 
                padding: '0.5rem 1rem', borderRadius: '20px', 
                border: '1px solid var(--border-color)', outlineColor: 'var(--primary-navy)', 
                fontFamily: 'Sarabun, sans-serif', backgroundColor: 'var(--bg-white)',
                width: '180px', transition: 'all 0.2s ease'
              }} 
            />

            {/* Language Toggle */}
            <div 
              onClick={toggleLanguage}
              style={{
                display: 'flex', alignItems: 'center', backgroundColor: 'rgba(24, 35, 55, 0.08)',
                borderRadius: '20px', padding: '4px', cursor: 'pointer', width: '74px',
                height: '34px', position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute', top: '4px', left: i18n.language === 'th' ? '4px' : '38px',
                width: '32px', height: '26px', backgroundColor: 'var(--bg-white)', borderRadius: '14px',
                boxShadow: 'var(--shadow-elegant)', transition: 'left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
              }}></div>
              
              <span style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', fontWeight: '600', zIndex: 1, color: i18n.language === 'th' ? 'var(--primary-navy)' : 'var(--text-gray)', fontFamily: 'Prompt, sans-serif', transition: 'color 0.3s ease' }}>TH</span>
              <span style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', fontWeight: '600', zIndex: 1, color: i18n.language === 'en' ? 'var(--primary-navy)' : 'var(--text-gray)', fontFamily: 'Prompt, sans-serif', transition: 'color 0.3s ease' }}>EN</span>
            </div>

          </div>
        </nav>
      </div>
    </header>
  );
}