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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- Hero SVG Illustration ---
const HeroIllustration = () => (
  <svg
    viewBox="0 0 480 420"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', maxWidth: '460px', height: 'auto' }}
    aria-hidden="true"
  >
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
  const [ropaChartData, setRopaChartData] = useState([]);
  const [ropaTableData, setRopaTableData] = useState([]);

  // Translates full department names into standard short acronyms
  const getDeptAbbr = (name) => {
    const mapping = {
      'กลุ่มบริหารทรัพยากรบุคคล': 'บค.',
      'กลุ่มบริหารพัสดุ': 'พส.',
      'กลุ่มบริหารงานคลัง': 'กค.',
      'ฝ่ายนิติการ': 'นก.',
      'กลุ่มพัฒนาระบบบริหาร': 'กพร.',
      'ฝ่ายประชาสัมพันธ์และการสื่อสาร': 'ปชส.',
      'ฝ่ายบริหารงานทั่วไป สบก.': 'บท.',
      'ฝ่ายช่วยอํานวยการและประสานราชการ': 'ชอ.',
      'งานธุรการ': 'ธก.',
      'ฝ่ายนโยบายและแผนการจราจรทางบก': 'นผ.',
      'ฝ่ายพัฒนาระบบการจราจรทางบก': 'พร.',
      'กลุ่มโครงข่ายและการเชื่อมต่อการขนส่ง': 'คช.',
      'กลุ่มเทคโนโลยีการขนส่งและจราจร': 'ทท.',
      'กลุ่มขนส่งสาธารณะและสิ่งอํานวยความสะดวก': 'ขส.',
      'กลุ่มพัฒนาระบบคอมพิวเตอร์และเครือข่าย ศทท.': 'พค.',
      'กลุ่มนโยบายและบริหารสารสนเทศ': 'นส.',
      'กลุ่มพัฒนาระบบข้อมูลสารสนเทศ': 'พข.',
      'กลุ่มยุทธศาสตร์และแผนการขนส่งทางราง': 'ยผ.',
      'กลุ่มมาตรฐานระบบราง': 'มร.',
      'กลุ่มกํากับการขนส่งทางราง': 'กร.',
      'กลุ่มพัฒนาความปลอดภัย': 'พป.',
      'กลุ่มบริหารความมั่นคงด้านการขนส่ง': 'มค.',
      'กลุ่มส่งเสริมการขนส่งที่ยั่งยืน': 'สย.',
      'กลุ่มติดตามและประเมินผล': 'ตป.',
      'ฝ่ายบริหารงานทั่วไป': 'บท.',
      'กลุ่มแผนมหภาค': 'ผม.'
    };
    return mapping[name] || name.substring(0, 4);
  };

  // --- Download CSV Function ---
  const handleDownloadCSV = () => {
    if (ropaChartData.length === 0) return alert('ยังไม่มีข้อมูลสำหรับดาวน์โหลด');

    const headers = ['หน่วยงาน,จำนวน ROPA'];
    const rows = ropaChartData.map(item => `${item.department},${item.count}`);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ropa_statistics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          setLatestUpdates(docs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 2));
          setRecentInfographics(infos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4));
        }

        if (ropaRes.ok) {
          const masterRopaData = await ropaRes.json();

          let chartStats = [];
          let allActivities = [];

          // Loop through the nested structure
          masterRopaData.forEach(bureau => {
            bureau.subDepartments.forEach(dept => {

              // 1. Tag each activity for the PREVIEW TABLE
              dept.activities.forEach(act => {
                allActivities.push({
                  ...act,
                  bureauName: bureau.bureauName,
                  deptName: dept.name,
                  badgeColor: dept.color
                });
              });

              // 2. Count ROPAs per DEPARTMENT for the CHART
              const deptCount = dept.activities.length;
              if (deptCount > 0) {
                // Strip out common prefixes to keep the graph labels clean
                let shortDeptName = getDeptAbbr(dept.name);
                chartStats.push({ department: shortDeptName, count: deptCount });
              }
            });
          });

          // Sort chart from highest to lowest
          setRopaChartData(chartStats.sort((a, b) => b.count - a.count));
          // Keep only the first 5 activities for the preview table
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

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

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

      {/* 1. HERO */}
      {/* <section className="hero-section">
        <div className="container hero-container">
          <FadeIn delay={0.1}>
            <div className="hero-content">
              <span className="hero-badge">
                <Icon name="shield" size={13} color="rgba(255,255,255,0.8)" strokeWidth={2} />
                {t('home.hero.badge', 'ศูนย์บัญชาการข้อมูลส่วนบุคคล')}
              </span>
              <h1 className="hero-title">
                {t('home.hero.title', 'PDPA Portal ศูนย์กลางความรู้และการจัดการข้อมูลส่วนบุคคล สนข.')}
              </h1>
              <p className="hero-subtitle">
                {t('home.hero.subtitle', 'โปร่งใส ปลอดภัย และให้ความสำคัญกับสิทธิของคุณ ทำความเข้าใจว่าสำนักงานนโยบายและแผนการขนส่งและจราจรปกป้องข้อมูลของคุณอย่างไร')}
              </p>
              <div className="hero-buttons">
                <Link to="/contact/report" className="btn btn-primary shadow-glow">
                  {t('home.hero.reportBtn', 'แจ้งเหตุละเมิดข้อมูล')}
                </Link>
                <Link to="/about/ropa" className="btn btn-secondary glass-effect">
                  {t('home.hero.learnMoreBtn', 'ดูบันทึกกิจกรรม ROPA')}
                  <Icon name="arrow" size={15} color="rgba(255,255,255,0.8)" strokeWidth={2} />
                </Link>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.35}>
            <div className="hero-image-wrapper">
              <HeroIllustration />
            </div>
          </FadeIn>
        </div>
      </section> */}
  
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
          {/* Slide 1 */}
          <SwiperSlide>
            <div style={{
              width: '100%', height: '100%',
              backgroundImage: 'url(/slide1.png)',
              backgroundSize: 'cover', backgroundPosition: 'center'
            }}>
              <div style={{ width: '100%', height: '100%', background: 'rgba(24, 35, 55, 0.4)' }} />
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <div style={{
              width: '100%', height: '100%',
              backgroundImage: 'url(/slide2.png)',
              backgroundSize: 'cover', backgroundPosition: 'center'
            }}>
              <div style={{ width: '100%', height: '100%', background: 'rgba(24, 35, 55, 0.4)' }} />
            </div>
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide>
            <div style={{
              width: '100%', height: '100%',
              backgroundImage: 'url(/otpslide4-1.jpg)',
              backgroundSize: 'cover', backgroundPosition: 'center'
            }}>
              <div style={{ width: '100%', height: '100%', background: 'rgba(24, 35, 55, 0.4)' }} />
            </div>
          </SwiperSlide>
        </Swiper>

        {/* Text Overlay (Stays static while images slide behind it) */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', zIndex: 10, pointerEvents: 'none' }}>
          <div className="container">
            <div style={{ maxWidth: '600px', pointerEvents: 'auto' }}>
              <span className="hero-badge" style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: 'none' }}>
                <Icon name="shield" size={13} color="rgba(255,255,255,0.9)" strokeWidth={2} />
                {t('home.hero.badge', 'ศูนย์บัญชาการข้อมูลส่วนบุคคล')}
              </span>
              <h1 style={{ fontSize: '3rem', fontWeight: '700', color: '#ffffff', lineHeight: '1.2', marginBottom: '1rem', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                {t('home.hero.title', 'PDPA Portal ศูนย์กลางความรู้และการจัดการข้อมูลส่วนบุคคล สนข.')}
              </h1>
              <div className="hero-buttons">
                <Link to="/contact/report" className="btn btn-primary shadow-glow">
                  {t('home.hero.reportBtn', 'แจ้งเหตุละเมิดข้อมูล')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FadeIn delay={0.1}>
        <div style={{
          backgroundColor: '#10b981', /* A reassuring, vibrant success green */
          color: 'white',
          padding: '0.8rem 1rem',
          textAlign: 'center',
          fontSize: '0.95rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <Icon name="shield" size={18} color="white" strokeWidth={2} />
          <span>สถานะการละเมิดข้อมูลส่วนบุคคล: <strong>0 เหตุการณ์</strong> (ระบบปกป้องข้อมูลของ สนข. ทำงานปกติ)</span>
        </div>
      </FadeIn>

      <section className="section-full bg-light">
        <div className="container">
          <div className="split-layout">
            <FadeIn delay={0.15}>
              <div className="split-text">
                <span className="section-label">{t('home.pdpa1min.label', 'PDPA คืออะไร')}</span>
                <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('home.pdpa1min.title', 'กฎหมายที่คืนสิทธิ<br />ข้อมูลให้คุณ').replace('คืนสิทธิ', 'คืนสิทธิ<br />') }} />
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
                      <span className="check-icon">
                        <Icon name="check" size={11} color="#15803d" strokeWidth={2.5} />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              {/* You may want to rename 'video-wrapper' to 'image-wrapper' in your CSS if it has iframe-specific styling */}
              <div className="video-wrapper">
                <img
                  src="slide3.png"
                  alt="PDPA Video Placeholder"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '12px',
                    display: 'block',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                  }}
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ROPA DASHBOARD SECTION (TTIC Style) */}
      <section style={{ padding: '3rem 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <FadeIn delay={0.2}>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>

              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                  จำนวน ROPA ต่อกลุ่ม/ฝ่าย
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{ border: 'none', cursor: 'pointer', fontSize: '0.75rem', padding: '0.4rem 0.8rem', background: '#f1f5f9', color: '#64748b', borderRadius: '6px', fontWeight: '500', fontFamily: 'Prompt' }}>
                    ใช้งาน
                  </button>
                  <button
                    onClick={handleDownloadCSV}
                    style={{ border: 'none', cursor: 'pointer', fontSize: '0.75rem', padding: '0.4rem 0.8rem', background: '#8b5cf6', color: '#ffffff', borderRadius: '6px', fontWeight: '500', fontFamily: 'Prompt', transition: 'opacity 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = 0.8}
                    onMouseOut={(e) => e.currentTarget.style.opacity = 1}
                  >
                    CSV
                  </button>
                </div>
              </div>

              {/* The Graph OR Loading State */}
              <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                
                {/* LEFT SIDE: Bar Chart (Takes up 65% of the space) */}
                <div style={{ flex: '1 1 60%', minWidth: '350px' }}>
                  {ropaChartData && ropaChartData.length > 0 ? (
                    <div style={{ display: 'flex', width: '100%', height: '400px', position: 'relative' }}>
                      
                      {/* Y-Axis Labels Column */}
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-end', 
                        paddingRight: '12px', 
                        height: '100%', 
                        color: '#64748b', 
                        fontSize: '0.85rem', 
                        fontWeight: '600',
                        fontFamily: 'Prompt',
                        userSelect: 'none',
                        width: '30px'
                      }}>
                        <span>20</span>
                        <span>15</span>
                        <span>10</span>
                        <span>5</span>
                        <span>0</span>
                      </div>

                      {/* Main Chart Area */}
                      <div style={{ flex: 1, position: 'relative', height: '100%' }}>
                        
                        {/* Background Grid Lines (Aligned perfectly with Y-Axis) */}
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 0, pointerEvents: 'none' }}>
                          <div style={{ borderTop: '1px dashed #cbd5e1', width: '100%' }}></div> {/* 20 */}
                          <div style={{ borderTop: '1px dashed #e2e8f0', width: '100%' }}></div> {/* 15 */}
                          <div style={{ borderTop: '1px dashed #e2e8f0', width: '100%' }}></div> {/* 10 */}
                          <div style={{ borderTop: '1px dashed #e2e8f0', width: '100%' }}></div> {/* 5 */}
                          <div style={{ borderTop: '2px solid #cbd5e1', width: '100%' }}></div> {/* 0 (Base) */}
                        </div>

                        {/* The Bars Container */}
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', height: '100%', alignItems: 'flex-end', justifyContent: 'flex-start', gap: '1.5rem', paddingLeft: '1rem' }}>
                          {(() => {
                            // Scale height relative to a maximum of 20 units
                            const chartMax = 20;
                            
                            return ropaChartData.map((item, idx) => {
                              // Calculate height as a Percentage instead of Pixels
                              const barHeightPercent = Math.min((item.count / chartMax) * 100, 100); 
                              
                              return (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: '40px', height: '100%', justifyContent: 'flex-end' }}>
                                  
                                  {/* Count Number */}
                                  {item.count > 0 && (
                                    <span style={{ position: 'absolute', bottom: `${barHeightPercent}%`, marginBottom: '8px', fontSize: '0.95rem', color: '#1e293b', fontWeight: '700', fontFamily: 'Prompt' }}>
                                      {item.count}
                                    </span>
                                  )}
                                  
                                  {/* Gradient Bar */}
                                  <div style={{ 
                                    height: `${barHeightPercent}%`, 
                                    width: '100%', 
                                    background: 'linear-gradient(180deg, #818cf8 0%, #4f46e5 100%)',
                                    borderRadius: barHeightPercent > 2 ? '6px 6px 0 0' : '2px 2px 0 0',
                                    boxShadow: item.count > 0 ? '0 -4px 12px rgba(79, 70, 229, 0.25)' : 'none',
                                    transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                  }} />
                                  
                                  {/* Horizontal Acronym Text */}
                                  <span style={{ 
                                    position: 'absolute', top: '100%', marginTop: '12px',
                                    fontSize: '0.85rem', color: '#64748b', fontWeight: '600', fontFamily: 'Prompt',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {item.department}
                                  </span>
                                  
                                </div>
                              );
                            });
                          })()}
                        </div>

                      </div>
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontFamily: 'Prompt' }}>
                      กำลังโหลดข้อมูล...
                    </div>
                  )}
                </div>

                {/* RIGHT SIDE: Donut Chart (Takes up 35% of the space) */}
                <div style={{ flex: '1 1 30%', minWidth: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem 0' }}>
                  
                  {ropaChartData && ropaChartData.length > 0 ? (
                    (() => {
                      // 1. Process Data: Top 4 + Others to keep the chart clean
                      const totalCount = ropaChartData.reduce((sum, item) => sum + item.count, 0);
                      let pieData = [];
                      if (ropaChartData.length > 5) {
                        pieData = ropaChartData.slice(0, 4);
                        const othersCount = ropaChartData.slice(4).reduce((sum, item) => sum + item.count, 0);
                        pieData.push({ department: 'อื่นๆ', count: othersCount });
                      } else {
                        pieData = [...ropaChartData];
                      }

                      // 2. Premium TTIC Colors (Indigo, Sky, Emerald, Amber, Slate)
                      const colors = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#94a3b8'];
                      
                      // 3. Generate the CSS Conic Gradient string dynamically
                      let currentAngle = 0;
                      const conicStops = pieData.map((item, i) => {
                        const percentage = (item.count / totalCount) * 100;
                        const stop = `${colors[i % colors.length]} ${currentAngle}% ${currentAngle + percentage}%`;
                        currentAngle += percentage;
                        return stop;
                      }).join(', ');

                      return (
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 1rem' }}>
                          
                          {/* Title */}
                          <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#1e293b', marginBottom: '2rem', fontFamily: 'Prompt', width: '100%', textAlign: 'left' }}>
                            สัดส่วน ROPA (Top 5)
                          </h4>

                          {/* The Donut Chart Graphic */}
                          <div style={{ 
                            position: 'relative', width: '200px', height: '200px', borderRadius: '50%', 
                            background: `conic-gradient(${conicStops})`,
                            boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                            marginBottom: '2.5rem'
                          }}>
                            {/* The Inner Cutout (Makes it a Donut instead of a Pie) */}
                            <div style={{ 
                              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                              width: '130px', height: '130px', backgroundColor: '#ffffff', borderRadius: '50%', 
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.04)'
                            }}>
                              <span style={{ fontSize: '2.2rem', fontWeight: '700', color: '#1e293b', lineHeight: '1' }}>{totalCount}</span>
                              <span style={{ fontSize: '0.8rem', color: '#64748b', fontFamily: 'Prompt', marginTop: '0.3rem' }}>รายการทั้งหมด</span>
                            </div>
                          </div>

                          {/* The Legend / Details Table */}
                          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {pieData.map((item, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem', fontFamily: 'Prompt' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                  {/* Color Dot */}
                                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: colors[idx % colors.length] }}></div>
                                  <span style={{ color: '#475569', fontWeight: '500' }}>{item.department}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', color: '#1e293b', fontWeight: '600' }}>
                                  <span>{item.count}</span>
                                  {/* Percentage calculation */}
                                  <span style={{ color: '#94a3b8', width: '35px', textAlign: 'right', fontWeight: '500' }}>
                                    {Math.round((item.count / totalCount) * 100)}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                        </div>
                      );
                    })()
                  ) : (
                    <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontFamily: 'Prompt' }}>
                      กำลังคำนวณสัดส่วน...
                    </div>
                  )}
                </div>

              </div>

            </div>
          </FadeIn>
        </div>
      </section>

      {/* ROPA PREVIEW TABLE */}
      <section style={{ padding: '2rem 0 5rem', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <FadeIn delay={0.3}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>

              {/* Table Header Area */}
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: '0 0 0.3rem' }}>
                    {t('home.ropaTableTitle', 'บันทึกกิจกรรมล่าสุด (ROPA)')}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                    {t('home.ropaTableSub', 'ตัวอย่างรายการประมวลผลข้อมูลส่วนบุคคลล่าสุดภายในหน่วยงาน')}
                  </p>
                </div>
                <Link to="/about/ropa" className="btn" style={{ background: '#f1f5f9', color: 'var(--primary-navy)', fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                  {t('home.viewAll', 'ดูทั้งหมด')} &rarr;
                </Link>
              </div>

              {/* The Actual Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                  <thead style={{ background: '#f8fafc', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <tr>
                      <th style={{ padding: '1rem 2rem', fontWeight: '600' }}>ชื่อกิจกรรม / โครงการ</th>
                      <th style={{ padding: '1rem 2rem', fontWeight: '600' }}>ฐานทางกฎหมาย (Lawful Basis)</th>
                      <th style={{ padding: '1rem 2rem', fontWeight: '600' }}>หน่วยงาน</th>
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
                            {/* Shows Basis 24, falls back to 26, or shows standard text */}
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
                        <td colSpan="3" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>ไม่มีข้อมูล ROPA ในขณะนี้</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </FadeIn>
        </div>
      </section>



      {/* 2. PDPA IN 60 SECONDS */}
      {/* <section className="section-full bg-light">
        <div className="container">
          <div className="split-layout">
            <FadeIn delay={0.15}>
              <div className="split-text">
                <span className="section-label">{t('home.pdpa1min.label', 'PDPA คืออะไร')}</span>
                <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('home.pdpa1min.title', 'กฎหมายที่คืนสิทธิ<br />ข้อมูลให้คุณ').replace('คืนสิทธิ', 'คืนสิทธิ<br />') }} />
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
                      <span className="check-icon">
                        <Icon name="check" size={11} color="#15803d" strokeWidth={2.5} />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/n3WydT0L41w"
                  title="PDPA Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section> */}

      

      {/* 3. QUICK LINKS */}
      <section className="section-full bg-white">
        <div className="container">
          <FadeIn delay={0.1}>
            <div style={{ marginBottom: '3rem' }}>
              <span className="section-label">{t('home.quickLinks.label', 'บริการ')}</span>
              <h2 className="section-title">
                {t('home.quickLinks.title', 'ข้อมูลและบริการสำคัญ')}
              </h2>
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
      <section className="section-full bg-light">
        <div className="container">
          <FadeIn delay={0.1}>
            <div className="updates-header">
              <div>
                <span className="section-label">{t('home.infographicGallery.label', 'สื่อประชาสัมพันธ์')}</span>
                <h2 className="section-title" style={{ marginBottom: 0 }}>
                  {t('home.infographicGallery.title', 'คลังภาพความรู้ PDPA')}
                </h2>
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
                  <div
                    className="info-gallery-card"
                    onClick={() => setSelectedImage(info)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="info-gallery-img-wrapper">
                      <img
                        src={`http://localhost:5000${info.image_path}`}
                        alt={info.title}
                        className="info-gallery-img"
                        loading="lazy"
                      />
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
      <section className="section-full bg-white">
        <div className="container">
          <FadeIn delay={0.1}>
            <div className="updates-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <span className="section-label">{t('home.downloads.label', 'ดาวน์โหลด')}</span>
                <h2 className="section-title" style={{ marginBottom: 0 }}>{t('home.downloads.title', 'เอกสารและแบบฟอร์มล่าสุด')}</h2>
              </div>
              <Link to="/about/documents" className="btn" style={{ background: '#f1f5f9', color: 'var(--primary-navy)', fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                {t('home.downloads.viewAll', 'คลังเอกสารทั้งหมด')} &rarr;
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
                        // Use relative paths to avoid the localhost Nginx bug
                        const fileUrl = item.file_path || item.image_path; 

                        return (
                          <tr 
                            key={item.id || idx} 
                            style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} 
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} 
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <td style={{ padding: '1.2rem 2rem', color: '#1e293b', fontWeight: '500' }}>
                              {item.title}
                            </td>
                            <td style={{ padding: '1.2rem 2rem' }}>
                              <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>
                                {item.category}
                              </span>
                            </td>
                            <td style={{ padding: '1.2rem 2rem', color: '#64748b', fontSize: '0.9rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Icon name="calendar" size={14} strokeWidth={1.8} />
                                {formatDate(item.created_at)}
                              </div>
                            </td>
                            <td style={{ padding: '1.2rem 2rem', textAlign: 'right' }}>
                              <a 
                                href={fileUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                style={{ 
                                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem', 
                                  color: 'var(--primary-navy)', fontWeight: '600', textDecoration: 'none', 
                                  background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '8px', 
                                  transition: 'all 0.2s', fontSize: '0.85rem' 
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary-navy)'; e.currentTarget.style.color = 'white'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = 'var(--primary-navy)'; }}
                              >
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
          <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
            &times;
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={`http://localhost:5000${selectedImage.image_path}`}
              alt={selectedImage.title}
            />
            <p className="lightbox-title">{selectedImage.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}