import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PageViewBadge = () => {
  const [views, setViews] = useState(0);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    // 1. Hide the badge on the admin dashboard
    if (location.pathname.startsWith('/admin')) return;

    const fetchViews = async () => {
      try {
        // encodeURIComponent ensures slashes (like /about/ropa) don't break the URL
        const response = await fetch(`http://localhost:5000/api/page-visit/single?path=${encodeURIComponent(location.pathname)}`);
        if (response.ok) {
          const data = await response.json();
          setViews(data.count);
        }
      } catch (error) {
        console.error('Failed to fetch page views:', error);
      }
    };

    // 2. We use a tiny 500ms delay here! 
    // This gives your PageTracker enough time to send the POST request FIRST, 
    // ensuring the number fetched includes the current user's visit.
    const timer = setTimeout(fetchViews, 500);
    return () => clearTimeout(timer);

  }, [location.pathname]);

  // Hide it entirely if it's an admin page or if the view count hasn't loaded yet
  if (location.pathname.startsWith('/admin') || views === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px', // You can change this to 'right: 20px' if you prefer it on the other side
      backgroundColor: 'rgba(30, 41, 59, 0.8)', // Dark navy, semi-transparent
      backdropFilter: 'blur(8px)', // Frosted glass effect
      color: '#f8fafc',
      padding: '8px 16px',
      borderRadius: '50px',
      fontSize: '0.85rem',
      fontWeight: '500',
      fontFamily: 'Prompt, sans-serif',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      zIndex: 50,
      pointerEvents: 'none' // Makes it "ghost-like" so users can click right through it
    }}>
      {/* Little Eye Icon */}
      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <span>{views.toLocaleString()} {t('pageViewBadge.views', 'ผู้เข้าชมหน้านี้')}</span>
    </div>
  );
};

export default PageViewBadge;