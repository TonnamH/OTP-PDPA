// src/pages/Home.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect for the slider
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../css/Home.css';

export default function Home() {
  const { t } = useTranslation();
 
  // --- Hooks & State ---
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0); // Slider state

  // --- Slider Data ---
  // You can replace these with your actual 7 images later
  const slides = [
    './otpslide4-1.jpg',
    './slide1.png',
    './slide2.png',
    './slide3.png',
    './slide4.png',
    './slide5-1.jpg',
    './การสร้างความตระหนักรู้เกี่ยวกับ-PDPA-แก่เจ้าหน้าที่ภายในองค์กร-7.jpg',
  ];

  // Auto-play the slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

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

  // Pulling the bullet points from the JSON dictionary (Ensure you updated your JSON to use pointOneList / pointTwoList!)
  const publicBenefits = t('home.benefits.pointOneList', { returnObjects: true });
  const govBenefits = t('home.benefits.pointTwoList', { returnObjects: true });

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

      {/* LAYER 2.5: The Slideshow Section */}
      <section style={{ backgroundColor: 'var(--bg-white)', padding: '3rem 0' }}>
        <div className="container" style={{ maxWidth: '1350px' }}>
          
          {/* Slider Container (Now acts like a beautiful card) */}
          <div style={{ 
            width: '100%', borderRadius: '12px', boxShadow: 'var(--shadow-elegant)', 
            overflow: 'hidden', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)' 
          }}>
            
            {/* Image Track & Arrows Wrapper */}
            <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
              
              <div style={{ 
                display: 'flex', 
                transition: 'transform 0.5s ease-in-out', 
                transform: `translateX(-${currentSlide * 100}%)` 
              }}>
                {slides.map((slide, index) => (
                  <div key={index} style={{ width: '100%', flexShrink: 0, height: '450px', backgroundColor: '#f8fafc' }}>
                    <img 
                      src={slide} 
                      alt={`Slide ${index + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }}
                    />
                  </div>
                ))}
              </div>

              {/* Left Arrow */}
              <button 
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                style={{
                  position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)',
                  width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)', zIndex: 10, color: 'var(--primary-navy)',
                  transition: 'background-color 0.2s, transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'white'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)'}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Right Arrow */}
              <button 
                onClick={() => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
                style={{
                  position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)',
                  width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)', zIndex: 10, color: 'var(--primary-navy)',
                  transition: 'background-color 0.2s, transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'white'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.85)'}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

            </div>

            {/* Dynamic Caption Bar & Navigation */}
            <div style={{ 
              padding: '1.5rem 2rem', 
              borderTop: '1px solid var(--border-color)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              
              {/* The Text */}
              <div style={{ flex: '1 1 300px' }}>
                <h3 style={{ fontSize: '1.4rem', fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)', margin: '0 0 0.2rem 0' }}>
                  {t('home.slider', { returnObjects: true })[currentSlide]?.title}
                </h3>
                <p style={{ fontSize: '1rem', fontFamily: 'Sarabun, sans-serif', color: 'var(--text-gray)', margin: 0 }}>
                  {t('home.slider', { returnObjects: true })[currentSlide]?.subtitle}
                </p>
              </div>

              {/* Slider Dots */}
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    style={{
                      width: '12px', height: '12px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                      backgroundColor: currentSlide === index ? 'var(--primary-navy)' : '#cbd5e1',
                      transition: 'all 0.3s'
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              
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

          {/* Benefit 1 */}
          <div className="flex-between" style={{ gap: '5rem', marginBottom: '6rem' }}>
            <div className="elegant-card" style={{ flex: 1, height: '400px', background: `url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800') center/cover` }}></div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--primary-navy)' }}>{t('home.benefits.pointOneTitle')}</h3>
              
              {/* Render as a List instead of a single paragraph */}
              <ul style={{ fontSize: '1.1rem', paddingLeft: '1.5rem', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                {Array.isArray(publicBenefits) && publicBenefits.map((point, index) => (
                  <li key={index} style={{ marginBottom: '0.8rem' }}>{point}</li>
                ))}
              </ul>

            </div>
          </div>

          {/* Benefit 2 */}
          <div className="flex-between" style={{ gap: '5rem' }}>
            {/* Note: I adjusted textAlign to 'left' here so the bullet points don't look weird, but you can change it back to 'right' if you prefer! */}
            <div style={{ flex: 1, textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--primary-navy)' }}>{t('home.benefits.pointTwoTitle')}</h3>
              
              {/* Render as a List instead of a single paragraph */}
              <ul style={{ fontSize: '1.1rem', paddingLeft: '1.5rem', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                {Array.isArray(govBenefits) && govBenefits.map((point, index) => (
                  <li key={index} style={{ marginBottom: '0.8rem' }}>{point}</li>
                ))}
              </ul>

            </div>
            <div className="elegant-card" style={{ flex: 1, height: '400px', background: `url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800') center/cover` }}></div>
          </div>

        </div>
      </section>
    </>
  );
}