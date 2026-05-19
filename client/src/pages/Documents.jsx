// src/pages/Documents.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FadeIn from '../components/FadeIn'; // <-- 1. Import the FadeIn component
import '../css/Documents.css';

export default function Documents() {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');

  // 1. Live Database & Pagination State
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Change this number to show more/less items per page!

  // 2. Fetch from Node Backend
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/documents');
        if (response.ok) {
          const data = await response.json();
          setDocuments(data);
        }
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  // 3. Filter Logic
  const filteredDocs = activeFilter === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === activeFilter);

  // --- Reset to page 1 whenever the filter changes ---
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // --- Pagination Math ---
  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredDocs.slice(startIndex, startIndex + itemsPerPage);

  // 4. Clean Date Formatter
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const locale = i18n.language === 'th' ? 'th-TH' : 'en-US';
    return date.toLocaleDateString(locale, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Pagination Styles (Matching the Admin Dashboard)
  const pageBtnStyle = {
    padding: '0.4rem 0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px',
    backgroundColor: 'white', cursor: 'pointer', fontFamily: 'Prompt, sans-serif', fontSize: '0.9rem',
    transition: 'all 0.2s', color: 'var(--text-dark)'
  };
  const activePageBtnStyle = {
    ...pageBtnStyle, backgroundColor: 'var(--primary-navy)', color: 'white', border: '1px solid var(--primary-navy)'
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-white)', minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* 1. Header Section */}
      <FadeIn delay={0.1}>
        <section className="section-full" style={{ paddingBottom: '2rem' }}>
          <div className="container">
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'Prompt, sans-serif' }}>
                {t('documentsPage.title')}
              </h1>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-gray)', fontWeight: '400' }}>
                {t('documentsPage.subtitle')}
              </h2>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* 2. Documents Section */}
      <section className="section-full" style={{ paddingTop: '0' }}>
        <div className="container">
          
          <FadeIn delay={0.2}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontFamily: 'Prompt, sans-serif' }}>
              {t('documentsPage.title')}
            </h3>
          </FadeIn>

          {/* Filter Pills */}
          <FadeIn delay={0.3}>
            <div className="filter-container">
              <button 
                className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                {t('infographicsPage.filters.all')}
              </button>
              
              {['law', 'order', 'policy', 'form'].map(filterKey => (
                <button 
                  key={filterKey}
                  className={`filter-pill ${activeFilter === filterKey ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filterKey)}
                >
                  {t(`documentsPage.categories.${filterKey}`)}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* Data Table */}
          <FadeIn delay={0.4}>
            {loading ? (
               <p style={{ textAlign: 'center', padding: '3rem', fontFamily: 'Prompt, sans-serif' }}>
                 {t('documentsPage.loading')}
               </p>
            ) : (
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '0.5rem' }}>
                <table className="doc-table" style={{ width: '100%', minWidth: '800px', tableLayout: 'fixed' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '60%' }}>{t('adminDashboard.table.title')}</th>
                      <th style={{ width: '30%' }}>{t('adminDashboard.table.date')}</th>
                      <th style={{ width: '10%', textAlign: 'center' }}>
                        {i18n.language === 'th' ? 'ดาวน์โหลด' : 'Download'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((doc) => (
                      <tr key={doc.id} className="doc-row">
                        <td style={{ 
                          fontFamily: 'Sarabun, sans-serif', 
                          fontWeight: '500',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis' 
                        }}>
                          {doc.title}
                        </td>
                        <td style={{ color: 'var(--text-gray)' }}>{formatDate(doc.created_at)}</td>
                        <td style={{ textAlign: 'center' }}>
                          <a 
                            href={`http://localhost:5000${doc.file_path}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ display: 'inline-block', color: 'var(--primary-navy)' }}
                          >
                            <svg className="download-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Empty State */}
                {filteredDocs.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-gray)' }}>
                    {t('documentsPage.empty')}
                  </div>
                )}

                {/* Pagination Controls - Numbers Only */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        style={pageNum === currentPage ? activePageBtnStyle : pageBtnStyle}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </FadeIn>

        </div>
      </section>

    </div>
  );
}