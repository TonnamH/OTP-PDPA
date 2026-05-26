// src/pages/Ropa.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import FadeIn from '../components/FadeIn';
import api from '../utils/api'; // <-- IMPORT THE NEW API TOOL
import '../css/Ropa.css';

// Reusable Professional Icon Component
const Icon = ({ name, className = '', size = 24, color = 'currentColor', strokeWidth = 2 }) => {
  const icons = {
    clipboard: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    text: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />,
    alert: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    scale: <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />,
    clock: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    database: <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />,
    share: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />,
    shield: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    download: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
    building: <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    folder_off: <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1m-5 14H5a2 2 0 01-2-2v-6a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2h-4" />
  };
  return <svg width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} viewBox="0 0 24 24" className={className}>{icons[name]}</svg>;
};

export default function Ropa() {
  const { t } = useTranslation();

  const [ropaData, setRopaData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA USING AXIOS API ---
  useEffect(() => {
    const fetchRopa = async () => {
      try {
        const response = await api.get('/ropa');
        setRopaData(response.data);
      } catch (err) {
        console.error("Failed to fetch ROPA data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRopa();
  }, []);

  const [selectedBureau, setSelectedBureau] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [filters, setFilters] = useState({ hasSensitiveData: false, lawfulBasis: 'all', retention: 'all' });
  const [searchQuery, setSearchQuery] = useState('');
  const [modalData, setModalData] = useState(null);

  const pdfFilePath = '/6.PDPA_ROPA_OTP-2568-10-30.pdf';

  // Read current hierarchy
  const currentBureau = ropaData.find(b => b.bureauId === selectedBureau);

  // --- SMART SORTING: Active sub-departments automatically float to the top! ---
  const sortedSubDepartments = useMemo(() => {
    if (!currentBureau?.subDepartments) return [];
    return [...currentBureau.subDepartments].sort((a, b) => {
      const aCount = a.activities?.length || 0;
      const bCount = b.activities?.length || 0;
      if (aCount > 0 && bCount === 0) return -1;
      if (aCount === 0 && bCount > 0) return 1;
      return 0;
    });
  }, [currentBureau]);

  const currentDept = currentBureau?.subDepartments?.find(d => d.id === selectedDept);
  const currentActivity = currentDept?.activities?.find(a => a.id === selectedActivity);

  // --- FILTER LOGIC ---
  const filteredActivities = useMemo(() => {
    if (!currentDept) return [];
    return currentDept.activities.filter(activity => {
      if (searchQuery && !(activity.name || '').toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filters.hasSensitiveData && (!activity.sensitiveData || activity.sensitiveData.length === 0)) return false;
      if (filters.lawfulBasis !== 'all') {
        const b24 = activity.lawfulBasis24 || activity.lawfulBasis || '';
        const b26 = activity.lawfulBasis26 || '';
        if (!b24.includes(filters.lawfulBasis) && !b26.includes(filters.lawfulBasis)) return false;
      }
      if (filters.retention !== 'all') {
        const retentionStr = activity.retentionPeriodG1 || activity.retention || '';
        const numberMatch = retentionStr.match(/\d+/);
        const years = numberMatch ? parseInt(numberMatch[0]) : 0;
        const isLifetime = retentionStr.includes('ตลอดชีพ') || retentionStr.includes('ตลอดอายุ');

        if (filters.retention === 'short' && (isLifetime || years > 1)) return false;
        if (filters.retention === 'medium' && (isLifetime || years <= 1 || years > 5)) return false;
        if (filters.retention === 'long' && (!isLifetime && years <= 5)) return false;
      }
      return true;
    });
  }, [currentDept, filters, searchQuery]);

  const exportToCSV = () => {
    const deptName = currentDept?.name || "Unknown";
    const headers = ["Department", "Activity Name", "Data Controller", "DPO", "General Data", "Sensitive Data", "Lawful Basis (24)", "Lawful Basis (26)", "Retention Period", "Storage Medium", "Data Disclosed To", "Security Measures"];

    const rows = filteredActivities.map(act => [
      deptName, act.name || "-", act.dataController || "-", act.dpo || "-",
      (act.generalData || []).join("; "), (act.sensitiveData || []).join("; "),
      act.lawfulBasis24 || act.lawfulBasis || "-", act.lawfulBasis26 || "-",
      act.retentionPeriodG1 || act.retention || "-", act.collectionMediumC4 || act.storageMedium || "-",
      act.externalDisclosureF1 || act.dataDisclosedTo || "-", act.technicalMeasuresH1 || act.securityMeasures || "-"
    ].map(val => `"${String(val).replace(/"/g, '""')}"`));

    const csvContent = [headers.map(h => `"${h}"`).join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ROPA_Export_${deptName}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const resetFilters = () => {
    setFilters({ hasSensitiveData: false, lawfulBasis: 'all', retention: 'all' });
    setSearchQuery('');
  };

  const handleBack = () => {
    if (selectedActivity) setSelectedActivity(null);
    else if (selectedDept) { setSelectedDept(null); resetFilters(); }
    else if (selectedBureau) setSelectedBureau(null);
  };

  const getCombinedBasis = (act) => {
    const b24 = act?.lawfulBasis24 || act?.lawfulBasis || '';
    const b26 = act?.lawfulBasis26 || '';
    if (b24 && b26) return `${b24} / ${b26}`;
    return b24 || b26 || '-';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <p style={{ fontFamily: 'Prompt, sans-serif', color: 'var(--text-gray)' }}>กำลังโหลดข้อมูล ROPA...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '5rem' }}>

      {/* HERO SECTION */}
      <FadeIn delay={0.1}>
        <section className="ropa-hero">
          <div className="container">
            <div style={{ maxWidth: '800px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
                <Icon name="clipboard" size={18} color="rgba(255,255,255,0.6)" strokeWidth={1.8} />
                <span className="ropa-hero-badge">Record of Processing Activities</span>
              </div>
              <h1>{t('ropa.title', 'บันทึกกิจกรรมการประมวลผลข้อมูลส่วนบุคคล')}</h1>
              <p>{t('ropa.subtitle', 'สำรวจว่า สนข. เก็บข้อมูลอะไร ทำไม และอย่างไร — เพื่อความโปร่งใสและสิทธิของคุณ')}</p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* BREADCRUMB */}
      {(selectedBureau || selectedDept || selectedActivity) && (
        <FadeIn delay={0.15}>
          <div className="ropa-breadcrumb">
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={handleBack} className="ropa-back-btn">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                {selectedActivity ? t('ropa.backToActivities', 'กลับไปที่รายการกิจกรรม') : selectedDept ? t('ropa.backToDept', 'กลับไปเลือกกลุ่มงาน') : t('ropa.backToBureaus', 'กลับไปโครงสร้างหลัก')}
              </button>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                {t('ropa.home', 'หน้าหลัก')}
                {selectedBureau && ` → ${currentBureau?.bureauName}`}
                {selectedDept && ` → ${currentDept?.name}`}
                {selectedActivity && ` → ${currentActivity?.name}`}
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      <section className="section-full" style={{ paddingTop: '3rem' }}>
        <div className="container" style={{ maxWidth: '1400px' }}>

          {/* LEVEL 0: THE MASTER ORG CHART */}
          {!selectedBureau && (
            <FadeIn delay={0.2}>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--primary-navy)', marginBottom: '0.5rem', fontFamily: 'Prompt, sans-serif' }}>
                  โครงสร้างองค์กร สนข.
                </h3>
                <p style={{ color: '#64748b', fontSize: '1.1rem', fontFamily: 'Sarabun, sans-serif' }}>
                  คลิกที่สำนัก/กอง ที่มีสีเพื่อเข้าดูบันทึกกิจกรรม ROPA
                </p>

                <div style={{ overflowX: 'auto', padding: '3rem 1rem 1rem 1rem', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '1100px', width: '100%' }}>

                    {/* The Root Node */}
                    <div className="ropa-root-node">
                      สำนักงานนโยบายและแผนการขนส่งและจราจร (สนข.)
                    </div>
                    <div style={{ width: '4px', height: '45px', backgroundColor: '#94a3b8' }} />

                    {/* Check if database actually returned data */}
                    {ropaData.length > 0 ? (
                      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        
                        {/* Dynamic Horizontal Line connecting all nodes */}
                        <div style={{ 
                          position: 'absolute', top: 0, 
                          left: `calc(100% / (${ropaData.length} * 2))`, 
                          right: `calc(100% / (${ropaData.length} * 2))`, 
                          height: '4px', backgroundColor: '#94a3b8', borderRadius: '4px' 
                        }} />

                        {ropaData.map((bureau) => {
                          const hasData = bureau.hasData;
                          return (
                            <div key={bureau.bureauId} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', padding: '0 0.5rem' }}>
                              <div style={{ width: '4px', height: '25px', backgroundColor: '#94a3b8' }} />

                              <button
                                onClick={() => hasData && setSelectedBureau(bureau.bureauId)}
                                className={`bureau-card ${hasData ? 'has-data' : 'no-data'}`}
                              >
                                {/* Glowing Active Status Dot */}
                                {hasData && (
                                  <div className="bureau-status-pulse">
                                    <span className="ping"></span>
                                    <span className="dot"></span>
                                  </div>
                                )}

                                <Icon name="building" size={28} color={hasData ? '#1d4ed8' : '#94a3b8'} className="mb-3" />
                                <span style={{ fontSize: '0.85rem', lineHeight: '1.4', fontWeight: hasData ? '700' : '500', color: hasData ? 'var(--primary-navy)' : '#64748b' }}>
                                  {bureau.bureauName}
                                </span>

                                <div style={{ marginTop: 'auto', paddingTop: '0.8rem', width: '100%' }}>
                                  {hasData ? (
                                    <span style={{ fontSize: '0.75rem', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '0.3rem 0.6rem', borderRadius: '20px', fontWeight: '600', border: '1px solid #bfdbfe' }}>
                                      {bureau.subDepartments?.length || 0} กลุ่มงาน
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                                      <Icon name="folder_off" size={14} /> ยังไม่มีข้อมูล
                                    </span>
                                  )}
                                </div>
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div style={{ padding: '3rem', color: '#94a3b8', fontFamily: 'Prompt, sans-serif' }}>
                        ไม่พบข้อมูลโครงสร้าง ROPA จากฐานข้อมูล
                      </div>
                    )}
                  </div>
                </div>

                {/* PDF Download CTA */}
                <div style={{ marginTop: '4rem', padding: '2.5rem', backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <h4 style={{ fontSize: '1.4rem', color: 'var(--primary-navy)', marginBottom: '0.8rem', fontFamily: 'Prompt, sans-serif' }}>{t('ropa.pdfCtaTitle', 'ต้องการข้อมูล ROPA แบบเต็มรูปแบบ?')}</h4>
                  <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '1.05rem' }}>{t('ropa.pdfCtaSub', 'ดาวน์โหลดเอกสาร PDF ที่มีรายละเอียดครบถ้วนทั้งหมด')}</p>
                  <a href={pdfFilePath} download style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.8rem', backgroundColor: 'var(--primary-navy)', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '1.05rem', fontWeight: '600', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)' }}>
                    <Icon name="download" size={20} />
                    {t('ropa.downloadPdf', 'ดาวน์โหลด PDF')}
                  </a>
                </div>
              </div>
            </FadeIn>
          )}

          {/* LEVEL 1: DEPARTMENT SELECTION */}
          {selectedBureau && !selectedDept && (
            <FadeIn delay={0.2}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                  <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '12px', color: '#1d4ed8' }}>
                    <Icon name="building" size={32} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--primary-navy)', fontFamily: 'Prompt, sans-serif' }}>{currentBureau?.bureauName}</h3>
                    <p style={{ color: '#64748b', margin: '0.3rem 0 0 0', fontSize: '1.1rem' }}>เลือกกลุ่มงาน/ฝ่าย เพื่อเข้าดูข้อมูล</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {sortedSubDepartments.map((dept, index) => {
                    const hasActs = dept.activities?.length > 0;

                    return (
                      <FadeIn key={dept.id} delay={0.05 * (index + 1)}>
                        <button
                          disabled={!hasActs}
                          onClick={() => setSelectedDept(dept.id)}
                          className={`dept-card ${hasActs ? 'has-acts' : 'no-acts'}`}
                          style={{ '--dept-color': dept.color || '#cbd5e1' }}
                        >
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', backgroundColor: hasActs ? (dept.color || '#cbd5e1') : '#cbd5e1' }} />
                          <h4 style={{ fontSize: '1.3rem', color: hasActs ? 'var(--primary-navy)' : '#64748b', marginBottom: '0.8rem', fontWeight: '600', fontFamily: 'Prompt, sans-serif' }}>
                            {dept.name}
                          </h4>

                          {hasActs ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.95rem' }}>
                              <Icon name="clipboard" size={16} />
                              <span>{t('ropa.totalActivities', '{{count}} กิจกรรม').replace('{{count}}', dept.activities.length)}</span>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.95rem' }}>
                              <Icon name="folder_off" size={16} />
                              <span>ยังไม่มีบันทึกกิจกรรม</span>
                            </div>
                          )}

                          <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: hasActs ? (dept.color || '#cbd5e1') : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: hasActs ? 'white' : '#94a3b8' }}>
                            {hasActs ? (
                              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                            ) : (
                              <Icon name="alert" size={16} />
                            )}
                          </div>
                        </button>
                      </FadeIn>
                    )
                  })}
                </div>
              </div>
            </FadeIn>
          )}

          {/* LEVEL 2: ACTIVITY LIST VIEW & FILTERS */}
          {selectedDept && !selectedActivity && (
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', alignItems: 'start' }}>
              
              {/* Left Sidebar Filters */}
              <FadeIn delay={0.2}>
                <div className="ropa-filter-sidebar">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-navy)', margin: 0, fontFamily: 'Prompt, sans-serif' }}>{t('ropa.filter.title', 'ตัวกรอง')}</h4>
                    <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline', fontWeight: '500' }}>{t('ropa.filter.reset', 'รีเซ็ต')}</button>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <input 
                      type="text" 
                      placeholder={t('ropa.filter.search', 'ค้นหากิจกรรม...')} 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      className="ropa-input"
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.95rem', color: '#475569' }}>
                      <input 
                        type="checkbox" 
                        checked={filters.hasSensitiveData} 
                        onChange={(e) => setFilters({ ...filters, hasSensitiveData: e.target.checked })} 
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span>{t('ropa.filter.hasSensitive', 'มีข้อมูลอ่อนไหวเท่านั้น')}</span>
                    </label>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: '#64748b', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t('ropa.filter.basis', 'ฐานกฎหมาย')}</label>
                    <select value={filters.lawfulBasis} onChange={(e) => setFilters({ ...filters, lawfulBasis: e.target.value })} className="ropa-input">
                      <option value="all">{t('ropa.filter.all', 'ทั้งหมด')}</option>
                      <option value="มาตรา 24">มาตรา 24</option>
                      <option value="มาตรา 26">มาตรา 26</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: '#64748b', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t('ropa.filter.retention', 'ระยะเวลาเก็บรักษา')}</label>
                    <select value={filters.retention} onChange={(e) => setFilters({ ...filters, retention: e.target.value })} className="ropa-input">
                      <option value="all">{t('ropa.filter.all', 'ทั้งหมด')}</option>
                      <option value="short">{t('ropa.filter.short', '< 1 ปี')}</option>
                      <option value="medium">{t('ropa.filter.medium', '1-5 ปี')}</option>
                      <option value="long">{t('ropa.filter.long', '> 5 ปี')}</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <button
                      onClick={exportToCSV} disabled={filteredActivities.length === 0}
                      style={{ 
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
                        padding: '0.8rem', backgroundColor: 'white', color: 'var(--primary-navy)', border: '1px solid var(--primary-navy)', 
                        borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', 
                        cursor: filteredActivities.length === 0 ? 'not-allowed' : 'pointer', 
                        opacity: filteredActivities.length === 0 ? 0.5 : 1, transition: 'all 0.2s' 
                      }}
                      onMouseEnter={(e) => { if (filteredActivities.length > 0) e.currentTarget.style.backgroundColor = '#eff6ff' }}
                      onMouseLeave={(e) => { if (filteredActivities.length > 0) e.currentTarget.style.backgroundColor = 'white' }}
                    >
                      <Icon name="download" size={18} />
                      {t('ropa.filter.exportCsv', 'Export to CSV')}
                    </button>
                  </div>

                  <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
                    {t('ropa.filter.showing', 'แสดง {{count}} กิจกรรม').replace('{{count}}', filteredActivities.length)}
                  </div>
                </div>
              </FadeIn>

              {/* Right Side: Activity List */}
              <FadeIn delay={0.3}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'white', borderRadius: '12px', border: `3px solid ${currentDept?.color}`, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundColor: currentDept?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                      <Icon name="clipboard" size={32} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.6rem', color: 'var(--primary-navy)', margin: 0, fontFamily: 'Prompt, sans-serif' }}>{currentDept?.name}</h3>
                      <p style={{ color: '#64748b', margin: '0.3rem 0 0 0', fontSize: '1.05rem' }}>{t('ropa.totalActivities', '{{count}} กิจกรรม').replace('{{count}}', currentDept?.activities?.length || 0)}</p>
                    </div>
                  </div>

                  {filteredActivities.length === 0 ? (
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '4rem 2rem', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                      <Icon name="alert" size={48} color="#cbd5e1" className="mx-auto mb-4" />
                      <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>{t('ropa.filter.notFound', 'ไม่พบกิจกรรมที่ตรงกับเงื่อนไขการค้นหา')}</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {filteredActivities.map((activity, index) => (
                        <FadeIn key={activity.id} delay={0.05 * index}>
                          <button 
                            onClick={() => setSelectedActivity(activity.id)} 
                            className="activity-card"
                            style={{ '--dept-color': currentDept?.color }}
                          >
                            <div style={{ flex: 1 }}>
                              <h5 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)', marginBottom: '0.8rem', fontWeight: '600', fontFamily: 'Prompt, sans-serif' }}>{activity.name}</h5>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                {activity.sensitiveData && activity.sensitiveData.length > 0 && (
                                  <span style={{ padding: '0.3rem 0.8rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Icon name="alert" size={14} /> {t('ropa.details.hasSensitiveTag', 'มีข้อมูลอ่อนไหว')}
                                  </span>
                                )}
                                <span style={{ padding: '0.3rem 0.8rem', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '500' }}>
                                  <Icon name="scale" size={14} /> {getCombinedBasis(activity)}
                                </span>
                                <span style={{ padding: '0.3rem 0.8rem', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '500' }}>
                                  <Icon name="clock" size={14} /> {activity.retentionPeriodG1 || activity.retention || '-'}
                                </span>
                              </div>
                            </div>
                            <svg width="24" height="24" fill="none" stroke={currentDept?.color} strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                          </button>
                        </FadeIn>
                      ))}
                    </div>
                  )}
                </div>
              </FadeIn>
            </div>
          )}

          {/* LEVEL 3: ACTIVITY DETAIL DASHBOARD (MODAL) */}
          {selectedActivity && currentActivity && (
            <div className="ropa-modal-overlay" onClick={() => setSelectedActivity(null)}>
              <div className="ropa-modal-content" onClick={(e) => e.stopPropagation()}>
                
                <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', padding: '1.5rem 2.5rem', borderBottom: `4px solid ${currentDept?.color}`, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'inline-block', padding: '0.3rem 0.8rem', backgroundColor: currentDept?.color, color: 'white', borderRadius: '20px', fontSize: '0.85rem', marginBottom: '0.8rem', fontWeight: '600' }}>
                      {currentDept?.name}
                    </div>
                    <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-navy)', margin: '0 0 0.5rem 0', fontFamily: 'Prompt, sans-serif' }}>{currentActivity.name}</h2>
                    <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>{t('ropa.details.controller', 'ผู้ควบคุมข้อมูล')}: {currentActivity.dataController || '-'}</p>
                  </div>
                  <button onClick={() => setSelectedActivity(null)} style={{ background: '#f1f5f9', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}>×</button>
                </div>

                <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  <div style={{ backgroundColor: 'white', padding: '1.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <h4 style={{ margin: '0 0 1.2rem 0', color: '#475569', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Prompt, sans-serif' }}><Icon name="clipboard" size={20} /> ผู้รับผิดชอบและติดต่อ</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', fontSize: '0.95rem' }}>
                      <div><strong style={{ color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>ผู้ควบคุมข้อมูล:</strong><span style={{ color: '#1e293b', fontWeight: '500' }}>{currentActivity.dataController || '-'}</span></div>
                      <div><strong style={{ color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>DPO:</strong><span style={{ color: '#1e293b', fontWeight: '500' }}>{currentActivity.dpo || '-'}</span></div>
                      <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>ข้อมูลติดต่อ:</strong><span style={{ color: '#1e293b', fontWeight: '500' }}>{currentActivity.contactInfo?.address || '-'} | {currentActivity.contactInfo?.phone || '-'} | {currentActivity.contactInfo?.email || '-'}</span></div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ padding: '1.8rem', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                      <div style={{ marginBottom: '1rem', color: '#16a34a' }}><Icon name="scale" size={32} /></div>
                      <h5 style={{ fontSize: '0.9rem', color: '#15803d', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('ropa.details.basis', 'ฐานกฎหมาย')}</h5>
                      <p style={{ fontSize: '1.15rem', color: '#166534', fontWeight: '600', margin: 0, fontFamily: 'Prompt, sans-serif' }}>{getCombinedBasis(currentActivity)}</p>
                    </div>
                    <div style={{ padding: '1.8rem', backgroundColor: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                      <div style={{ marginBottom: '1rem', color: '#2563eb' }}><Icon name="clock" size={32} /></div>
                      <h5 style={{ fontSize: '0.9rem', color: '#1e40af', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('ropa.details.retention', 'ระยะเวลาจัดเก็บ')}</h5>
                      <p style={{ fontSize: '1.15rem', color: '#1e3a8a', fontWeight: '600', margin: 0, fontFamily: 'Prompt, sans-serif' }}>{currentActivity.retentionPeriodG1 || currentActivity.retention || '-'}</p>
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'white', padding: '1.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <h4 style={{ margin: '0 0 1.2rem 0', color: '#475569', fontSize: '1.1rem', fontFamily: 'Prompt, sans-serif' }}>📌 A & C: ที่มาและวัตถุประสงค์</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', fontSize: '0.95rem' }}>
                      <div><strong style={{ color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>ชื่อแบบฟอร์ม (A1):</strong><span style={{ color: '#1e293b' }}>{currentActivity.formNameA1 || '-'}</span></div>
                      <div><strong style={{ color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>ที่มาการได้ข้อมูล (A2):</strong><span style={{ color: '#1e293b' }}>{currentActivity.dataSourceA2 || '-'}</span></div>
                      <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>วัตถุประสงค์ (C1):</strong><span style={{ color: '#1e293b' }}>{currentActivity.purposeOfCollectionC1 || '-'}</span></div>
                      <div><strong style={{ color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>ผู้ใช้ข้อมูล (C2):</strong><span style={{ color: '#1e293b' }}>{currentActivity.dataUserC2 || '-'}</span></div>
                      <div><strong style={{ color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>รูปแบบนำเข้า (C3) / สื่อ (C4):</strong><span style={{ color: '#1e293b' }}>{currentActivity.collectionSourceC3 || '-'} | {currentActivity.collectionMediumC4 || '-'}</span></div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: 'white', padding: '1.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <h4 style={{ margin: '0 0 1.2rem 0', color: '#475569', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Prompt, sans-serif' }}><Icon name="database" size={20} /> D: สถานที่เก็บรวบรวม</h4>
                      <div style={{ display: 'grid', gap: '1rem', fontSize: '0.95rem' }}>
                        <div><strong style={{ color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>สถานที่กายภาพ (D1):</strong><span style={{ color: '#1e293b' }}>{currentActivity.physicalStorageD1 || '-'}</span></div>
                        <div><strong style={{ color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>ทางอิเล็กทรอนิกส์ (D2):</strong><span style={{ color: '#1e293b' }}>{currentActivity.electronicStorageD2 || '-'}</span></div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'white', padding: '1.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <h4 style={{ margin: '0 0 1.2rem 0', color: '#475569', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Prompt, sans-serif' }}><Icon name="share" size={20} /> E & F: การใช้และเปิดเผย</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
                        <div><strong style={{ color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>ฝ่ายอื่นที่ใช้ (E1):</strong><span style={{ color: '#1e293b' }}>{currentActivity.internalUsageE1 || '-'}</span></div>
                        <div><strong style={{ color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>การเข้าถึง (E2):</strong><span style={{ color: '#1e293b' }}>{currentActivity.internalAccessE2 || '-'}</span></div>
                        <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>องค์กรที่เปิดเผย (F1):</strong><span style={{ color: '#1e293b' }}>{currentActivity.externalDisclosureF1 || currentActivity.dataDisclosedTo || '-'}</span></div>
                      </div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'white', padding: '1.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <h4 style={{ margin: '0 0 1.2rem 0', color: '#475569', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Prompt, sans-serif' }}><Icon name="shield" size={20} /> G & H: ระยะเวลาและมาตรการ</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', fontSize: '0.95rem' }}>
                      <div><strong style={{ color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>วิธีทำลาย (G2):</strong><span style={{ color: '#1e293b' }}>{currentActivity.disposalMethodG2 || '-'}</span></div>
                      <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>เชิงเทคนิค (H1):</strong><span style={{ color: '#1e293b' }}>{currentActivity.technicalMeasuresH1 || currentActivity.securityMeasures || '-'}</span></div>
                      <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>เชิงองค์กร (H2):</strong><span style={{ color: '#1e293b' }}>{currentActivity.organizationalMeasuresH2 || '-'}</span></div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#f1f5f9', padding: '1.2rem 1.5rem', borderRadius: '12px', border: '1px dashed #cbd5e1', fontSize: '0.85rem', color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between' }}>
                    <span><strong style={{ color: '#475569' }}>สถานะ (I1):</strong> {currentActivity.activityStatusI1 || '-'}</span>
                    <span><strong style={{ color: '#475569' }}>อัปเดตล่าสุด (I2):</strong> {currentActivity.lastUpdateI2 || '-'}</span>
                    <span><strong style={{ color: '#475569' }}>การแก้ไข (I3):</strong> {currentActivity.revisionI3 || '-'}</span>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}