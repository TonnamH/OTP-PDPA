import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Infographics() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null); // Controls the Lightbox
  
  // 1. New State for Database Data
  const [infographics, setInfographics] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch data from your backend
  useEffect(() => {
    const fetchInfographics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/infographics');
        if (response.ok) {
          const data = await response.json();
          setInfographics(data);
        }
      } catch (error) {
        console.error('Failed to fetch infographics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfographics();
  }, []);

  // 3. Filter Logic using real data
  const filteredDocs = activeFilter === 'all' 
    ? infographics 
    : infographics.filter(doc => doc.category === activeFilter);

  // Close lightbox when hitting Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setSelectedImage(null); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-white)', minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* Header Section */}
      <section className="section-full" style={{ paddingBottom: '2rem' }}>
        <div className="container">
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'Prompt, sans-serif' }}>
              {t('infographicsPage.title')}
            </h1>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-gray)', fontWeight: '400' }}>
              {t('infographicsPage.subtitle')}
            </h2>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-full" style={{ paddingTop: '0' }}>
        <div className="container">
          
          {/* Filter Pills - Updated with new categories */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
            {['all', 'basics', 'roles', 'operations', 'it_security'].map(filterKey => (
              <button 
                key={filterKey}
                onClick={() => setActiveFilter(filterKey)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '20px',
                  border: `1px solid ${activeFilter === filterKey ? 'var(--primary-navy)' : 'var(--border-color)'}`,
                  backgroundColor: activeFilter === filterKey ? 'var(--bg-light)' : 'transparent',
                  color: activeFilter === filterKey ? 'var(--primary-navy)' : 'var(--text-gray)',
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: activeFilter === filterKey ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {t(`infographicsPage.filters.${filterKey}`)}
              </button>
            ))}
          </div>

          {/* The Grid & Loading State */}
          {loading ? (
            <p style={{ textAlign: 'center', fontFamily: 'Prompt, sans-serif' }}>{t('infographicsPage.loading')}</p>
          ) : filteredDocs.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-gray)' }}>{t('infographicsPage.empty')}</p>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '2.5rem' 
            }}>
              {filteredDocs.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedImage(item)}
                  style={{ cursor: 'pointer', group: 'hover' }}
                >
                  {/* Image Card */}
                  <div style={{
                    width: '100%',
                    aspectRatio: '1 / 1', 
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    boxShadow: 'var(--shadow-elegant)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 12px 20px rgba(24, 35, 55, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-elegant)';
                  }}
                  >
                    <img 
                      src={`http://localhost:5000${item.image_path}`} // 4. Pointing to Node server
                      alt={item.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <h4 style={{ textAlign: 'center', fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)', margin: 0 }}>
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* LIGHTBOX OVERLAY */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 9999, display: 'flex',
            justifyContent: 'center', alignItems: 'center', padding: '2rem', backdropFilter: 'blur(5px)'
          }}
        >
          <button 
            onClick={() => setSelectedImage(null)}
            style={{ position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer', zIndex: 10000 }}
          >
            &times;
          </button>

          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ position: 'relative', maxHeight: '90vh', maxWidth: '90vw' }}
          >
            <img 
              src={`http://localhost:5000${selectedImage.image_path}`} // 5. Pointing Lightbox to Node server
              alt={selectedImage.title}
              style={{ maxHeight: '90vh', maxWidth: '100%', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} 
            />
            <div style={{ position: 'absolute', bottom: '-40px', left: 0, width: '100%', textAlign: 'center', color: 'white', fontFamily: 'Prompt, sans-serif', fontSize: '1.2rem' }}>
              {selectedImage.title}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}