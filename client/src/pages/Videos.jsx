// src/pages/Videos.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Videos() {
    const { t } = useTranslation();
    const [selectedVideo, setSelectedVideo] = useState(null); // Controls the Video Lightbox

    // THE FAKE DATABASE
    // Notice we just store the YouTube ID now (the part after v= in a YouTube link)
    const videoData = [
        {
            categoryKey: 'cat1',
            videos: [
                { id: 1, title: 'PDPA คืออะไร สรุปเข้าใจง่ายใน 3 นาที', youtubeId: 'Y9zS4M0bJUM' }, // Example IDs
                { id: 2, title: 'หน้าที่ของผู้ควบคุมข้อมูลส่วนบุคคล', youtubeId: 'dQw4w9WgXcQ' },
                { id: 3, title: 'สิทธิของเจ้าของข้อมูล', youtubeId: 'jNQXAC9IVRw' }
            ]
        },
        {
            categoryKey: 'cat2',
            videos: [
                { id: 4, title: 'ขั้นตอนการแจ้งเหตุละเมิด', youtubeId: 'tPEE9ZwTmy0' }
            ]
        },
        {
            categoryKey: 'cat3',
            videos: [
                { id: 5, title: 'สรุปสาระสำคัญ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล', youtubeId: 'M7lc1UVf-VE' }
            ]
        }
    ];

    // Close lightbox when hitting Escape key
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') setSelectedVideo(null); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    return (
        <div style={{ backgroundColor: 'var(--bg-white)', minHeight: '100vh', paddingBottom: '5rem' }}>

            {/* 1. Header Section */}
            <section className="section-full" style={{ paddingBottom: '2rem' }}>
                <div className="container">
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'Prompt, sans-serif' }}>
                            {t('videos.title')}
                        </h1>
                        <h2 style={{ fontSize: '1.2rem', color: 'var(--text-gray)', fontWeight: '400' }}>
                            {t('videos.subtitle')}
                        </h2>
                    </div>
                </div>
            </section>

            {/* 2. Multimedia Content Section */}
            <section className="section-full" style={{ paddingTop: '0' }}>
                <div className="container">

                    <h3 style={{ fontSize: '1.8rem', marginBottom: '2.5rem', fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)' }}>
                        {t('videos.sectionTitle')}
                    </h3>

                    {/* Loop through each Category */}
                    {videoData.map((categoryGroup, index) => (
                        <div key={index} style={{ marginBottom: '4rem' }}>

                            <h4 style={{
                                fontSize: '1.2rem',
                                marginBottom: '1.5rem',
                                fontFamily: 'Sarabun, sans-serif',
                                fontWeight: '600',
                                borderLeft: '4px solid var(--primary-navy)',
                                paddingLeft: '1rem'
                            }}>
                                {t(`videos.categories.${categoryGroup.categoryKey}`)}
                            </h4>

                            {/* Video Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                gap: '2rem'
                            }}>
                                {categoryGroup.videos.map((video) => (
                                    // Click handler to open the Lightbox
                                    <div key={video.id} onClick={() => setSelectedVideo(video)} style={{ cursor: 'pointer', group: 'hover' }}>

                                        <div style={{
                                            position: 'relative',
                                            width: '100%',
                                            aspectRatio: '16 / 9',
                                            backgroundColor: '#182337',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            marginBottom: '1rem',
                                            boxShadow: 'var(--shadow-elegant)',
                                        }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.querySelector('.play-btn').style.transform = 'translate(-50%, -50%) scale(1.1)';
                                                e.currentTarget.querySelector('.play-btn').style.backgroundColor = '#FF0000'; // YouTube Red on hover!
                                                e.currentTarget.querySelector('img').style.transform = 'scale(1.05)';
                                                e.currentTarget.querySelector('.overlay').style.backgroundColor = 'rgba(24, 35, 55, 0.4)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.querySelector('.play-btn').style.transform = 'translate(-50%, -50%) scale(1)';
                                                e.currentTarget.querySelector('.play-btn').style.backgroundColor = 'rgba(24, 35, 55, 0.8)';
                                                e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                                                e.currentTarget.querySelector('.overlay').style.backgroundColor = 'rgba(24, 35, 55, 0.2)';
                                            }}
                                        >
                                            {/* MAGIC: Auto-fetch thumbnail from YouTube using the ID */}
                                            <img
                                                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                                alt={video.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                                onError={(e) => {
                                                    // Fallback to a lower quality thumbnail if the max-res one doesn't exist
                                                    e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                                                }}
                                            />

                                            <div className="overlay" style={{
                                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                                backgroundColor: 'rgba(24, 35, 55, 0.2)', transition: 'background-color 0.4s ease'
                                            }}></div>

                                            <div className="play-btn" style={{
                                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                                width: '60px', height: '60px', borderRadius: '50%',
                                                backgroundColor: 'rgba(24, 35, 55, 0.8)', color: 'white',
                                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                transition: 'all 0.3s ease', backdropFilter: 'blur(4px)'
                                            }}>
                                                {/* Play Icon */}
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <h5 style={{ textAlign: 'center', fontFamily: 'Prompt, sans-serif', color: 'var(--text-dark)', margin: 0 }}>
                                            {video.title}
                                        </h5>

                                    </div>
                                ))}
                            </div>

                        </div>
                    ))}

                </div>
            </section>

            {/* 3. YOUTUBE VIDEO LIGHTBOX */}
            {selectedVideo && (
                <div
                    onClick={() => setSelectedVideo(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        zIndex: 9999,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '2rem',
                        backdropFilter: 'blur(5px)'
                    }}
                >
                    <button
                        onClick={() => setSelectedVideo(null)}
                        style={{
                            position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none',
                            color: 'white', fontSize: '2.5rem', cursor: 'pointer', zIndex: 10000
                        }}
                    >
                        &times;
                    </button>

                    {/* Video Container (Restricts max width and keeps 16:9 ratio) */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '1000px',
                            aspectRatio: '16 / 9',
                            backgroundColor: 'black',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                            title={selectedVideo.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

        </div>
    );
}