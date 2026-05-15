import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Infographics() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null); // Controls the Lightbox

  // THE FAKE DATABASE
  const infoDB = [
    { id: 1, title: 'PDPA คืออะไร?', category: 'basics', imgUrl: 'https://via.placeholder.com/800x1000/182337/ffffff?text=PDPA+Basics+1' },
    { id: 2, title: 'ข้อมูลส่วนบุคคล มีอะไรบ้าง?', category: 'basics', imgUrl: 'https://via.placeholder.com/800x1000/182337/ffffff?text=PDPA+Basics+2' },
    { id: 3, title: 'หน้าที่ของผู้ควบคุมข้อมูล (Data Controller)', category: 'roles', imgUrl: 'https://via.placeholder.com/800x1000/182337/ffffff?text=Roles+1' },
    { id: 4, title: 'หน้าที่ของผู้ประมวลผลข้อมูล (Data Processor)', category: 'roles', imgUrl: 'https://via.placeholder.com/800x1000/182337/ffffff?text=Roles+2' },
    { id: 5, title: 'สิทธิของเจ้าของข้อมูล (Data Subject)', category: 'basics', imgUrl: 'https://via.placeholder.com/800x1000/182337/ffffff?text=Rights' },
    { id: 6, title: 'บทลงโทษ หากฝ่าฝืน พ.ร.บ.', category: 'roles', imgUrl: 'https://via.placeholder.com/800x1000/182337/ffffff?text=Penalties' }
  ];

  // Filter Logic
  const filteredDocs = activeFilter === 'all' 
    ? infoDB 
    : infoDB.filter(doc => doc.category === activeFilter);

  // Close lightbox when hitting Escape key
  React.useEffect(() => {
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
              {t('infographics.title')}
            </h1>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-gray)', fontWeight: '400' }}>
              {t('infographics.subtitle')}
            </h2>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-full" style={{ paddingTop: '0' }}>
        <div className="container">
          
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontFamily: 'Prompt, sans-serif' }}>
            {t('infographics.sectionTitle')}
          </h3>

          {/* Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
            {['all', 'basics', 'roles'].map(filterKey => (
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
                {t(`infographics.filters.${filterKey}`)}
              </button>
            ))}
          </div>

          {/* The Grid */}
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
                  aspectRatio: '1 / 1', // Forces a perfect square thumbnail
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
                    src={item.imgUrl} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                {/* Title Below Card */}
                <h4 style={{ textAlign: 'center', fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)', margin: 0 }}>
                  {item.title}
                </h4>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* LIGHTBOX OVERLAY */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)} // Clicking background closes it
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 9999, // Ensure it sits on top of navbar
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            backdropFilter: 'blur(5px)'
          }}
        >
          {/* Close Button */}
          <button 
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '30px',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '2rem',
              cursor: 'pointer',
              zIndex: 10000
            }}
          >
            &times;
          </button>

          {/* Full Size Image Container */}
          <div 
            onClick={(e) => e.stopPropagation()} // Prevent clicking the image from closing the lightbox
            style={{ position: 'relative', maxHeight: '90vh', maxWidth: '90vw' }}
          >
            <img 
              src={selectedImage.imgUrl} 
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