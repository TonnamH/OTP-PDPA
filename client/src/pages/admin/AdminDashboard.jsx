// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [infographics, setInfographics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both datasets at the same time when the dashboard loads
    const fetchData = async () => {
      try {
        const [docsRes, infoRes] = await Promise.all([
          fetch('http://localhost:5000/api/documents'),
          fetch('http://localhost:5000/api/infographics')
        ]);
        
        if (docsRes.ok && infoRes.ok) {
          const docsData = await docsRes.json();
          const infoData = await infoRes.json();
          setDocuments(docsData);
          setInfographics(infoData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date cleanly
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Reusable UI styles
  const cardStyle = {
    backgroundColor: 'white', padding: '2rem', borderRadius: '12px', 
    boxShadow: 'var(--shadow-elegant)', border: '1px solid var(--border-color)',
    marginBottom: '2rem'
  };

  const btnStyle = {
    display: 'inline-block', padding: '0.8rem 1.5rem', 
    backgroundColor: 'var(--primary-navy)', color: 'white', 
    textDecoration: 'none', borderRadius: '6px', fontFamily: 'Prompt, sans-serif',
    fontWeight: '600', transition: 'background-color 0.2s', marginRight: '1rem'
  };

  const thStyle = { textAlign: 'left', padding: '1rem', borderBottom: '2px solid var(--border-color)', color: 'var(--text-gray)' };
  const tdStyle = { padding: '1rem', borderBottom: '1px solid var(--border-color)' };

  // Reusable Table Component
  const DataTable = ({ data, title }) => (
    <div style={cardStyle}>
      <h2 style={{ fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)', marginTop: 0 }}>{title}</h2>
      {data.length === 0 ? (
        <p style={{ color: 'var(--text-gray)' }}>{t('adminDashboard.empty')}</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Sarabun, sans-serif', fontSize: '0.95rem' }}>
          <thead>
            <tr>
              <th style={thStyle}>{t('adminDashboard.table.title')}</th>
              <th style={thStyle}>{t('adminDashboard.table.category')}</th>
              <th style={thStyle}>{t('adminDashboard.table.date')}</th>
              <th style={thStyle}>{t('adminDashboard.table.view')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td style={{...tdStyle, fontWeight: '500', color: 'var(--text-dark)'}}>{item.title}</td>
                <td style={tdStyle}>
                  <span style={{ backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
                    {item.category}
                  </span>
                </td>
                <td style={tdStyle}>{formatDate(item.created_at)}</td>
                <td style={tdStyle}>
                  <a 
                    href={`http://localhost:5000${item.file_path || item.image_path}`} 
                    target="_blank" rel="noopener noreferrer"
                    style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}
                  >
                    {t('adminDashboard.table.view')}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '80vh', padding: '3rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)', margin: '0 0 0.5rem 0' }}>
            {t('adminDashboard.title')}
          </h1>
          <p style={{ margin: 0, color: 'var(--text-gray)', fontFamily: 'Sarabun, sans-serif' }}>
            {t('adminDashboard.subtitle')}
          </p>
        </div>

        {/* Quick Actions Panel */}
        <div style={{ ...cardStyle, backgroundColor: '#f8fafc', borderLeft: '4px solid var(--primary-navy)' }}>
          <h3 style={{ fontFamily: 'Prompt, sans-serif', marginTop: 0 }}>{t('adminDashboard.quickActions')}</h3>
          <Link to="/admin/documents/upload" style={btnStyle}>
            {t('adminDashboard.uploadDocBtn')}
          </Link>
          <Link to="/admin/infographics/upload" style={{...btnStyle, backgroundColor: '#475569'}}>
            {t('adminDashboard.uploadInfoBtn')}
          </Link>
        </div>

        {/* Data Tables */}
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-gray)', fontFamily: 'Prompt, sans-serif' }}>
            {t('adminDashboard.loading')}
          </p>
        ) : (
          <>
            <DataTable data={documents} title={t('adminDashboard.recentDocs')} />
            <DataTable data={infographics} title={t('adminDashboard.recentInfo')} />
          </>
        )}

      </div>
    </div>
  );
}