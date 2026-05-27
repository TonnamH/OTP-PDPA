// src/pages/Documents.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FadeIn from '../components/FadeIn';
import '../css/Documents.css';
import api from '../utils/api';
import Icon from '../components/Icon';

const FILTERS = ['all', 'law', 'order', 'policy', 'form'];

export default function Documents() {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/documents'); 
        setDocuments(response.data);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const filteredDocs = activeFilter === 'all'
    ? documents
    : documents.filter(doc => doc.category === activeFilter);

  useEffect(() => { setCurrentPage(1); }, [activeFilter]);

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const currentData = filteredDocs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(
      i18n.language === 'th' ? 'th-TH' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '5rem' }}>

      {/* HERO */}
      <FadeIn delay={0.1}>
        <section className="documents-hero">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <Icon name="document" size={16} color="rgba(255,255,255,0.5)" strokeWidth={1.8}/>
              <span style={{
                fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)'
              }}>
                Document Center
              </span>
            </div>
            <h1>{t('documentsPage.title', 'เอกสารและแบบฟอร์ม')}</h1>
            <p>{t('documentsPage.subtitle', 'รวบรวมนโยบาย คู่มือ กฎหมาย และแบบฟอร์มที่เกี่ยวข้องกับการคุ้มครองข้อมูลส่วนบุคคล')}</p>
          </div>
        </section>
      </FadeIn>

      {/* MAIN CONTENT */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container" style={{ maxWidth: '1400px' }}>
          <FadeIn delay={0.2}>
            <div className="documents-card">

              {/* Header + Filters */}
              <div className="documents-card-header">
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  marginBottom: '1.2rem', color: 'var(--primary-navy)'
                }}>
                  <Icon name="filter" size={16} strokeWidth={2}/>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: '#94a3b8'
                  }}>
                    หมวดหมู่
                  </span>
                </div>

                <div className="filter-container">
                  {FILTERS.map(key => (
                    <button
                      key={key}
                      className={`filter-pill ${activeFilter === key ? 'active' : ''}`}
                      onClick={() => setActiveFilter(key)}
                    >
                      {key === 'all'
                        ? t('infographicsPage.filters.all', 'ทั้งหมด')
                        : t(`documentsPage.categories.${key}`, key)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table Body */}
              <div className="documents-card-body">
                {loading ? (
                  <div className="doc-empty">
                    <Icon name="search" size={36} color="#cbd5e1" strokeWidth={1.2}/>
                    <p>{t('documentsPage.loading', 'กำลังโหลดเอกสาร...')}</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table className="doc-table">
                      <thead>
                        <tr>
                          <th style={{ width: '60%' }}>{t('adminDashboard.table.title', 'ชื่อเอกสาร')}</th>
                          <th style={{ width: '25%' }}>{t('adminDashboard.table.date', 'วันที่')}</th>
                          <th style={{ width: '15%', textAlign: 'center' }}>
                            {i18n.language === 'th' ? 'ดาวน์โหลด' : 'Download'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.map((doc) => (
                          <tr key={doc.id} className="doc-row">
                            <td className="doc-title-cell">{doc.title}</td>
                            <td className="doc-date-cell">
                              <div className="doc-date-inner">
                                <Icon name="calendar" size={13} color="#cbd5e1" strokeWidth={1.8}/>
                                {formatDate(doc.created_at)}
                              </div>
                            </td>
                            <td style={{ textAlign: 'center', padding: '1rem' }}>
                              <a
                                href={`http://localhost:5000${doc.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="download-btn"
                                title="Download"
                              >
                                <Icon name="download" size={16} strokeWidth={2}/>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Empty state */}
                    {filteredDocs.length === 0 && !loading && (
                      <div className="doc-empty">
                        <Icon name="document" size={40} color="#e2e8f0" strokeWidth={1}/>
                        <p>{t('documentsPage.empty', 'ไม่พบเอกสารในหมวดหมู่นี้')}</p>
                      </div>
                    )}

                    {/* Pagination */}
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
                  </div>
                )}
              </div>

            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}