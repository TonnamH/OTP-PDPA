import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import Icon from './Icon';
import '../css/Navbar.css';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme, fontSize, changeFontSize } = useTheme();

  // Settings Menu State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  const isLoggedIn = Boolean(sessionStorage.getItem('adminToken'));

  // Close settings menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'th' ? 'en' : 'th';
    i18n.changeLanguage(newLang);
    localStorage.setItem('preferredLanguage', newLang);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSettingsOpen(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const getLinkStyle = ({ isActive }) => ({
    fontFamily: 'Prompt, sans-serif',
    fontWeight: isActive ? '700' : '400',
    color: isActive ? 'var(--primary-navy)' : 'var(--text-dark)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
  });

  const getTextStyle = (isActive) => ({
    textDecoration: isActive ? 'underline' : 'none',
    textUnderlineOffset: '6px',
  });

  const isAboutActive = location.pathname.startsWith('/about');
  const isServicesActive = location.pathname.startsWith('/services');
  const isContactActive = location.pathname.startsWith('/contact');
  const isAdminActive = location.pathname.startsWith('/admin');

  return (
    <header className="navbar-root">
      <div className="container navbar-inner">
        
        {/* --- LEFT: Brand / Logo --- */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <img 
            src="/otplogo.png" 
            alt="OTP Logo" 
            className="navbar-logo"
          />
        </Link>

        {/* --- CENTER: Nav Links --- */}
        <nav className="navbar-links">
          <NavLink to="/" style={getLinkStyle}>
            {({ isActive }) => (
              <span style={getTextStyle(isActive)}>{t('nav.home')}</span>
            )}
          </NavLink>

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

          {isLoggedIn && (
            <div className="nav-dropdown">
              <div style={getLinkStyle({ isActive: isAdminActive })}>
                <span style={getTextStyle(isAdminActive)}>{t('nav.admin', 'Admin')}</span> 
                <span style={{ fontSize: '0.7em', marginTop: '2px' }}>▾</span>
              </div>
              <div className="dropdown-content">
                <Link to="/admin/dashboard">{t('nav.dashboard', 'Dashboard')}</Link>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handleLogout(); }}
                  style={{ color: '#ef4444', fontWeight: '500' }}
                >
                  {t('nav.logout', 'Log out')}
                </a>
              </div>
            </div>
          )}
        </nav>

        {/* --- RIGHT: Actions (Search + Settings Gear) --- */}
        <div className="navbar-actions">
          
          <input 
            type="text" 
            placeholder={t('nav.search')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="navbar-search"
          />

          {/* Settings Menu Wrapper */}
          <div className="settings-wrapper" ref={settingsRef}>
            <button 
              className={`settings-btn ${isSettingsOpen ? 'active' : ''}`} 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              title={t('nav.settings.title', 'Display Settings')}
            >
              <Icon name="settings" size={22} />
            </button>

            {/* Dropdown Panel */}
            <div className={`settings-menu ${isSettingsOpen ? 'open' : ''}`}>
              <h4 className="settings-header">{t('nav.settings.title', 'Display Settings')}</h4>

              {/* Language */}
              <div className="settings-row">
                <span className="settings-label">{t('nav.settings.language', 'Language')}</span>
                <div className="pill-switch pill-switch-2" onClick={toggleLanguage}>
                  <div className="pill-thumb" style={{ left: i18n.language === 'th' ? '3px' : '37px' }} />
                  <div className={`pill-option ${i18n.language === 'th' ? 'active' : ''}`}>TH</div>
                  <div className={`pill-option ${i18n.language === 'en' ? 'active' : ''}`}>EN</div>
                </div>
              </div>

              {/* Theme */}
              <div className="settings-row">
                <span className="settings-label">{t('nav.settings.theme', 'Theme')}</span>
                <div className="pill-switch pill-switch-2" onClick={toggleTheme}>
                  <div className="pill-thumb" style={{ left: theme === 'light' ? '3px' : '37px' }} />
                  <div className={`pill-option ${theme === 'light' ? 'active' : ''}`}><Icon name="sun" size={15} /></div>
                  <div className={`pill-option ${theme === 'dark' ? 'active' : ''}`}><Icon name="moon" size={15} /></div>
                </div>
              </div>

              {/* Font Size */}
              <div className="settings-row">
                <span className="settings-label">{t('nav.settings.textSize', 'Text Size')}</span>
                <div className="pill-switch pill-switch-3">
                  <div 
                    className="pill-thumb" 
                    style={{ left: fontSize === 'small' ? '3px' : fontSize === 'medium' ? '37px' : '71px' }} 
                  />
                  <div 
                    className={`pill-option ${fontSize === 'small' ? 'active' : ''}`} 
                    onClick={() => changeFontSize('small')}
                    style={{ fontSize: '0.75rem' }}
                  >
                    A-
                  </div>
                  <div 
                    className={`pill-option ${fontSize === 'medium' ? 'active' : ''}`} 
                    onClick={() => changeFontSize('medium')}
                    style={{ fontSize: '0.9rem' }}
                  >
                    A
                  </div>
                  <div 
                    className={`pill-option ${fontSize === 'large' ? 'active' : ''}`} 
                    onClick={() => changeFontSize('large')}
                    style={{ fontSize: '1.05rem' }}
                  >
                    A+
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </header>
  );
}