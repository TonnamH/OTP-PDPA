// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FadeIn from '../../components/FadeIn';
import adminApi from '../../utils/adminApi';

// --- DataTable Component ---
const DataTable = ({ data, title, t, editBaseUrl, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const pageBtnStyle = {
    padding: '0.4rem 0.8rem', border: '1px solid #e2e8f0', borderRadius: '4px',
    backgroundColor: '#ffffff', cursor: 'pointer', fontFamily: 'Prompt, sans-serif', fontSize: '0.9rem',
    transition: 'all 0.2s', color: '#1e293b'
  };
  const activePageBtnStyle = { ...pageBtnStyle, backgroundColor: '#1e3a8a', color: '#ffffff', border: '1px solid #1e3a8a' };

  useEffect(() => { setCurrentPage(1); }, [data]);

  const handleDeleteClick = (id) => {
    if (window.confirm(t('adminDashboard.messages.confirmDelete'))) {
      onDelete(id);
    }
  };

  return (
    <div style={{
      background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden', marginBottom: '2rem'
    }}>

      {/* Header with Navy Accent Strip */}
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: '1rem' }}>
          <div style={{ width: '5px', backgroundColor: '#1e3a8a', borderRadius: '4px' }}></div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e3a8a', margin: '0 0 0.2rem', fontFamily: 'Prompt, sans-serif' }}>
              {title}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, fontFamily: 'Prompt, sans-serif' }}>
              {data.length} {t('adminDashboard.itemsTotal', 'items total')}
            </p>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontFamily: 'Prompt, sans-serif' }}>
          {t('adminDashboard.empty')}
        </div>
      ) : (
        <>
          {/* Compact Edge-to-Edge Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'Prompt, sans-serif', fontSize: '0.95rem' }}>
              <thead style={{ background: '#f8fafc', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <tr>
                  <th style={{ padding: '1rem 2rem', fontWeight: '600', borderBottom: '2px solid #e2e8f0', width: '45%' }}>{t('adminDashboard.table.title')}</th>
                  <th style={{ padding: '1rem 2rem', fontWeight: '600', borderBottom: '2px solid #e2e8f0', width: '15%' }}>{t('adminDashboard.table.category')}</th>
                  <th style={{ padding: '1rem 2rem', fontWeight: '600', borderBottom: '2px solid #e2e8f0', width: '15%' }}>{t('adminDashboard.table.date')}</th>
                  <th style={{ padding: '1rem 2rem', fontWeight: '600', borderBottom: '2px solid #e2e8f0', width: '25%' }}>{t('adminDashboard.table.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '1rem 2rem', fontWeight: '500', color: '#1e293b' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                        {item.title}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 2rem' }}>
                      <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '500' }}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 2rem', color: '#64748b', fontSize: '0.9rem' }}>
                      {formatDate(item.created_at)}
                    </td>
                    <td style={{ padding: '1rem 2rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <a
                          href={`http://localhost:5000${item.file_path || item.image_path}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}
                        >
                          {t('adminDashboard.table.view')}
                        </a>
                        <Link
                          to={`${editBaseUrl}/${item.id}`}
                          style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}
                        >
                          {t('adminDashboard.table.edit', 'Edit')}
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(item.id)}
                          style={{
                            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                            color: '#ef4444', fontWeight: '600', fontFamily: 'Prompt, sans-serif', fontSize: '0.9rem'
                          }}
                        >
                          {t('adminDashboard.table.delete', 'Delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Section with its own border and padding */}
          {totalPages > 1 && (
            <div style={{ padding: '1rem 2rem', borderTop: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem' }}>
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
        </>
      )}
    </div>
  );
};

// --- Main Dashboard Component ---
export default function AdminDashboard() {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [infographics, setInfographics] = useState([]);
  const [pageStats, setPageStats] = useState([]);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch documents and infographics
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, infoRes] = await Promise.all([
          adminApi.get('/documents'),
          adminApi.get('/infographics')
        ]);

        setDocuments(docsRes.data);
        setInfographics(infoRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch module popularity stats
  useEffect(() => {
    const fetchPageStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/page-stats');
        if (response.ok) {
          const data = await response.json();
          setPageStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch page stats:', error);
      }
    };
    fetchPageStats();
  }, []);

  // --- Delete Handlers ---
  const deleteItem = async (id, type) => {
    const endpoint = type === 'document' ? `/documents/${id}` : `/infographics/${id}`;

    try {
      await adminApi.delete(endpoint);

      if (type === 'document') {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
      } else {
        setInfographics(prev => prev.filter(info => info.id !== id));
      }
      alert(t('adminDashboard.messages.deleteSuccess'));
    } catch (error) {
      console.error('Failed to delete:', error);
      alert(t('adminDashboard.messages.deleteError'));
    }
  };

  const btnStyle = {
    display: 'inline-block', padding: '0.8rem 1.5rem',
    backgroundColor: '#1e3a8a', color: '#ffffff',
    textDecoration: 'none', borderRadius: '6px', fontFamily: 'Prompt, sans-serif',
    fontWeight: '600', transition: 'background-color 0.2s', marginRight: '1rem'
  };

  return (
    // Added admin-dashboard-root and forced light gray background
    <div className="admin-dashboard-root" style={{ backgroundColor: '#f1f5f9', minHeight: '80vh', padding: '3rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>

        {/* Title Section */}
        <FadeIn delay={0.1}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontFamily: 'Prompt, sans-serif', color: '#1e3a8a', margin: '0 0 0.5rem 0' }}>
              {t('adminDashboard.title')}
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontFamily: 'Prompt, sans-serif' }}>
              {t('adminDashboard.subtitle')}
            </p>
          </div>
        </FadeIn>

        {/* Quick Actions Card */}
        <FadeIn delay={0.2}>
          <div style={{
            backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', border: '1px solid #e2e8f0',
            borderLeft: '4px solid #1e3a8a', marginBottom: '2rem'
          }}>
            <h3 style={{ fontFamily: 'Prompt, sans-serif', marginTop: 0, color: '#1e293b' }}>{t('adminDashboard.quickActions')}</h3>
            <Link to="/admin/documents/upload" style={btnStyle}>
              {t('adminDashboard.uploadDocBtn')}
            </Link>
            <Link to="/admin/infographics/upload" style={{ ...btnStyle, backgroundColor: '#475569' }}>
              {t('adminDashboard.uploadInfoBtn')}
            </Link>
          </div>
        </FadeIn>

        {loading ? (
          <FadeIn delay={0.3}>
            <p style={{ textAlign: 'center', color: '#64748b', fontFamily: 'Prompt, sans-serif' }}>
              {t('adminDashboard.loading')}
            </p>
          </FadeIn>
        ) : (
          <>
            {/* Documents Table */}
            <FadeIn delay={0.3}>
              <DataTable
                data={documents}
                title={t('adminDashboard.recentDocs')}
                t={t}
                editBaseUrl="/admin/documents/edit"
                onDelete={(id) => deleteItem(id, 'document')}
              />
            </FadeIn>

            {/* Infographics Table */}
            <FadeIn delay={0.4}>
              <DataTable
                data={infographics}
                title={t('adminDashboard.recentInfo')}
                t={t}
                editBaseUrl="/admin/infographics/edit"
                onDelete={(id) => deleteItem(id, 'infographic')}
              />
            </FadeIn>

            {/* MODULE POPULARITY STATS (Page Views) */}
            <FadeIn delay={0.5}>
              <div style={{
                background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                overflow: 'hidden', marginBottom: '2rem'
              }}>

                {/* Header with Sky Blue Accent Strip */}
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'stretch', gap: '1rem' }}>
                    <div style={{ width: '5px', backgroundColor: '#0ea5e9', borderRadius: '4px' }}></div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e3a8a', margin: '0 0 0.3rem', fontFamily: 'Prompt, sans-serif' }}>
                        {t('adminDashboard.popularityTitle')}
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, fontFamily: 'Prompt, sans-serif' }}>
                        {t('adminDashboard.popularitySubtitle')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* --- BAR CHART SECTION --- */}
                {pageStats && pageStats.length > 0 && (
                  <div style={{ padding: '2rem 2rem 3rem 2rem', borderBottom: '1px solid #e2e8f0' }}>
                    {(() => {
                      // Calculate the max value for the Y-Axis dynamically
                      const maxCount = Math.max(...pageStats.map(s => s.view_count), 1);
                      const chartMax = Math.max(Math.ceil(maxCount / 4) * 4, 4);
                      const step = chartMax / 4;

                      return (
                        <div style={{ display: 'flex', width: '100%', height: '280px', position: 'relative', paddingBottom: '32px' }}>

                          {/* Y-Axis Labels */}
                          <div style={{
                            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end',
                            paddingRight: '12px', height: '100%', color: '#64748b', fontSize: '0.85rem',
                            fontWeight: '600', fontFamily: 'Prompt, sans-serif', userSelect: 'none', width: '40px', flexShrink: 0
                          }}>
                            <span>{chartMax}</span>
                            <span>{chartMax - step}</span>
                            <span>{chartMax - step * 2}</span>
                            <span>{chartMax - step * 3}</span>
                            <span>0</span>
                          </div>

                          {/* Main Chart Area */}
                          <div style={{ flex: 1, position: 'relative', height: '100%' }}>

                            {/* Grid Lines */}
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 0, pointerEvents: 'none' }}>
                              <div style={{ borderTop: '1px dashed #cbd5e1', width: '100%' }}></div>
                              <div style={{ borderTop: '1px dashed #e2e8f0', width: '100%' }}></div>
                              <div style={{ borderTop: '1px dashed #e2e8f0', width: '100%' }}></div>
                              <div style={{ borderTop: '1px dashed #e2e8f0', width: '100%' }}></div>
                              <div style={{ borderTop: '2px solid #cbd5e1', width: '100%' }}></div>
                            </div>

                            {/* Responsive Flex Bars */}
                            <div style={{ position: 'relative', zIndex: 1, display: 'flex', height: '100%', alignItems: 'flex-end', justifyContent: 'space-evenly', width: '100%', padding: '0 0.5rem' }}>
                              {pageStats.map((stat, idx) => {
                                const barHeightPercent = Math.min((stat.view_count / chartMax) * 100, 100);
                                const isHovered = hoveredStat === idx;

                                return (
                                  <div
                                    key={idx}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: '100%', maxWidth: '50px', height: '100%', justifyContent: 'flex-end', cursor: 'pointer' }}
                                    onMouseEnter={() => setHoveredStat(idx)}
                                    onMouseLeave={() => setHoveredStat(null)}
                                  >
                                    {/* Tooltip */}
                                    {isHovered && (
                                      <div style={{
                                        position: 'absolute', bottom: `calc(${barHeightPercent}% + 12px)`,
                                        backgroundColor: '#1e293b', color: '#ffffff', padding: '0.4rem 0.8rem',
                                        borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500',
                                        fontFamily: 'Prompt, sans-serif', whiteSpace: 'nowrap', zIndex: 50,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)', pointerEvents: 'none'
                                      }}>
                                        {stat.page_path} : {stat.view_count} {t('adminDashboard.visits')}
                                        <div style={{
                                          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                                          borderWidth: '5px', borderStyle: 'solid', borderColor: '#1e293b transparent transparent transparent'
                                        }} />
                                      </div>
                                    )}

                                    {/* Sky Blue Gradient Bar */}
                                    <div style={{
                                      height: `${barHeightPercent}%`, width: '100%',
                                      background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
                                      borderRadius: barHeightPercent > 2 ? '6px 6px 0 0' : '2px 2px 0 0',
                                      boxShadow: isHovered ? '0 0 15px rgba(2, 132, 199, 0.5)' : (stat.view_count > 0 ? '0 -4px 12px rgba(2, 132, 199, 0.2)' : 'none'),
                                      opacity: hoveredStat !== null && !isHovered ? 0.4 : 1, transition: 'all 0.2s ease-out'
                                    }} />

                                    {/* X-Axis Label (Truncates long URLs automatically) */}
                                    <span style={{
                                      position: 'absolute', top: '100%', marginTop: '8px', width: '100%', textAlign: 'center',
                                      fontSize: '0.75rem', color: isHovered ? '#0284c7' : '#64748b',
                                      fontWeight: isHovered ? '700' : '600', fontFamily: 'monospace',
                                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                      transition: 'color 0.2s'
                                    }}>
                                      {stat.page_path === '/' ? '/home' : stat.page_path}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* --- DATA TABLE SECTION --- */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                    <thead style={{ background: '#f8fafc', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <tr>
                        <th style={{ padding: '1rem 2rem', fontWeight: '600', borderBottom: '2px solid #e2e8f0' }}>{t('adminDashboard.table.path')}</th>
                        <th style={{ padding: '1rem 2rem', fontWeight: '600', textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>{t('adminDashboard.table.views')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageStats && pageStats.length > 0 ? (
                        pageStats.map((stat, idx) => (
                          <tr
                            key={idx}
                            style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <td style={{ padding: '1rem 2rem', color: '#1e293b', fontWeight: '500', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                              <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '0.3rem 0.8rem', borderRadius: '6px' }}>
                                {stat.page_path}
                              </span>
                            </td>
                            <td style={{ padding: '1rem 2rem', textAlign: 'right', fontWeight: '600', color: '#1e293b' }}>
                              {stat.view_count.toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '500', fontFamily: 'Prompt, sans-serif' }}>{t('adminDashboard.visits')}</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', fontFamily: 'Prompt, sans-serif' }}>
                            {t('adminDashboard.loadingPopularity')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </FadeIn>
          </>
        )}

      </div>
    </div>
  );
}