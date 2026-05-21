// src/pages/Ropa.jsx
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import FadeIn from '../components/FadeIn';
import ropaData from '../data/ropaData.json';

export default function Ropa() {
  const { t } = useTranslation();

  // --- STATE ---
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [filters, setFilters] = useState({
    hasGeneralData: false,
    hasSensitiveData: false,
    lawfulBasis: 'all',
    retention: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [modalData, setModalData] = useState(null);

  const pdfFilePath = '/6.PDPA_ROPA_OTP-2568-10-30.pdf';

  // --- FILTER LOGIC ---
  const filteredActivities = useMemo(() => {
    if (!selectedDept) return [];

    const dept = ropaData.find(d => d.id === selectedDept);
    if (!dept) return [];

    return dept.activities.filter(activity => {
      // Search filter
      if (searchQuery && !activity.name?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Data type filters
      if (filters.hasSensitiveData && (!activity.sensitiveData || activity.sensitiveData.length === 0)) {
        return false;
      }

      // Lawful basis filter (Checking both Article 24 and 26)
      if (filters.lawfulBasis !== 'all') {
        const basis24 = activity.lawfulBasis24 || '';
        const basis26 = activity.lawfulBasis26 || '';
        if (!basis24.includes(filters.lawfulBasis) && !basis26.includes(filters.lawfulBasis)) {
          return false;
        }
      }

      // Retention filter (Mapped to G1)
      if (filters.retention !== 'all') {
        const retentionStr = activity.retentionPeriodG1 || '';
        const years = parseInt(retentionStr) || 0;
        const isLifetime = retentionStr.includes('ตลอดชีพ') || retentionStr.includes('ตลอดอายุ');
        
        if (filters.retention === 'short' && (years > 1 || isLifetime)) return false;
        if (filters.retention === 'medium' && (years <= 1 || years > 5 || isLifetime)) return false;
        if (filters.retention === 'long' && years <= 5 && !isLifetime) return false;
      }

      return true;
    });
  }, [selectedDept, filters, searchQuery]);

  // --- HANDLERS ---
  const resetFilters = () => {
    setFilters({
      hasGeneralData: false,
      hasSensitiveData: false,
      lawfulBasis: 'all',
      retention: 'all'
    });
    setSearchQuery('');
  };

  const handleBack = () => {
    if (selectedActivity) {
      setSelectedActivity(null);
    } else if (selectedDept) {
      setSelectedDept(null);
      resetFilters();
    }
  };

  // Get current data
  const currentDept = ropaData.find(d => d.id === selectedDept);
  const currentActivity = currentDept?.activities.find(a => a.id === selectedActivity);

  // Helper to safely display combined lawful basis
  const getCombinedBasis = (act) => {
    const b24 = act?.lawfulBasis24 || '';
    const b26 = act?.lawfulBasis26 || '';
    if (b24 && b26) return `${b24} / ${b26}`;
    return b24 || b26 || 'ไม่มีระบุ';
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '5rem', fontFamily: 'Prompt, sans-serif' }}>

      {/* HERO SECTION - Fonts forced to crisp white */}
      <FadeIn delay={0.1}>
        <section className="section-full" style={{ backgroundColor: 'var(--primary-navy)', paddingBottom: '3rem' }}>
          <div className="container">
            <div style={{ maxWidth: '800px' }}>
              <h1 style={{ fontSize: '2.8rem', marginBottom: '0.8rem', color: '#ffffff' }}>
                {t('ropa.title', 'บันทึกกิจกรรมการประมวลผลข้อมูลส่วนบุคคล')}
              </h1>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '300', opacity: '0.9', lineHeight: '1.6', color: '#ffffff' }}>
                {t('ropa.subtitle', 'สำรวจว่า สนข. เก็บข้อมูลอะไร ทำไม และอย่างไร — เพื่อความโปร่งใสและสิทธิของคุณ')}
              </h2>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* BREADCRUMB & BACK BUTTON */}
      {(selectedDept || selectedActivity) && (
        <FadeIn delay={0.15}>
          <div style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border-color)' }}>
            <div className="container" style={{ padding: '1rem 0' }}>
              <button
                onClick={handleBack}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none',
                  border: 'none', color: 'var(--primary-navy)', fontSize: '1rem',
                  cursor: 'pointer', padding: '0.5rem 0', fontWeight: '500'
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                {selectedActivity ? 'กลับไปที่รายการกิจกรรม' : 'กลับไปเลือกกลุ่มงาน'}
              </button>
              <div style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '0.5rem' }}>
                หน้าหลัก {selectedDept && `→ ${currentDept?.name}`} {selectedActivity && `→ ${currentActivity?.name}`}
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {/* MAIN CONTENT */}
      <section className="section-full" style={{ paddingTop: '3rem' }}>
        <div className="container" style={{ maxWidth: '1400px' }}>

          {/* DEPARTMENT SELECTION */}
          {!selectedDept && (
            <FadeIn delay={0.2}>
              <div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', color: 'var(--primary-navy)' }}>
                  เลือกกลุ่มงานเพื่อเริ่มสำรวจ
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {ropaData.map((dept, index) => (
                    <FadeIn key={dept.id} delay={0.1 * (index + 1)}>
                      <button
                        onClick={() => setSelectedDept(dept.id)}
                        style={{
                          backgroundColor: 'white', border: `3px solid ${dept.color}`, borderRadius: '12px',
                          padding: '2rem 1.5rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s ease',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden', width: '100%'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                        }}
                      >
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', backgroundColor: dept.color }} />
                        <h4 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginBottom: '0.8rem', fontWeight: '600' }}>
                          {dept.name}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.95rem' }}>
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                          <span>{dept.activities.length} กิจกรรม</span>
                        </div>
                        <div style={{
                          position: 'absolute', bottom: '1.5rem', right: '1.5rem', width: '32px', height: '32px',
                          borderRadius: '50%', backgroundColor: dept.color, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: 'white'
                        }}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    </FadeIn>
                  ))}
                </div>

                {/* PDF Download CTA */}
                <div style={{ marginTop: '4rem', padding: '2rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <h4 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginBottom: '0.8rem' }}>ต้องการข้อมูล ROPA แบบเต็มรูปแบบ?</h4>
                  <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>ดาวน์โหลดเอกสาร PDF ที่มีรายละเอียดครบถ้วนทั้งหมด</p>
                  <a href={pdfFilePath} download style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem',
                    backgroundColor: 'var(--primary-navy)', color: 'white', textDecoration: 'none', borderRadius: '8px',
                    fontSize: '1rem', fontWeight: '500', transition: 'background 0.2s'
                  }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    ดาวน์โหลด PDF
                  </a>
                </div>
              </div>
            </FadeIn>
          )}

          {/* ACTIVITY LIST VIEW */}
          {selectedDept && !selectedActivity && (
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'start' }}>
              
              {/* FILTER SIDEBAR */}
              <FadeIn delay={0.2}>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--border-color)', position: 'sticky', top: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', margin: 0 }}>ตัวกรอง</h4>
                    <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>รีเซ็ต</button>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <input type="text" placeholder="ค้นหากิจกรรม..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '0.7rem', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.95rem' }} />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                      <input type="checkbox" checked={filters.hasSensitiveData} onChange={(e) => setFilters({...filters, hasSensitiveData: e.target.checked})} />
                      <span>มีข้อมูลอ่อนไหวเท่านั้น</span>
                    </label>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>ฐานกฎหมาย</label>
                    <select value={filters.lawfulBasis} onChange={(e) => setFilters({...filters, lawfulBasis: e.target.value})} style={{ width: '100%', padding: '0.7rem', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.95rem' }}>
                      <option value="all">ทั้งหมด</option>
                      <option value="มาตรา 24">มาตรา 24</option>
                      <option value="มาตรา 26">มาตรา 26</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.9rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>ระยะเวลาเก็บรักษา</label>
                    <select value={filters.retention} onChange={(e) => setFilters({...filters, retention: e.target.value})} style={{ width: '100%', padding: '0.7rem', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.95rem' }}>
                      <option value="all">ทั้งหมด</option>
                      <option value="short">{'< 1 ปี'}</option>
                      <option value="medium">1-5 ปี</option>
                      <option value="long">{'>5 ปี'}</option>
                    </select>
                  </div>

                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem', color: '#64748b' }}>
                    แสดง {filteredActivities.length} กิจกรรม
                  </div>
                </div>
              </FadeIn>

              {/* ACTIVITY CARDS */}
              <FadeIn delay={0.3}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'white', borderRadius: '12px', border: `3px solid ${currentDept?.color}` }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundColor: currentDept?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>📋</div>
                    <div>
                      <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-navy)', margin: 0 }}>{currentDept?.name}</h3>
                      <p style={{ color: '#64748b', margin: '0.3rem 0 0 0' }}>{currentDept?.activities.length} กิจกรรมทั้งหมด</p>
                    </div>
                  </div>

                  {filteredActivities.length === 0 ? (
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '3rem', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                      <svg width="48" height="48" fill="none" stroke="#cbd5e1" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem' }}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>ไม่พบกิจกรรมที่ตรงกับเงื่อนไขการค้นหา</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {filteredActivities.map((activity, index) => (
                        <FadeIn key={activity.id} delay={0.05 * index}>
                          <button
                            onClick={() => setSelectedActivity(activity.id)}
                            style={{
                              backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem',
                              cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.2s ease', display: 'flex',
                              justifyContent: 'space-between', alignItems: 'center', gap: '1rem'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = currentDept?.color; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
                          >
                            <div style={{ flex: 1 }}>
                              <h5 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)', marginBottom: '0.8rem', fontWeight: '600' }}>{activity.name}</h5>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {activity.sensitiveData && activity.sensitiveData.length > 0 && (
                                  <span style={{ padding: '0.3rem 0.7rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '500' }}>⚠️ มีข้อมูลอ่อนไหว</span>
                                )}
                                <span style={{ padding: '0.3rem 0.7rem', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '4px', fontSize: '0.85rem' }}>
                                  📜 {getCombinedBasis(activity)}
                                </span>
                                <span style={{ padding: '0.3rem 0.7rem', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '4px', fontSize: '0.85rem' }}>
                                  ⏳ {activity.retentionPeriodG1 || 'ไม่ระบุ'}
                                </span>
                              </div>
                            </div>
                            <svg width="24" height="24" fill="none" stroke={currentDept?.color} strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                          </button>
                        </FadeIn>
                      ))}
                    </div>
                  )}
                </div>
              </FadeIn>
            </div>
          )}

          {/* ACTIVITY DETAIL VIEW (DASHBOARD) */}
          {selectedActivity && currentActivity && (
            <FadeIn delay={0.2}>
              <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                
                {/* Header */}
                <div style={{ padding: '2.5rem', borderBottom: `4px solid ${currentDept?.color}`, background: `linear-gradient(135deg, ${currentDept?.color}15 0%, transparent 100%)` }}>
                  <div style={{ display: 'inline-block', padding: '0.4rem 1rem', backgroundColor: currentDept?.color, color: 'white', borderRadius: '20px', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '500' }}>
                    {currentDept?.name}
                  </div>
                  <h2 style={{ fontSize: '2rem', color: 'var(--primary-navy)', marginBottom: '0.5rem', lineHeight: '1.3' }}>{currentActivity.name}</h2>
                  <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>ผู้ควบคุมข้อมูล: {currentActivity.dataController || 'ไม่ระบุ'}</p>
                </div>

                <div style={{ padding: '2.5rem', display: 'grid', gap: '2.5rem' }}>
                  
                  {/* General & Sensitive Data */}
                  <div>
                    <h4 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '8px', height: '32px', backgroundColor: currentDept?.color, borderRadius: '4px' }} /> ข้อมูลที่จัดเก็บ
                    </h4>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                      <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                        <h5 style={{ fontSize: '1rem', color: '#475569', marginBottom: '1rem', fontWeight: '600' }}>📝 ข้อมูลทั่วไป</h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                          {(currentActivity.generalData || []).map((d, i) => <span key={i} style={{ padding: '0.5rem 1rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.95rem', color: '#1e293b' }}>{d}</span>)}
                        </div>
                      </div>
                      {currentActivity.sensitiveData && currentActivity.sensitiveData.length > 0 && (
                        <div style={{ padding: '1.5rem', backgroundColor: '#fef2f2', borderRadius: '10px', border: '2px solid #fecaca' }}>
                          <h5 style={{ fontSize: '1rem', color: '#dc2626', marginBottom: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>⚠️ ข้อมูลอ่อนไหว (Sensitive Data)</h5>
                          <p style={{ color: '#991b1b', fontWeight: '500', margin: 0 }}>{currentActivity.sensitiveData.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ padding: '1.5rem', backgroundColor: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                      <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>⚖️</div>
                      <h5 style={{ fontSize: '0.9rem', color: '#15803d', marginBottom: '0.5rem' }}>ฐานกฎหมาย</h5>
                      <p style={{ fontSize: '1.1rem', color: '#166534', fontWeight: '600', margin: 0 }}>{getCombinedBasis(currentActivity)}</p>
                    </div>
                    <div style={{ padding: '1.5rem', backgroundColor: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                      <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>⏳</div>
                      <h5 style={{ fontSize: '0.9rem', color: '#1e40af', marginBottom: '0.5rem' }}>ระยะเวลาจัดเก็บ (G1)</h5>
                      <p style={{ fontSize: '1.1rem', color: '#1e3a8a', fontWeight: '600', margin: 0 }}>{currentActivity.retentionPeriodG1 || '-'}</p>
                    </div>
                  </div>

                  {/* Trigger Full Modal */}
                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <button 
                      onClick={() => setModalData(currentActivity)}
                      style={{
                        padding: '1rem 3rem', backgroundColor: 'var(--primary-navy)', color: 'white',
                        border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '500',
                        cursor: 'pointer', transition: 'transform 0.2s, background 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      📄 ดูข้อมูล ROPA ฉบับเต็ม (A1 - I3)
                    </button>
                  </div>

                </div>
              </div>
            </FadeIn>
          )}

        </div>
      </section>

      {/* EXHAUSTIVE TECHNICAL MODAL */}
      {modalData && (
        <div onClick={() => setModalData(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', backdropFilter: 'blur(5px)' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#f8fafc', width: '100%', maxWidth: '900px', borderRadius: '16px', position: 'relative', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', padding: '1.5rem 2.5rem', borderBottom: '1px solid #e2e8f0', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-navy)', margin: '0 0 0.2rem 0' }}>{modalData.name}</h3>
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>รหัสข้อมูล: ROPA Full Detail View</span>
              </div>
              <button onClick={() => setModalData(null)} style={{ background: '#f1f5f9', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Controllers & Contacts */}
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#475569', fontSize: '1.1rem' }}>🏢 ผู้รับผิดชอบและติดต่อ</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
                  <div><strong style={{color: '#94a3b8'}}>ผู้ควบคุมข้อมูล:</strong><br/><span style={{color: '#1e293b'}}>{modalData.dataController || '-'}</span></div>
                  <div><strong style={{color: '#94a3b8'}}>DPO:</strong><br/><span style={{color: '#1e293b'}}>{modalData.dpo || '-'}</span></div>
                  <div style={{gridColumn: '1 / -1'}}><strong style={{color: '#94a3b8'}}>ข้อมูลติดต่อ:</strong><br/><span style={{color: '#1e293b'}}>{modalData.contactInfo?.address} | {modalData.contactInfo?.phone} | {modalData.contactInfo?.email}</span></div>
                </div>
              </div>

              {/* SECTION A & C: Source and Purpose */}
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#475569', fontSize: '1.1rem' }}>📌 A & C: ที่มาและวัตถุประสงค์</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
                  <div><strong style={{color: '#94a3b8'}}>ชื่อแบบฟอร์ม (A1):</strong><br/><span style={{color: '#1e293b'}}>{modalData.formNameA1 || '-'}</span></div>
                  <div><strong style={{color: '#94a3b8'}}>ที่มาการได้ข้อมูล (A2):</strong><br/><span style={{color: '#1e293b'}}>{modalData.dataSourceA2 || '-'}</span></div>
                  <div style={{gridColumn: '1 / -1'}}><strong style={{color: '#94a3b8'}}>วัตถุประสงค์ (C1):</strong><br/><span style={{color: '#1e293b'}}>{modalData.purposeOfCollectionC1 || '-'}</span></div>
                  <div><strong style={{color: '#94a3b8'}}>ผู้ใช้ข้อมูล (C2):</strong><br/><span style={{color: '#1e293b'}}>{modalData.dataUserC2 || '-'}</span></div>
                  <div><strong style={{color: '#94a3b8'}}>รูปแบบนำเข้า (C3) / สื่อ (C4):</strong><br/><span style={{color: '#1e293b'}}>{modalData.collectionSourceC3 || '-'} | {modalData.collectionMediumC4 || '-'}</span></div>
                </div>
              </div>

              {/* SECTION D: Storage */}
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#475569', fontSize: '1.1rem' }}>🗄️ D: สถานที่เก็บรวบรวม</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
                  <div><strong style={{color: '#94a3b8'}}>สถานที่กายภาพ (D1):</strong><br/><span style={{color: '#1e293b'}}>{modalData.physicalStorageD1 || '-'}</span></div>
                  <div><strong style={{color: '#94a3b8'}}>ทางอิเล็กทรอนิกส์ (D2):</strong><br/><span style={{color: '#1e293b'}}>{modalData.electronicStorageD2 || '-'}</span></div>
                </div>
              </div>

              {/* SECTION E & F: Usage and Disclosure */}
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#475569', fontSize: '1.1rem' }}>🤝 E & F: การใช้และเปิดเผย</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
                  <div><strong style={{color: '#94a3b8'}}>ฝ่ายอื่นที่ใช้ (E1):</strong><br/><span style={{color: '#1e293b'}}>{modalData.internalUsageE1 || '-'}</span></div>
                  <div><strong style={{color: '#94a3b8'}}>การเข้าถึง (E2):</strong><br/><span style={{color: '#1e293b'}}>{modalData.internalAccessE2 || '-'}</span></div>
                  <div><strong style={{color: '#94a3b8'}}>องค์กรที่เปิดเผย (F1):</strong><br/><span style={{color: '#1e293b'}}>{modalData.externalDisclosureF1 || '-'}</span></div>
                  <div><strong style={{color: '#94a3b8'}}>รูปแบบโอน (F2):</strong><br/><span style={{color: '#1e293b'}}>{modalData.transferModeF2 || '-'}</span></div>
                </div>
              </div>

              {/* SECTION G & H: Retention and Security */}
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#475569', fontSize: '1.1rem' }}>🛡️ G & H: ระยะเวลาและมาตรการ</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
                  <div><strong style={{color: '#94a3b8'}}>ระยะเวลา (G1):</strong><br/><span style={{color: '#1e293b'}}>{modalData.retentionPeriodG1 || '-'}</span></div>
                  <div><strong style={{color: '#94a3b8'}}>วิธีทำลาย (G2):</strong><br/><span style={{color: '#1e293b'}}>{modalData.disposalMethodG2 || '-'}</span></div>
                  <div style={{gridColumn: '1 / -1'}}><strong style={{color: '#94a3b8'}}>เชิงเทคนิค (H1):</strong><br/><span style={{color: '#1e293b'}}>{modalData.technicalMeasuresH1 || '-'}</span></div>
                  <div style={{gridColumn: '1 / -1'}}><strong style={{color: '#94a3b8'}}>เชิงองค์กร (H2):</strong><br/><span style={{color: '#1e293b'}}>{modalData.organizationalMeasuresH2 || '-'}</span></div>
                </div>
              </div>

              {/* SECTION I: Status */}
              <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '8px', border: '1px dashed #cbd5e1', fontSize: '0.85rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>สถานะ (I1):</strong> {modalData.activityStatusI1 || '-'}</span>
                <span><strong>อัปเดตล่าสุด (I2):</strong> {modalData.lastUpdateI2 || '-'}</span>
                <span><strong>การแก้ไข (I3):</strong> {modalData.revisionI3 || '-'}</span>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}