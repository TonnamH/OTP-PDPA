// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FadeIn from '../components/FadeIn';
import '../css/Home.css';
import api from '../utils/api';
import Icon from '../components/Icon';



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

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        // Fire both requests at the same time cleanly
        const [docsRes, infoRes] = await Promise.all([
          api.get('/documents'),
          api.get('/infographics')
        ]);
        
        // Axios automatically parses the JSON into the .data property
        const docs = docsRes.data;
        const infos = infoRes.data;

        // 1. Set the Mixed "Latest Updates/Downloads" at the bottom
        const combined = [...docs, ...infos]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);
          
        setLatestUpdates(combined);
        
        // 2. Set the Visual Infographics Gallery (Grabbing only items with images, max 4)
        const validInfographics = infos
          .filter(info => info.image_path)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 4);
          
        setRecentInfographics(validInfographics);
        
      } catch (err) {
        console.error('Could not fetch latest updates', err);
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
      <section className="hero-section">
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
      </section>

      {/* 2. PDPA IN 60 SECONDS */}
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
      </section>

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
                  <a
                    href={`http://localhost:5000${info.image_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="info-gallery-card"
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
                  </a>
                </FadeIn>
              ))}
            </div>
          ) : (
            <p className="empty-state">{t('home.infographicGallery.empty', 'ไม่มีสื่อประชาสัมพันธ์ในขณะนี้')}</p>
          )}
        </div>
      </section>

      {/* 5. LATEST UPDATES (Text Feed) */}
      <section className="section-full bg-white">
        <div className="container">
          <FadeIn delay={0.1}>
            <div className="updates-header">
              <div>
                <span className="section-label">{t('home.downloads.label', 'ดาวน์โหลด')}</span>
                <h2 className="section-title" style={{ marginBottom: 0 }}>{t('home.downloads.title', 'เอกสารและแบบฟอร์มล่าสุด')}</h2>
              </div>
              <Link to="/about/documents" className="updates-link">
                {t('home.downloads.viewAll', 'คลังเอกสารทั้งหมด')}
                <Icon name="arrow" size={14} strokeWidth={2} />
              </Link>
            </div>
          </FadeIn>

          {loadingUpdates ? (
            <p className="empty-state">{t('home.downloads.loading', 'กำลังโหลดเอกสาร...')}</p>
          ) : latestUpdates.length > 0 ? (
            <div className="news-grid">
              {latestUpdates.map((item, idx) => {
                const isPdf = item.file_path && item.file_path.endsWith('.pdf');
                
                return (
                  <FadeIn key={item.id} delay={0.1 * idx}>
                    <a
                      href={`http://localhost:5000${item.file_path || item.image_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="news-card"
                      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                    >
                      <div className="news-badge">{item.category}</div>
                      <h4 className="news-title" style={{ flexGrow: 1 }}>{item.title}</h4>
                      
                      {/* Updated Footer to look like a file download action */}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginTop: '1.5rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid #e2e8f0',
                        color: 'var(--primary-navy)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#64748b' }}>
                          <Icon name="calendar" size={14} strokeWidth={1.8} />
                          {formatDate(item.created_at)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: '600' }}>
                          {isPdf ? 'ดาวน์โหลด PDF' : 'เปิดดูไฟล์'}
                          <Icon name="download" size={16} strokeWidth={2} />
                        </div>
                      </div>
                    </a>
                  </FadeIn>
                );
              })}
            </div>
          ) : (
            <p className="empty-state">{t('home.downloads.empty', 'ยังไม่มีเอกสารในขณะนี้')}</p>
          )}
        </div>
      </section>

    </div>
  );
}