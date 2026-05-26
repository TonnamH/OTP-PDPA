// src/pages/Videos.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FadeIn from '../components/FadeIn';
import '../css/Videos.css';

const Icon = ({ name, size = 20, color = 'currentColor', strokeWidth = 1.6 }) => {
  const icons = {
    video: (
      <>
        <polygon points="23 7 16 12 23 17 23 7"/>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </>
    ),
    play: (
      <path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>
    ),
    external: (
      <>
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
      </>
    ),
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

export default function Videos() {
  const { t } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videoData = [
    {
      categoryKey: 'cat1',
      videos: [
        { id: 1, title: 'หลักการสำคัญพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 EP.1', youtubeId: 'MBeK0KrHd5w' },
        { id: 2, title: 'หลักการสำคัญพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 EP.2', youtubeId: '7h72snD29Ls' },
        { id: 3, title: 'หลักการสำคัญพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 EP.3', youtubeId: 'lPbIiFC5L6I' },
      ],
    },
    {
      categoryKey: 'cat2',
      videos: [
        { id: 4, title: 'กลไกเพื่อให้เกิดการบังคับใช้กฎหมายคุ้มครองข้อมูลส่วนบุคคล', youtubeId: 'i6UWPL1DaoE' },
      ],
    },
    {
      categoryKey: 'cat3',
      videos: [
        { id: 5, title: 'สาระสำคัญ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562', youtubeId: '-Qejl-2F_Vk' },
      ],
    },
    {
      categoryKey: 'cat4',
      videos: [
        { id: 6, title: 'แนะนำ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562', youtubeId: '5siFs7qKBgU' },
      ],
    },
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
        <section className="videos-hero">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <Icon name="video" size={16} color="rgba(255,255,255,0.5)" strokeWidth={1.8}/>
              <span style={{
                fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)'
              }}>
                Video Library
              </span>
            </div>
            <h1>{t('videos.title', 'วิดีโอความรู้ PDPA')}</h1>
            <p>{t('videos.subtitle', 'รวบรวมวิดีโออธิบายกฎหมายคุ้มครองข้อมูลส่วนบุคคลจากหน่วยงานที่เกี่ยวข้อง')}</p>
          </div>
        </section>
      </FadeIn>

      {/* VIDEO CATEGORIES */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">

          {videoData.map((categoryGroup, index) => (
            <FadeIn key={index} delay={0.15 + index * 0.1}>
              <div className="video-category">

                <div className="video-category-label">
                  <h4>{t(`videos.categories.${categoryGroup.categoryKey}`, categoryGroup.categoryKey)}</h4>
                </div>

                <div className="videos-grid">
                  {categoryGroup.videos.map((video) => (
                    <div
                      key={video.id}
                      className="video-card"
                      onClick={() => setSelectedVideo(video)}
                    >
                      {/* Thumbnail */}
                      <div className="video-thumbnail">
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                          alt={video.title}
                          onError={(e) => {
                            e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                          }}
                        />
                        <div className="video-overlay"/>
                        <div className="video-play-btn">
                          <Icon name="play" size={20} color="white" strokeWidth={0}/>
                        </div>
                      </div>

                      {/* Title */}
                      <div className="video-card-body">
                        <h5 className="video-card-title">{video.title}</h5>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </FadeIn>
          ))}

          {/* More Videos CTA */}
          <FadeIn delay={0.6}>
            <div className="videos-cta">
              <p>
                {t('videos.moreVideosText', 'ดูวิดีโอเพิ่มเติมได้ที่')}{' '}
                <a
                  href="https://www.pdpc.or.th/pdpc-channel/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('videos.moreVideosLink', 'ช่อง PDPC Thailand')}
                  {' '}<Icon name="external" size={13} strokeWidth={2} style={{ verticalAlign: 'middle' }}/>
                </a>
              </p>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* VIDEO MODAL */}
      {selectedVideo && (
        <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
          <button className="video-modal-close" onClick={() => setSelectedVideo(null)}>
            &times;
          </button>

          <div className="video-modal-frame" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <p className="video-modal-title">{selectedVideo.title}</p>
        </div>
      )}

    </div>
  );
}