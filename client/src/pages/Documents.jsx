// src/pages/Documents.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../css/Documents.css';

export default function Documents() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');

  // THE FAKE DATABASE: 
  // Once you build a real backend, this will be replaced by a fetch() call.
  const documentDB = [
    { id: 1, title: 'พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562', date: 'ณ วันที่ 28 พ.ค. 2562', category: 'law', url: '#' },
    { id: 2, title: 'หลักเกณฑ์และวิธีการในการแจ้งเหตุละเมิดข้อมูลส่วนบุคคล พ.ศ. 2565', date: 'ณ วันที่ 28 พ.ค. 2562', category: 'order', url: '#' },
    { id: 3, title: 'มาตรการรักษาความมั่นคงปลอดภัยของผู้ควบคุมข้อมูลส่วนบุคคล พ.ศ. 2565', date: 'ณ วันที่ 28 พ.ค. 2562', category: 'policy', url: '#' },
    { id: 4, title: 'แนวทางการแจ้งวัตถุประสงค์และรายละเอียดในการเก็บข้อมูลส่วนบุคคล', date: 'ณ วันที่ 28 พ.ค. 2562', category: 'policy', url: '#' },
    { id: 5, title: 'แนวปฏิบัติสำหรับผู้ควบคุมข้อมูลส่วนบุคคลและผู้ประมวลผลข้อมูลส่วนบุคคล', date: 'ณ วันที่ 28 พ.ค. 2562', category: 'policy', url: '#' },
    { id: 6, title: 'แบบฟอร์มคำร้องขอใช้สิทธิของเจ้าของข้อมูลส่วนบุคคล (Data Subject Request Form)', date: 'ณ วันที่ 10 มิ.ย. 2565', category: 'form', url: '#' }
  ];

  // The logic that actually filters the array based on the clicked button
  const filteredDocs = activeFilter === 'all' 
    ? documentDB 
    : documentDB.filter(doc => doc.category === activeFilter);

  return (
    <div style={{ backgroundColor: 'var(--bg-white)', minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* 1. Header Section */}
      <section className="section-full" style={{ paddingBottom: '2rem' }}>
        <div className="container">
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'Prompt, sans-serif' }}>
              {t('docs.title')}
            </h1>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-gray)', fontWeight: '400' }}>
              {t('docs.subtitle')}
            </h2>
          </div>
        </div>
      </section>

      {/* 2. Documents Section */}
      <section className="section-full" style={{ paddingTop: '0' }}>
        <div className="container">
          
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontFamily: 'Prompt, sans-serif' }}>
            {t('docs.sectionTitle')}
          </h3>

          {/* Filter Pills */}
          <div className="filter-container">
            {['all', 'law', 'order', 'policy', 'form'].map(filterKey => (
              <button 
                key={filterKey}
                className={`filter-pill ${activeFilter === filterKey ? 'active' : ''}`}
                onClick={() => setActiveFilter(filterKey)}
              >
                {t(`docs.filters.${filterKey}`)}
              </button>
            ))}
          </div>

          {/* Data Table */}
          <div style={{ overflowX: 'auto' }}> {/* Ensures table is scrollable on small phones */}
            <table className="doc-table">
              <thead>
                <tr>
                  <th style={{ width: '60%' }}>{t('docs.table.file')}</th>
                  <th style={{ width: '30%' }}>{t('docs.table.date')}</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>{t('docs.table.download')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="doc-row">
                    <td style={{ fontFamily: 'Sarabun, sans-serif' }}>{doc.title}</td>
                    <td style={{ color: 'var(--text-gray)' }}>{doc.date}</td>
                    <td style={{ textAlign: 'center' }}>
                      <a href={doc.url} download style={{ display: 'inline-block' }}>
                        {/* A simple SVG Download Icon */}
                        <svg className="download-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                ไม่มีเอกสารในหมวดหมู่นี้
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}