// src/pages/Training.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FadeIn from '../components/FadeIn';
import '../css/Videos.css';
import '../css/Training.css';
import Icon from '../components/Icon';

export default function Training() {
  const { t } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const trainingVideos = [
    { id: 1, titleKey: 'อบรม PDPA Part 1', youtubeId: '4-LgztfilBM' },
    { id: 2, titleKey: 'อบรม PDPA Part 2', youtubeId: 't6iBc6RpzYE' },
  ];

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setSelectedVideo(null); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '5rem' }}>

      {/* HERO */}
      <FadeIn delay={0.1}>
        <section className="training-hero">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <Icon name="graduation" size={16} color="rgba(255,255,255,0.5)" strokeWidth={1.8}/>
              <span style={{
                fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)'
              }}>
                Training
              </span>
            </div>
            <h1>{t('training.title', 'การอบรมและพัฒนาความรู้ PDPA')}</h1>
            <p>{t('training.subtitle', 'บันทึกการอบรมพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคลสำหรับบุคลากร สนข.')}</p>
          </div>
        </section>
      </FadeIn>

      <section style={{ padding: '3.5rem 0' }}>
        <div className="container" style={{ maxWidth: '960px' }}>

          {/* Session Info Card */}
          <FadeIn delay={0.2}>
            <div className="training-session-card">
              <div className="training-session-icon">
                <Icon name="calendar" size={22} color="var(--primary-navy)" strokeWidth={1.8}/>
              </div>
              <div>
                <h3>{t('training.sectionTitle', 'หัวข้อการอบรม')}</h3>
                <p>{t('training.eventTitle', 'โครงการอบรมเชิงปฏิบัติการด้านการคุ้มครองข้อมูลส่วนบุคคล สำหรับเจ้าหน้าที่ สนข.')}</p>
              </div>
            </div>
          </FadeIn>

          {/* Video Category Label */}
          <FadeIn delay={0.25}>
            <div className="video-category-label" style={{ marginBottom: '1.8rem' }}>
              <h4>{t('training.videosLabel', 'บันทึกวิดีโอการอบรม')}</h4>
            </div>
          </FadeIn>

          {/* Video Grid — reuses Videos.css card classes */}
          <FadeIn delay={0.3}>
            <div className="videos-grid" style={{ maxWidth: '760px', marginBottom: '1rem' }}>
              {trainingVideos.map((video) => (
                <div
                  key={video.id}
                  className="video-card"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="video-thumbnail">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                      alt={t(video.titleKey)}
                      onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                      }}
                    />
                    <div className="video-overlay"/>
                    <div className="video-play-btn">
                      <Icon name="play" size={20} color="white" strokeWidth={0}/>
                    </div>
                  </div>
                  <div className="video-card-body">
                    <h5 className="video-card-title">{t(video.titleKey)}</h5>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Document Download */}
          <FadeIn delay={0.4}>
            <div className="training-download-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '40px', height: '40px', minWidth: '40px',
                  borderRadius: '10px', background: '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon name="document" size={18} color="#64748b" strokeWidth={1.8}/>
                </div>
                <p>{t('training.downloadDoc', 'เอกสารประกอบการอบรม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล')}</p>
              </div>
              <a href="/training_docs.pdf" download className="training-download-btn">
                <Icon name="download" size={16} color="white" strokeWidth={2}/>
                {t('training.downloadBtn', 'ดาวน์โหลดเอกสาร')}
              </a>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* VIDEO MODAL — reuses same modal pattern as Videos.jsx */}
      {selectedVideo && (
        <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
          <button className="video-modal-close" onClick={() => setSelectedVideo(null)}>
            &times;
          </button>
          <div className="video-modal-frame" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
              title={t(selectedVideo.titleKey)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="video-modal-title">{t(selectedVideo.titleKey)}</p>
        </div>
      )}

    </div>
  );
}