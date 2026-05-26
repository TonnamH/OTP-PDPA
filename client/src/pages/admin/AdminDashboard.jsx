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

  const cardStyle = {
    backgroundColor: 'white', padding: '2rem', borderRadius: '12px',
    boxShadow: 'var(--shadow-elegant)', border: '1px solid var(--border-color)',
    marginBottom: '2rem'
  };

  const thStyle = {
    textAlign: 'left', padding: '1rem', borderBottom: '2px solid var(--border-color)',
    color: 'var(--text-gray)', backgroundColor: 'white', position: 'relative', zIndex: 10
  };
  const tdStyle = { padding: '1rem', borderBottom: '1px solid var(--border-color)' };

  const pageBtnStyle = {
    padding: '0.4rem 0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px',
    backgroundColor: 'white', cursor: 'pointer', fontFamily: 'Prompt, sans-serif', fontSize: '0.9rem',
    transition: 'all 0.2s', color: 'var(--text-dark)'
  };
  const activePageBtnStyle = { ...pageBtnStyle, backgroundColor: 'var(--primary-navy)', color: 'white', border: '1px solid var(--primary-navy)' };

  useEffect(() => { setCurrentPage(1); }, [data]);

  const handleDeleteClick = (id) => {
    if (window.confirm(t('adminDashboard.messages.confirmDelete'))) {
      onDelete(id);
    }
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)', margin: 0 }}>{title}</h2>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-gray)', fontFamily: 'Sarabun, sans-serif' }}>
          {data.length} items total
        </span>
      </div>

      {data.length === 0 ? (
        <p style={{ color: 'var(--text-gray)' }}>{t('adminDashboard.empty')}</p>
      ) : (
        <>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '0.5rem' }}>
            <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', fontFamily: 'Sarabun, sans-serif', fontSize: '0.95rem', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: '45%' }}>{t('adminDashboard.table.title')}</th>
                  <th style={{ ...thStyle, width: '15%' }}>{t('adminDashboard.table.category')}</th>
                  <th style={{ ...thStyle, width: '15%' }}>{t('adminDashboard.table.date')}</th>
                  <th style={{ ...thStyle, width: '25%' }}>{t('adminDashboard.table.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item) => (
                  <tr key={item.id}>
                    <td style={{ ...tdStyle, fontWeight: '500', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
                        {item.category}
                      </span>
                    </td>
                    <td style={tdStyle}>{formatDate(item.created_at)}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <a
                          href={`http://localhost:5000${item.file_path || item.image_path}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}
                        >
                          {t('adminDashboard.table.view')}
                        </a>
                        <Link
                          to={`${editBaseUrl}/${item.id}`}
                          style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: '600' }}
                        >
                          {t('adminDashboard.table.edit', 'Edit')}
                        </Link>

                        {/* --- Delete Button --- */}
                        <button
                          onClick={() => handleDeleteClick(item.id)}
                          style={{
                            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                            color: '#ef4444', fontWeight: '600', fontFamily: 'Sarabun, sans-serif', fontSize: '0.95rem'
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
  const [loading, setLoading] = useState(true);

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
    backgroundColor: 'var(--primary-navy)', color: 'white',
    textDecoration: 'none', borderRadius: '6px', fontFamily: 'Prompt, sans-serif',
    fontWeight: '600', transition: 'background-color 0.2s', marginRight: '1rem'
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '80vh', padding: '3rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>

        {/* Title Section */}
        <FadeIn delay={0.1}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)', margin: '0 0 0.5rem 0' }}>
              {t('adminDashboard.title')}
            </h1>
            <p style={{ margin: 0, color: 'var(--text-gray)', fontFamily: 'Sarabun, sans-serif' }}>
              {t('adminDashboard.subtitle')}
            </p>
          </div>
        </FadeIn>

        {/* Quick Actions Card */}
        <FadeIn delay={0.2}>
          <div style={{
            backgroundColor: '#f8fafc', padding: '2rem', borderRadius: '12px',
            boxShadow: 'var(--shadow-elegant)', border: '1px solid var(--border-color)',
            borderLeft: '4px solid var(--primary-navy)', marginBottom: '2rem'
          }}>
            <h3 style={{ fontFamily: 'Prompt, sans-serif', marginTop: 0 }}>{t('adminDashboard.quickActions')}</h3>
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
            <p style={{ textAlign: 'center', color: 'var(--text-gray)', fontFamily: 'Prompt, sans-serif' }}>
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
          </>
        )}

      </div>
    </div>
  );
}
