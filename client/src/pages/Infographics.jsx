// src/pages/Infographics.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FadeIn from '../components/FadeIn';
import '../css/Infographics.css';
import Icon from '../components/Icon';

const FILTERS = ['all', 'basics', 'roles', 'operations', 'it_security'];

export default function Infographics() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [infographics, setInfographics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchInfographics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/infographics');
        if (response.ok) setInfographics(await response.json());
      } catch (err) {
        console.error('Failed to fetch infographics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfographics();
  }, []);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setSelectedImage(null); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => { setCurrentPage(1); }, [activeFilter]);

  const filteredDocs = activeFilter === 'all'
    ? infographics
    : infographics.filter(doc => doc.category === activeFilter);

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const currentData = filteredDocs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '5rem' }}>

      {/* HERO */}
      <FadeIn delay={0.1}>
        <section className="infographics-hero">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <Icon name="image" size={16} color="rgba(255,255,255,0.5)" strokeWidth={1.8}/>
              <span style={{
                fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)'
              }}>
                Infographics
              </span>
            </div>
            <h1>{t('infographicsPage.title', 'อินโฟกราฟิก PDPA')}</h1>
            <p>{t('infographicsPage.subtitle', 'สื่อความรู้เกี่ยวกับ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล ในรูปแบบที่เข้าใจง่าย')}</p>
          </div>
        </section>
      </FadeIn>

      {/* GALLERY */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">

          {/* Filters */}
          <FadeIn delay={0.2}>
            <div className="infographics-filters">
              {FILTERS.map(key => (
                <button
                  key={key}
                  className={`filter-pill ${activeFilter === key ? 'active' : ''}`}
                  onClick={() => setActiveFilter(key)}
                >
                  {t(`infographicsPage.filters.${key}`, key)}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* Grid */}
          <FadeIn delay={0.3}>
            {loading ? (
              <div className="infographics-empty">
                <Icon name="search" size={40} color="#e2e8f0" strokeWidth={1.2}/>
                <p>{t('infographicsPage.loading', 'กำลังโหลด...')}</p>
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="infographics-empty">
                <Icon name="image" size={40} color="#e2e8f0" strokeWidth={1.2}/>
                <p>{t('infographicsPage.empty', 'ไม่พบอินโฟกราฟิกในหมวดหมู่นี้')}</p>
              </div>
            ) : (
              <>
                <div className="infographics-grid">
                  {currentData.map((item) => (
                    <div
                      key={item.id}
                      className="infographic-card"
                      onClick={() => setSelectedImage(item)}
                    >
                      <div className="infographic-card-image">
                        <img
                          src={`http://localhost:5000${item.image_path}`}
                          alt={item.title}
                        />
                      </div>
                      <div className="infographic-card-body">
                        {item.category && (
                          <span className="infographic-card-category">
                            {t(`infographicsPage.filters.${item.category}`, item.category)}
                          </span>
                        )}
                        <h4 className="infographic-card-title">{item.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination-wrapper">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        className={`page-btn ${pageNum === currentPage ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </FadeIn>

        </div>
      </section>

      {/* LIGHTBOX */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
          <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
            &times;
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={`http://localhost:5000${selectedImage.image_path}`}
              alt={selectedImage.title}
            />
            <p className="lightbox-title">{selectedImage.title}</p>
          </div>
        </div>
      )}

    </div>
  );
}