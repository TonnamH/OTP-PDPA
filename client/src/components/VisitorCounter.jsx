// src/components/VisitorCounter.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function VisitorCounter() {
  const { t } = useTranslation();
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    const recordVisitor = async () => {
      try {
        const hasVisited = sessionStorage.getItem('hasVisited');

        if (!hasVisited) {
          sessionStorage.setItem('hasVisited', 'true');
          const response = await fetch('http://localhost:5000/api/visitors/increment', { method: 'POST' });
          if (response.ok) {
            const data = await response.json();
            setVisitorCount(data.count || 0);
          }
        } else {
          const response = await fetch('http://localhost:5000/api/visitors');
          if (response.ok) {
            const data = await response.json();
            setVisitorCount(data.count || 0);
          }
        }
      } catch (error) {
        console.error('Failed to fetch visitor count:', error);
        setVisitorCount(0);
      }
    };

    recordVisitor();
  }, []);

  const displayCount = visitorCount !== null && !isNaN(visitorCount)
    ? new Intl.NumberFormat().format(visitorCount)
    : '...';

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.6rem',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      padding: '0.4rem 1rem',
      borderRadius: '50px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      fontFamily: 'Prompt, sans-serif'
    }}>
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: '#94a3b8' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>

      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
        {t('footer.visitorCount', 'จำนวนผู้เข้าชม')}
      </span>

      <span style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '0.8rem' }}>•</span>

      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'white', letterSpacing: '0.5px' }}>
        {displayCount}
      </span>
    </div>
  );
}