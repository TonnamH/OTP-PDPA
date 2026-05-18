// src/pages/Documents.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../css/Documents.css';

export default function Documents() {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');

  // 1. Live Database State
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // 4. Clean Date Formatter (Automatically switches between Thai and English formats!)
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

  return (
    <div style={{ backgroundColor: 'var(--bg-white)', minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* 1. Header Section */}
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

      {/* 2. Documents Section */}
      <section className="section-full" style={{ paddingTop: '0' }}>
        <div className="container">
          
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontFamily: 'Prompt, sans-serif' }}>
            {t('documentsPage.title')}
          </h3>

          {/* Filter Pills */}
          <div className="filter-container">
            <button 
              className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              {/* Borrowed the word "All" from the infographics dictionary */}
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

          {/* Data Table */}
          {loading ? (
             <p style={{ textAlign: 'center', padding: '3rem', fontFamily: 'Prompt, sans-serif' }}>
               {t('documentsPage.loading')}
             </p>
          ) : (
            <div style={{ overflowX: 'auto' }}> {/* Ensures table is scrollable on small phones */}
              <table className="doc-table">
                <thead>
                  <tr>
                    {/* Borrowed headers from the Admin Dashboard dictionary */}
                    <th style={{ width: '60%' }}>{t('adminDashboard.table.title')}</th>
                    <th style={{ width: '30%' }}>{t('adminDashboard.table.date')}</th>
                    <th style={{ width: '10%', textAlign: 'center' }}>
                      {i18n.language === 'th' ? 'ดาวน์โหลด' : 'Download'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="doc-row">
                      <td style={{ fontFamily: 'Sarabun, sans-serif', fontWeight: '500' }}>{doc.title}</td>
                      <td style={{ color: 'var(--text-gray)' }}>{formatDate(doc.created_at)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <a 
                          href={`http://localhost:5000${doc.file_path}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ display: 'inline-block', color: 'var(--primary-navy)' }}
                        >
                          {/* A simple SVG Download Icon */}
                          <svg className="download-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredDocs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-gray)' }}>
                  {t('documentsPage.empty')}
                </div>
              )}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}