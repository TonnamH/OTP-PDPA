// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FadeIn from '../components/FadeIn';
import '../css/Home.css';
import api from '../utils/api';
import Icon from '../components/Icon';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// --- Custom Animations (Injected for the Beep/Radar effects) ---
const customAnimations = `
  @keyframes buttonPulse {
    0% { box-shadow: 0 0 0 0 rgba(255, 145, 0, 0.7); }
    70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }
  @keyframes radarPing {
    0% { transform: scale(0.8); opacity: 0.8; }
    80% { transform: scale(2.5); opacity: 0; }
    100% { transform: scale(2.5); opacity: 0; }
  }
`;

// --- Hero SVG Illustration ---
const HeroIllustration = () => (
  <svg viewBox="0 0 480 420" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '460px', height: 'auto' }} aria-hidden="true">
    <circle cx="240" cy="210" r="180" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
    <circle cx="240" cy="210" r="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
    <path d="M240 60 L320 95 L320 175 C320 230 285 265 240 285 C195 265 160 230 160 175 L160 95 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
    <path d="M240 85 L305 115 L305 175 C305 220 275 250 240 267 C205 250 175 220 175 175 L175 115 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    <polyline points="215,175 232,195 268,155" stroke="rgba(255,255,255,0.9)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <g transform="translate(52, 130)">
      <rect width="96" height="60" rx="8" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <rect x="10" y="14" width="30" height="4" rx="2" fill="rgba(255,255,255,0.4)" />
      <rect x="10" y="24" width="50" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
      <rect x="10" y="32" width="40" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
      <rect x="10" y="42" width="22" height="8" rx="4" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
    </g>
    <g transform="translate(330, 100)">
      <rect width="100" height="64" rx="8" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <rect x="10" y="12" width="36" height="4" rx="2" fill="rgba(255,255,255,0.4)" />
      <rect x="10" y="22" width="55" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
      <rect x="10" y="30" width="42" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
      <rect x="10" y="42" width="6" height="10" rx="1" fill="rgba(255,255,255,0.25)" />
      <rect x="19" y="37" width="6" height="15" rx="1" fill="rgba(255,255,255,0.35)" />
      <rect x="28" y="44" width="6" height="8" rx="1" fill="rgba(255,255,255,0.2)" />
      <rect x="37" y="40" width="6" height="12" rx="1" fill="rgba(255,255,255,0.3)" />
    </g>
    <g transform="translate(156, 300)">
      <rect width="168" height="54" rx="8" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <circle cx="22" cy="27" r="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <path d="M18 27 l3 3 6-6" stroke="rgba(255,255,255,0.8)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="42" y="17" width="60" height="4" rx="2" fill="rgba(255,255,255,0.35)" />
      <rect x="42" y="27" width="90" height="3" rx="1.5" fill="rgba(255,255,255,0.18)" />
      <rect x="42" y="35" width="70" height="3" rx="1.5" fill="rgba(255,255,255,0.18)" />
    </g>
    <line x1="148" y1="168" x2="175" y2="168" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="305" y1="148" x2="330" y2="138" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="230" y1="285" x2="220" y2="300" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 4" />
    <circle cx="110" cy="260" r="3" fill="rgba(255,255,255,0.15)" />
    <circle cx="370" cy="240" r="3" fill="rgba(255,255,255,0.15)" />
    <circle cx="90" cy="100" r="2" fill="rgba(255,255,255,0.1)" />
    <circle cx="400" cy="300" r="2" fill="rgba(255,255,255,0.1)" />
    <circle cx="240" cy="50" r="2.5" fill="rgba(255,255,255,0.12)" />
  </svg>
);

// --- Main Component ---
export default function Home() {
  const { t } = useTranslation();
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [recentInfographics, setRecentInfographics] = useState([]);
  const [loadingUpdates, setLoadingUpdates] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // --- Drill-down States ---
  const [ropaData, setRopaData] = useState([]);
  const [ropaTableData, setRopaTableData] = useState([]);
  const [drillPath, setDrillPath] = useState([]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const [docsRes, infoRes, ropaRes] = await Promise.all([
          fetch('http://localhost:5000/api/documents'),
          fetch('http://localhost:5000/api/infographics'),
          fetch('http://localhost:5000/api/ropa')
        ]);

        if (docsRes.ok && infoRes.ok) {
          const docs = await docsRes.json();
          const infos = await infoRes.json();
          setLatestUpdates(docs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5));
          setRecentInfographics(infos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4));
        }

        if (ropaRes.ok) {
          const masterRopaData = await ropaRes.json();
          setRopaData(masterRopaData);

          let allActivities = [];
          masterRopaData.forEach(bureau => {
            if (bureau.subDepartments) {
              bureau.subDepartments.forEach(dept => {
                if (dept.activities) {
                  dept.activities.forEach(act => {
                    allActivities.push({
                      ...act,
                      bureauName: bureau.bureauName,
                      deptName: dept.name,
                      badgeColor: dept.color
                    });
                  });
                }
              });
            }
          });
          setRopaTableData(allActivities.slice(0, 5));
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoadingUpdates(false);
      }
    };

    fetchLatest();
  }, []);

  const quickLinks = [
    {
      icon: 'chart',
      title: t('home.quickLinks.ropa.title', 'ROPA บันทึกกิจกรรม'),
      desc: t('home.quickLinks.ropa.desc', 'ตรวจสอบว่า สนข. มีการประมวลผลข้อมูลส่วนบุคคลในกิจกรรมใดบ้าง'),
      to: '/about/ropa',
    },
    {
      icon: 'document',
      title: t('home.quickLinks.docs.title', 'เอกสารนโยบาย'),
      desc: t('home.quickLinks.docs.desc', 'ดาวน์โหลดแบบฟอร์ม คู่มือ และประกาศนโยบายความเป็นส่วนตัวต่างๆ'),
      to: '/about/documents',
    },
    {
      icon: 'users',
      title: t('home.quickLinks.dpo.title', 'ทีม DPO ของ สนข.'),
      desc: t('home.quickLinks.dpo.desc', 'รู้จักกับทีมเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล และช่องทางการติดต่อ'),
      to: '/about/dpo',
    },
  ];

  return (
    <div className="home-page">
      <style>{customAnimations}</style> {/* Injected Keyframes */}

      {/* 1. HERO SLIDESHOW */}
      <section style={{ width: '100%', position: 'relative' }}>
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          style={{ width: '100%', height: '500px' }}
        >
          <SwiperSlide>
            <div style={{ width: '100%', height: '100%', backgroundImage: 'url(/slideshow1.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div style={{ width: '100%', height: '100%', background: 'rgba(24, 35, 55, 0.4)' }} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div style={{ width: '100%', height: '100%', backgroundImage: 'url(/slideshow2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div style={{ width: '100%', height: '100%', background: 'rgba(24, 35, 55, 0.4)' }} />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div style={{ width: '100%', height: '100%', backgroundImage: 'url(/slideshow3.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div style={{ width: '100%', height: '100%', background: 'rgba(24, 35, 55, 0.4)' }} />
            </div>
          </SwiperSlide>
        </Swiper>

        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', zIndex: 10, pointerEvents: 'none' }}>
          <div className="container">
            {/* Expanded width here */}
            <div style={{ width: '100%', maxWidth: '900px', pointerEvents: 'auto' }}>
              <span className="hero-badge" style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: 'none' }}>
                <Icon name="shield" size={13} color="rgba(255,255,255,0.9)" strokeWidth={2} />
                {t('home.hero.badge', 'ศูนย์บัญชาการข้อมูลส่วนบุคคล')}
              </span>
              <h1 style={{ fontSize: '3rem', fontWeight: '700', color: '#ffffff', lineHeight: '1.2', marginBottom: '1.5rem', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                {t('home.hero.title', 'PDPA Portal ศูนย์กลางความรู้และการจัดการข้อมูลส่วนบุคคล สนข.')}
              </h1>
              <div className="hero-buttons">
                {/* Updated Button with Icon and Pulse Animation */}
                <Link
                  to="/contact/report"
                  className="btn"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                    backgroundColor: '#df9100', color: 'white', fontWeight: '600',
                    padding: '0.8rem 1.5rem', borderRadius: '8px', border: 'none',
                    animation: 'buttonPulse 2s infinite', textDecoration: 'none'
                  }}
                >
                  <Icon name="alert" size={18} strokeWidth={2.5} />
                  {t('home.hero.reportBtn', 'แจ้งเหตุละเมิดข้อมูล')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATUS BAR (Sleek Grey with Radar Ping) */}
      <FadeIn delay={0.1}>
        <div style={{
          backgroundColor: '#3d3d3d', borderBottom: '1px solid #e2e8f0', color: '#ffffff',
          padding: '0.8rem 1rem', textAlign: 'center', fontSize: '0.95rem', fontWeight: '500',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem'
        }}>
          {/* Radar Ping Dot */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px' }}>
            <span style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#10b981', borderRadius: '50%', opacity: 0.7, animation: 'radarPing 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
            <span style={{ position: 'relative', width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></span>
          </div>
          <span>สถานะการละเมิดข้อมูลส่วนบุคคล: <strong style={{ color: '#10b981' }}>0 เหตุการณ์</strong> (ระบบปกป้องข้อมูลของ สนข. ทำงานปกติ)</span>
        </div>
      </FadeIn>

      <section className="section-full bg-light" style={{ padding: '3rem 0 2rem' }}>
        <div className="container">
          <div className="split-layout">
            <FadeIn delay={0.15}>
              <div className="split-text">
                <div style={{ display: 'flex', alignItems: 'stretch', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '6px', backgroundColor: '#4f46e5', borderRadius: '4px' }}></div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span className="section-label" style={{ marginBottom: '0.3rem', display: 'block' }}>{t('home.pdpa1min.label', 'PDPA คืออะไร')}</span>
                    <h2 className="section-title" style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t('home.pdpa1min.title', 'กฎหมายที่คืนสิทธิ<br />ข้อมูลให้คุณ').replace('คืนสิทธิ', 'คืนสิทธิ<br />') }} />
                  </div>
                </div>
                <p>
                  {t('home.pdpa1min.desc', 'พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) มอบสิทธิให้คุณเป็นเจ้าของข้อมูลของตัวเองอย่างแท้จริง สนข. มีหน้าที่ดูแลข้อมูลของคุณให้ปลอดภัย และใช้เท่าที่จำเป็นเท่านั้น')}
                </p>
                <ul className="check-list">
                  {[
                    t('home.pdpa1min.check1', 'ข้อมูลต้องถูกเก็บอย่างปลอดภัยสูงสุด'),
                    t('home.pdpa1min.check2', 'นำไปใช้ตามวัตถุประสงค์ที่แจ้งไว้เท่านั้น'),
                    t('home.pdpa1min.check3', 'คุณมีสิทธิขอดู แก้ไข หรือลบข้อมูลได้'),
                  ].map((text, i) => (
                    <li key={i}>
                      <span className="check-icon"><Icon name="check" size={11} color="#15803d" strokeWidth={2.5} /></span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="video-wrapper">
                <iframe
                  width="100%" height="100%"
                  src="https://www.youtube-nocookie.com/embed/OnesP7KPpfM?rel=0"
                  title="PDPA Introduction Video" frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ROPA DASHBOARD SECTION (3-Level Clean Drilldown) */}
      <section style={{ padding: '0.7rem 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <FadeIn delay={0.2}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', padding: '2rem' }}>

              {/* Header & Clickable Breadcrumbs */}
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                  <div style={{ width: '5px', height: '26px', backgroundColor: '#4f46e5', borderRadius: '4px' }}></div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: 0, fontFamily: 'Prompt' }}>
                    {t('home.ropaDashboard.pieChartTitle', 'สัดส่วน ROPA ตามโครงสร้างหน่วยงาน')}
                  </h3>
                </div>

                <div style={{ width: '100%', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.9rem', fontFamily: 'Prompt', color: '#64748b', background: '#f8fafc', padding: '0.6rem 1rem', borderRadius: '8px' }}>
                  <span onClick={() => setDrillPath([])} style={{ cursor: 'pointer', color: drillPath.length === 0 ? '#1e293b' : '#4f46e5', fontWeight: drillPath.length === 0 ? '600' : '500', transition: 'color 0.2s' }}>
                    {t('home.ropaDashboard.pieChartOverview', 'ภาพรวมหน่วยงาน')}
                  </span>

                  {drillPath.length >= 1 && (
                    <>
                      <span>›</span>
                      <span onClick={() => setDrillPath([drillPath[0]])} style={{ cursor: drillPath.length > 1 ? 'pointer' : 'default', color: drillPath.length === 1 ? '#1e293b' : '#4f46e5', fontWeight: drillPath.length === 1 ? '600' : '500', transition: 'color 0.2s' }}>
                        {drillPath[0].bureauName}
                      </span>
                    </>
                  )}

                  {drillPath.length >= 2 && (
                    <>
                      <span>›</span>
                      <span style={{ color: '#1e293b', fontWeight: '600' }}>
                        {drillPath[1].name}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Chart & List Container */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'flex-start', justifyContent: 'center' }}>

                {ropaData && ropaData.length > 0 ? (
                  (() => {
                    // --- 3-LEVEL EXACT DATA PROCESSING LOGIC ---
                    let chartData = [];
                    let totalCount = 0;
                    let chartLabel = '';

                    // The new Pastel Blue-to-Purple gradient!
                    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#14b8a6'];
                    if (drillPath.length === 0) {
                      // LEVEL 1: Bureaus
                      chartLabel = t('home.ropaDashboard.pieChartOverview', 'กลุ่ม/ฝ่ายที่มีข้อมูล');
                      let rawData = ropaData.map(bureau => {
                        const activeDepts = bureau.subDepartments ? bureau.subDepartments.filter(dept => dept.activities && dept.activities.length > 0) : [];
                        return { name: bureau.bureauName, count: activeDepts.length, originalData: bureau };
                      }).filter(item => item.count > 0).sort((a, b) => b.count - a.count);

                      // Assign pastel color based on sorted index
                      chartData = rawData.map((item, idx) => ({ ...item, color: COLORS[idx % COLORS.length] }));
                      totalCount = chartData.reduce((sum, item) => sum + item.count, 0);

                    } else if (drillPath.length === 1) {
                      // LEVEL 2: Departments
                      chartLabel = t('home.ropaDashboard.pieChartDepartments', 'กิจกรรม ROPA');
                      const activeBureau = drillPath[0];
                      let rawData = activeBureau.subDepartments.map(dept => ({
                        name: dept.name, count: dept.activities ? dept.activities.length : 0, originalData: dept
                      })).filter(item => item.count > 0).sort((a, b) => b.count - a.count);

                      // Assign pastel color based on sorted index (ignoring backend colors)
                      chartData = rawData.map((item, idx) => ({ ...item, color: COLORS[idx % COLORS.length] }));
                      totalCount = chartData.reduce((sum, item) => sum + item.count, 0);

                    } else if (drillPath.length === 2) {
                      // LEVEL 3: Lawful Basis
                      chartLabel = t('home.ropaDashboard.pieChartDepartments', 'กิจกรรม ROPA');
                      const activeDept = drillPath[1];
                      const basisCounts = {};

                      if (activeDept.activities) {
                        activeDept.activities.forEach(act => {
                          let basis = 'ไม่ระบุฐาน';
                          if (act.lawfulBasis24 && act.lawfulBasis24 !== '-') basis = act.lawfulBasis24;
                          else if (act.lawfulBasis26 && act.lawfulBasis26 !== '-') basis = act.lawfulBasis26;
                          else if (act.lawfulBasis && act.lawfulBasis !== '-') basis = act.lawfulBasis;

                          if (basis.includes("ภารกิจของรัฐ")) basis = "ภารกิจของรัฐ";
                          if (basis.includes("ประโยชน์สาธารณะ")) basis = "ประโยชน์สาธารณะ";
                          if (basis.includes("กฎหมาย")) basis = "ปฏิบัติตามกฎหมาย";

                          basisCounts[basis] = (basisCounts[basis] || 0) + 1;
                        });
                      }

                      let rawData = Object.keys(basisCounts).map(basis => ({
                        name: basis, count: basisCounts[basis], originalData: null
                      })).sort((a, b) => b.count - a.count);

                      // Assign pastel color based on sorted index
                      chartData = rawData.map((item, idx) => ({ ...item, color: COLORS[idx % COLORS.length] }));
                      totalCount = activeDept.activities ? activeDept.activities.length : 0;
                    }

                    return (
                      <>
                        {/* LEFT SIDE: Dynamic Interactive Donut */}
                        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  // REMOUNT KEY: Forces smooth animation on click
                                  key={`pie-level-${drillPath.length}`}
                                  data={chartData}
                                  cx="50%" cy="50%" innerRadius={85} outerRadius={125} paddingAngle={2} dataKey="count"

                                  // SMOOTH ANIMATION PROPS
                                  isAnimationActive={true}
                                  animationBegin={0}
                                  animationDuration={800}
                                  animationEasing="ease-out"

                                  onClick={(entry) => {
                                    if (drillPath.length === 0) setDrillPath([entry.originalData]);
                                    else if (drillPath.length === 1) setDrillPath([drillPath[0], entry.originalData]);
                                  }}
                                  style={{ cursor: drillPath.length < 2 ? 'pointer' : 'default', outline: 'none' }}
                                >
                                  {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} style={{ transition: 'all 0.3s ease', outline: 'none' }} />
                                  ))}
                                </Pie>
                                <RechartsTooltip
                                  formatter={(value) => [
                                    `${value} ${drillPath.length === 0 ? 'กลุ่ม/ฝ่าย' : 'รายการ'}`,
                                    drillPath.length === 0 ? 'จำนวนกลุ่มงาน' : (drillPath.length === 2 ? 'สัดส่วนฐานทางกฎหมาย' : 'จำนวน ROPA')
                                  ]}
                                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontFamily: 'Prompt, sans-serif', fontWeight: '500' }}
                                />
                              </PieChart>
                            </ResponsiveContainer>

                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                              <span style={{ fontSize: '2.8rem', fontWeight: '700', color: '#1e293b', lineHeight: '1' }}>{totalCount}</span>
                              <span style={{ fontSize: '0.85rem', color: '#64748b', fontFamily: 'Prompt', marginTop: '0.4rem', fontWeight: '500' }}>{chartLabel}</span>
                            </div>
                          </div>

                          <div style={{ marginTop: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem', fontFamily: 'Prompt', fontWeight: '500' }}>
                            {drillPath.length === 0 && t('home.ropaDashboard.clickGraphToDrill', 'คลิกที่กราฟเพื่อดูรายสำนัก')}
                            {drillPath.length === 1 && t('home.ropaDashboard.clickGraphToDrillDept', 'คลิกที่กราฟเพื่อดูรายกลุ่ม/ฝ่าย')}
                            {drillPath.length === 2 && t('home.ropaDashboard.lawfulBasis', 'สัดส่วนฐานทางกฎหมาย')}
                          </div>
                        </div>

                        {/* RIGHT SIDE: Dynamic List Panel (Clean Simple List) */}
                        <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>

                          <FadeIn key={`list-level-${drillPath.length}`} delay={0.1}>
                            {drillPath.length < 2 ? (
                              /* LEVEL 1 & 2: Navigation Lists */
                              <>
                                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#64748b', margin: '0 0 0.5rem', fontFamily: 'Prompt', textTransform: 'uppercase' }}>
                                  {t('home.ropaDashboard.selectItem', 'เลือกรายการเพื่อเจาะลึกข้อมูล')}
                                </h4>
                                {chartData.map((item, idx) => (
                                  <div
                                    key={idx}
                                    onClick={() => {
                                      if (drillPath.length === 0) setDrillPath([item.originalData]);
                                      else if (drillPath.length === 1) setDrillPath([drillPath[0], item.originalData]);
                                    }}
                                    style={{
                                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                      fontSize: '0.95rem', fontFamily: 'Prompt', padding: '0.8rem 1rem', borderRadius: '8px',
                                      backgroundColor: '#ffffff', border: '1px solid #e2e8f0', marginBottom: '0.8rem',
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.2s ease', cursor: 'pointer'
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateX(0)'; }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }}></div>
                                      <span style={{ color: '#1e293b', fontWeight: '600', lineHeight: '1.3' }}>{item.name}</span>
                                    </div>
                                    <div style={{ color: '#1e293b', fontWeight: '700', marginLeft: '1rem', fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
                                      {item.count} {drillPath.length === 0 && <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>กลุ่มงาน</span>}
                                      {drillPath.length === 1 && <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>รายการ</span>}
                                    </div>
                                  </div>
                                ))}
                              </>
                            ) : (
                              /* LEVEL 3: Final Detail Level (Clean Activity List) */
                              <>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', margin: '0 0 0.5rem', fontFamily: 'Prompt', lineHeight: '1.4' }}>
                                  {t('home.ropaDashboard.allActivities', 'กิจกรรมทั้งหมดในกลุ่ม/ฝ่าย')}
                                  <br /><span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>{drillPath[1].name}</span>
                                </h4>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                  {drillPath[1].activities && drillPath[1].activities.length > 0 ? (
                                    drillPath[1].activities.map((act, actIdx) => (
                                      <div key={actIdx} style={{ background: '#ffffff', padding: '1rem', borderRadius: '8px', borderLeft: `4px solid ${drillPath[1].color || '#4f46e5'}`, border: '1px solid #e2e8f0' }}>
                                        <div style={{ fontSize: '0.95rem', color: '#1e293b', fontWeight: '600', marginBottom: '0.4rem', lineHeight: '1.3' }}>{act.name}</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            <strong style={{ color: '#475569' }}>ฐานกฎหมาย:</strong> {act.lawfulBasis24 !== "-" ? act.lawfulBasis24 : (act.lawfulBasis26 !== "-" ? act.lawfulBasis26 : act.lawfulBasis || "ภารกิจของรัฐ")}
                                          </div>
                                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            <strong style={{ color: '#475569' }}>ผู้ควบคุมข้อมูล:</strong> {act.dataController || '-'}
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.9rem', fontFamily: 'Prompt' }}>ไม่มีข้อมูลกิจกรรม ROPA</div>
                                  )}
                                </div>
                              </>
                            )}
                          </FadeIn>
                        </div>
                      </>
                    );
                  })()
                ) : (
                  <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontFamily: 'Prompt' }}>
                    {t('home.ropaDashboard.loading', 'กำลังโหลดข้อมูล ROPA...')}
                  </div>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ROPA PREVIEW TABLE */}
      <section style={{ padding: '1rem 0 2rem', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <FadeIn delay={0.3}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>

              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'stretch', gap: '1rem' }}>
                  <div style={{ width: '5px', backgroundColor: '#8b5cf6', borderRadius: '4px' }}></div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: '0 0 0.3rem', fontFamily: 'Prompt' }}>
                      {t('home.ropaTable.title', 'บันทึกกิจกรรมล่าสุด (ROPA)')}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, fontFamily: 'Prompt' }}>
                      {t('home.ropaTable.subtitle', 'ตัวอย่างรายการประมวลผลข้อมูลส่วนบุคคลล่าสุดภายในหน่วยงาน')}
                    </p>
                  </div>
                </div>
                <Link to="/about/ropa" className="btn" style={{ background: '#f1f5f9', color: 'var(--primary-navy)', fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                  {t('home.ropaTable.viewAll', 'ดูทั้งหมด')} →
                </Link>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                  <thead style={{ background: '#f8fafc', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <tr>
                      <th style={{ padding: '1rem 2rem', fontWeight: '600' }}>{t('home.ropaTable.colName', 'ชื่อกิจกรรม / โครงการ')}</th>
                      <th style={{ padding: '1rem 2rem', fontWeight: '600' }}>{t('home.ropaTable.colBasis', 'ฐานทางกฎหมาย (Lawful Basis)')}</th>
                      <th style={{ padding: '1rem 2rem', fontWeight: '600' }}>{t('home.ropaTable.colDept', 'หน่วยงาน')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ropaTableData.length > 0 ? (
                      ropaTableData.map((ropa, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <td style={{ padding: '1.2rem 2rem', color: '#1e293b', fontWeight: '500' }}>
                            {ropa.name}
                          </td>
                          <td style={{ padding: '1.2rem 2rem', color: '#64748b' }}>
                            <span style={{ background: '#f1f5f9', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>
                              {ropa.lawfulBasis24 !== "-" ? ropa.lawfulBasis24 : (ropa.lawfulBasis26 !== "-" ? ropa.lawfulBasis26 : "ฐานภารกิจของรัฐ (Public Task)")}
                            </span>
                          </td>
                          <td style={{ padding: '1.2rem 2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: ropa.badgeColor || '#64748b' }}></div>
                              <span style={{ color: '#475569', fontSize: '0.9rem' }}>{ropa.deptName}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                          {t('home.ropaTable.empty', 'ไม่มีข้อมูล ROPA ในขณะนี้')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. QUICK LINKS */}
      <section className="section-full bg-white" style={{ padding: '2.5rem 0' }}>
        <div className="container">
          <FadeIn delay={0.1}>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '6px', backgroundColor: '#3b82f6', borderRadius: '4px' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span className="section-label" style={{ marginBottom: '0.3rem', display: 'block' }}>{t('home.quickLinks.label', 'บริการ')}</span>
                <h2 className="section-title" style={{ margin: 0 }}>
                  {t('home.quickLinks.title', 'ข้อมูลและบริการสำคัญ')}
                </h2>
              </div>
            </div>
          </FadeIn>

          <div className="card-grid">
            {quickLinks.map((item, i) => (
              <FadeIn key={item.to} delay={0.1 * (i + 1)}>
                <div className="feature-card">
                  <div className="card-icon-wrap">
                    <Icon name={item.icon} size={22} color="var(--primary-navy)" strokeWidth={1.5} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <Link to={item.to} className="card-link">
                    {t('home.quickLinks.readMore', 'ดูรายละเอียด')}
                    <Icon name="arrow" size={15} color="var(--primary-navy)" strokeWidth={2} />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DYNAMIC INFOGRAPHICS PREVIEW GALLERY */}
      <section className="section-full bg-light" style={{ padding: '2.5rem 0' }}>
        <div className="container">
          <FadeIn delay={0.1}>
            <div className="updates-header" style={{ alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', alignItems: 'stretch', gap: '1rem' }}>
                <div style={{ width: '6px', backgroundColor: '#f43f5e', borderRadius: '4px' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span className="section-label" style={{ marginBottom: '0.3rem', display: 'block' }}>{t('home.infographicGallery.label', 'สื่อประชาสัมพันธ์')}</span>
                  <h2 className="section-title" style={{ margin: 0, lineHeight: '1.2' }}>
                    {t('home.infographicGallery.title', 'คลังภาพความรู้ PDPA')}
                  </h2>
                </div>
              </div>
              <Link to="/services/infographics" className="updates-link">
                {t('home.quickLinks.readMore', 'ดูทั้งหมด')}
                <Icon name="arrow" size={14} strokeWidth={2} />
              </Link>
            </div>
          </FadeIn>

          {loadingUpdates ? (
            <p className="empty-state">{t('home.updates.loading', 'กำลังโหลด...')}</p>
          ) : recentInfographics.length > 0 ? (
            <div className="info-gallery-grid">
              {recentInfographics.map((info, idx) => (
                <FadeIn key={info.id} delay={0.1 * idx}>
                  <div className="info-gallery-card" onClick={() => setSelectedImage(info)} style={{ cursor: 'pointer' }}>
                    <div className="info-gallery-img-wrapper">
                      <img src={`http://localhost:5000${info.image_path}`} alt={info.title} className="info-gallery-img" loading="lazy" />
                      <div className="info-gallery-overlay">
                        <Icon name="zoomIn" size={36} color="white" strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="info-gallery-content">
                      <span className="info-gallery-badge">{info.category || 'General'}</span>
                      <h4 className="info-gallery-title">{info.title}</h4>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          ) : (
            <p className="empty-state">{t('home.infographicGallery.empty', 'ไม่มีสื่อประชาสัมพันธ์ในขณะนี้')}</p>
          )}
        </div>
      </section>

      {/* 5. LATEST DOCUMENTS (Table Format) */}
      <section className="section-full bg-white" style={{ padding: '2.5rem 0' }}>
        <div className="container">
          <FadeIn delay={0.1}>
            <div className="updates-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', alignItems: 'stretch', gap: '1rem' }}>
                <div style={{ width: '6px', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span className="section-label" style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
                    {t('home.downloads.label', 'ดาวน์โหลด')}
                  </span>
                  <h2 className="section-title" style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b', fontFamily: 'Prompt', lineHeight: '1.2' }}>
                    {t('home.downloads.title', 'เอกสารและแบบฟอร์มล่าสุด')}
                  </h2>
                </div>
              </div>
              <Link to="/about/documents" className="btn" style={{ background: '#f1f5f9', color: 'var(--primary-navy)', fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                {t('home.downloads.viewAll', 'คลังเอกสารทั้งหมด')} →
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            {loadingUpdates ? (
              <p className="empty-state" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                {t('home.downloads.loading', 'กำลังโหลดเอกสาร...')}
              </p>
            ) : latestUpdates.length > 0 ? (
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                    <thead style={{ background: '#f8fafc', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <tr>
                        <th style={{ padding: '1rem 2rem', fontWeight: '600' }}>ชื่อเอกสาร</th>
                        <th style={{ padding: '1rem 2rem', fontWeight: '600' }}>หมวดหมู่</th>
                        <th style={{ padding: '1rem 2rem', fontWeight: '600' }}>วันที่เผยแพร่</th>
                        <th style={{ padding: '1rem 2rem', fontWeight: '600', textAlign: 'right' }}>ดาวน์โหลด</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestUpdates.map((item, idx) => {
                        const isPdf = item.file_path && item.file_path.endsWith('.pdf');
                        const fileUrl = item.file_path || item.image_path;

                        return (
                          <tr key={item.id || idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <td style={{ padding: '1.2rem 2rem', color: '#1e293b', fontWeight: '500' }}>{item.title}</td>
                            <td style={{ padding: '1.2rem 2rem' }}>
                              <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>{item.category}</span>
                            </td>
                            <td style={{ padding: '1.2rem 2rem', color: '#64748b', fontSize: '0.9rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Icon name="calendar" size={14} strokeWidth={1.8} />
                                {formatDate(item.created_at)}
                              </div>
                            </td>
                            <td style={{ padding: '1.2rem 2rem', textAlign: 'right' }}>
                              <a href={fileUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-navy)', fontWeight: '600', textDecoration: 'none', background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '8px', transition: 'all 0.2s', fontSize: '0.85rem' }} onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary-navy)'; e.currentTarget.style.color = 'white'; }} onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = 'var(--primary-navy)'; }}>
                                {isPdf ? 'PDF' : 'เปิดดู'}
                                <Icon name="download" size={14} strokeWidth={2} />
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="empty-state" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                {t('home.downloads.empty', 'ยังไม่มีเอกสารในขณะนี้')}
              </p>
            )}
          </FadeIn>
        </div>
      </section>

      {selectedImage && (
        <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
          <button className="lightbox-close" onClick={() => setSelectedImage(null)}>×</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={`http://localhost:5000${selectedImage.image_path}`} alt={selectedImage.title} />
            <p className="lightbox-title">{selectedImage.title}</p>
          </div>
        </div>
      )}

      {/* 6. QUICK CONTACT & MAP SECTION */}
      <section style={{ padding: '2rem 0 3rem', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <FadeIn delay={0.2}>
            <div style={{ display: 'flex', flexWrap: 'wrap', background: '#ffffff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>

              {/* LEFT SIDE: Contact Information */}
              <div style={{ flex: '1 1 450px', padding: '3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', padding: '0.4rem 1rem', background: '#ecfdf5', borderRadius: '50px', color: '#10b981', fontWeight: '600', fontSize: '0.85rem', fontFamily: 'Prompt' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                  {t('home.contact.badge', 'ช่องทางการติดต่อ')}
                </div>

                <div style={{ display: 'flex', alignItems: 'stretch', gap: '1rem', margin: '0 0 1.5rem' }}>
                  <div style={{ width: '6px', backgroundColor: '#4f46e5', borderRadius: '4px' }}></div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1e293b', margin: 0, fontFamily: 'Prompt', lineHeight: '1.3' }}>
                    {t('home.contact.title', 'ศูนย์บัญชาการข้อมูลส่วนบุคคล')} <br /><span style={{ color: '#4f46e5' }}>{t('home.contact.subtitle', '(PDPA OTP)')}</span>
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ color: '#64748b', marginTop: '0.2rem' }}>
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600', fontFamily: 'Prompt', marginBottom: '0.2rem' }}>{t('home.contact.addressLabel', 'ที่ตั้งสำนักงาน')}</div>
                      <div style={{ fontSize: '0.95rem', color: '#1e293b', fontFamily: 'Prompt', lineHeight: '1.5' }}>
                        {t('home.contact.addressLine1', 'สำนักงานนโยบายและแผนการขนส่งและจราจร (สนข.)')}<br />
                        {t('home.contact.addressLine2', '35 ถนนเพชรบุรี แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพฯ 10400')}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ color: '#64748b', marginTop: '0.2rem' }}>
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600', fontFamily: 'Prompt', marginBottom: '0.2rem' }}>{t('home.contact.phoneLabel', 'เบอร์โทรศัพท์')}</div>
                      <div style={{ fontSize: '1.05rem', color: '#1e293b', fontWeight: '600', fontFamily: 'Prompt' }}>{t('home.contact.phoneValue', '0 2215 1515 ต่อ 4081')}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ color: '#64748b', marginTop: '0.2rem' }}>
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600', fontFamily: 'Prompt', marginBottom: '0.2rem' }}>{t('home.contact.emailLabel', 'อีเมล')}</div>
                      <div style={{ fontSize: '1.05rem', color: '#1e293b', fontWeight: '600', fontFamily: 'Prompt' }}>{t('home.contact.emailValue', 'compliance@otp.go.th')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Interactive Map */}
              <div style={{ flex: '1 1 400px', minHeight: '350px', position: 'relative' }}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.353183639069!2d100.52247130000002!3d13.757562400000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29936222fb455%3A0x1a0d35f71b7ac2f5!2sOffice%20of%20Transport%20and%20Traffic%20Policy%20and%20Planning%20(OTP)!5e0!3m2!1sen!2sth!4v1781250030984!5m2!1sen!2sth" width="100%" height="100%" style={{ border: 0, position: 'absolute', top: 0, left: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="OTP Map Location"></iframe>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}