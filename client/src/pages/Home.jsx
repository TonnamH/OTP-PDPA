// src/pages/Home.jsx
import React, { useState } from 'react'; // Added useState
import { useNavigate } from 'react-router-dom'; // Added useNavigate
import { useTranslation } from 'react-i18next';
import '../css/Home.css';

export default function Home() {
  const { t } = useTranslation();
  
  // --- Hooks & State ---
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // --- Handlers ---
  const executeSearch = () => {
    if (searchQuery.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  return (
    <>
      {/* LAYER 2: Hero Banner Section */}
      <section className="section-full hero-banner">
        <div className="container">
          <div style={{ maxWidth: '700px' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: 'var(--bg-white)' }}>
              {t('home.hero.title')}
            </h1>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--bg-light)', marginBottom: '3rem', fontWeight: '300', opacity: '0.9' }}>
              {t('home.hero.subtitle')}
            </h2>
            
            <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '500px' }}>
              <input 
                type="text" 
                placeholder={t('home.hero.searchPlaceholder')} 
                className="hero-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button 
                className="hero-search-button"
                onClick={executeSearch}
              >
                {t('home.hero.searchButton')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LAYER 3: Benefits Section */}
      <section className="section-full" style={{ backgroundColor: 'var(--bg-white)' }}>
        <div className="container">
          
          <div style={{ borderTop: '3px solid var(--primary-navy)', paddingTop: '2rem', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>{t('home.benefits.heading')}</h2>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-gray)', fontWeight: '400' }}>{t('home.benefits.subHeading')}</h3>
          </div>

          <div className="flex-between" style={{ gap: '5rem', marginBottom: '6rem' }}>
            <div className="elegant-card" style={{ flex: 1, height: '350px', background: `url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800') center/cover` }}></div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{t('home.benefits.pointOneTitle')}</h3>
              <p style={{ fontSize: '1.1rem' }}>{t('home.benefits.pointOneText')}</p>
            </div>
          </div>

          <div className="flex-between" style={{ gap: '5rem' }}>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{t('home.benefits.pointTwoTitle')}</h3>
              <p style={{ fontSize: '1.1rem' }}>{t('home.benefits.pointTwoText')}</p>
            </div>
            <div className="elegant-card" style={{ flex: 1, height: '350px', background: `url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800') center/cover` }}></div>
          </div>

        </div>
      </section>
    </>
  );
}