// src/pages/Training.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FadeIn from '../components/FadeIn'; // <-- 1. Import the FadeIn component

export default function Training() {
  const { t } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState(null);

  // The specific videos for this training session
  const trainingVideos = [
    { id: 1, titleKey: 'อบรม PDPA Part1', youtubeId: '4-LgztfilBM' },
    { id: 2, titleKey: 'อบรม PDPA Part2', youtubeId: 't6iBc6RpzYE' }
  ];

  // Close lightbox when hitting Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setSelectedVideo(null); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-white)', minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* 1. Header Section */}
      <FadeIn delay={0.1}>
        <section className="section-full" style={{ paddingBottom: '2rem' }}>
          <div className="container">
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'Prompt, sans-serif' }}>
                {t('training.title')}
              </h1>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-gray)', fontWeight: '400' }}>
                {t('training.subtitle')}
              </h2>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* 2. Content Section */}
      <section className="section-full" style={{ paddingTop: '0' }}>
        <div className="container">
          
          <FadeIn delay={0.2}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontFamily: 'Prompt, sans-serif', color: 'var(--text-dark)' }}>
              {t('training.sectionTitle')}
            </h3>

            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', fontFamily: 'Sarabun, sans-serif', color: 'var(--text-gray)' }}>
              {t('training.eventTitle')}
            </p>
          </FadeIn>

          {/* Video Grid (Max width to keep the 2 videos looking good) */}
          <FadeIn delay={0.3}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem',
              maxWidth: '900px',
              marginBottom: '3rem'
            }}>
              {trainingVideos.map((video) => (
                <div key={video.id} onClick={() => setSelectedVideo(video)} style={{ cursor: 'pointer', group: 'hover' }}>
                  
                  {/* Reused Video Card Styles */}
                  <div style={{
                    position: 'relative', width: '100%', aspectRatio: '16 / 9',
                    backgroundColor: '#182337', borderRadius: '8px', overflow: 'hidden',
                    marginBottom: '1rem', boxShadow: 'var(--shadow-elegant)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.querySelector('.play-btn').style.transform = 'translate(-50%, -50%) scale(1.1)';
                    e.currentTarget.querySelector('.play-btn').style.backgroundColor = '#FF0000';
                    e.currentTarget.querySelector('img').style.transform = 'scale(1.05)';
                    e.currentTarget.querySelector('.overlay').style.backgroundColor = 'rgba(24, 35, 55, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.querySelector('.play-btn').style.transform = 'translate(-50%, -50%) scale(1)';
                    e.currentTarget.querySelector('.play-btn').style.backgroundColor = 'rgba(24, 35, 55, 0.8)';
                    e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                    e.currentTarget.querySelector('.overlay').style.backgroundColor = 'rgba(24, 35, 55, 0.2)';
                  }}
                  >
                    <img 
                      src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`} 
                      alt={t(video.titleKey)} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      onError={(e) => e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    />
                    <div className="overlay" style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      backgroundColor: 'rgba(24, 35, 55, 0.2)', transition: 'background-color 0.4s ease'
                    }}></div>
                    <div className="play-btn" style={{
                      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                      width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(24, 35, 55, 0.8)', 
                      color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center',
                      transition: 'all 0.3s ease', backdropFilter: 'blur(4px)'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  <h4 style={{ textAlign: 'center', fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)', margin: 0, fontSize: '1.2rem' }}>
                    {t(video.titleKey)}
                  </h4>
                  
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Document Download Link */}
          <FadeIn delay={0.4}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Sarabun, sans-serif' }}>
              <span style={{ color: 'var(--text-gray)' }}>{t('training.downloadDoc')}</span>
              <a href="/training_docs.pdf" download style={{ 
                display: 'flex', alignItems: 'center', gap: '0.3rem', 
                color: 'var(--primary-navy)', textDecoration: 'none', fontWeight: '600' 
              }}>
                {t('training.downloadBtn')}
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* 3. YOUTUBE VIDEO LIGHTBOX (Reused exactly from Videos.jsx) */}
      {/* Lightbox is NOT wrapped in FadeIn so it triggers instantly */}
      {selectedVideo && (
        <div onClick={() => setSelectedVideo(null)} style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.9)', zIndex: 9999, display: 'flex',
            justifyContent: 'center', alignItems: 'center', padding: '2rem', backdropFilter: 'blur(5px)'
        }}>
          <button onClick={() => setSelectedVideo(null)} style={{
              position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none',
              color: 'white', fontSize: '2.5rem', cursor: 'pointer', zIndex: 10000
          }}>
            &times;
          </button>
          <div onClick={(e) => e.stopPropagation()} style={{ 
              position: 'relative', width: '100%', maxWidth: '1000px', aspectRatio: '16 / 9',
              backgroundColor: 'black', borderRadius: '8px', overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <iframe 
              width="100%" height="100%" 
              src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`} 
              title={t(selectedVideo.titleKey)} frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

    </div>
  );
}