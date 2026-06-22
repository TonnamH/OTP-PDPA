import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.startsWith('/admin')) return;
    const lastVisitedPath = sessionStorage.getItem('lastVisitedPath');
    if (currentPath !== lastVisitedPath) {
      fetch('http://localhost:5000/api/page-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page_path: currentPath })
      }).catch(err => console.error('Failed to track page view', err));
      sessionStorage.setItem('lastVisitedPath', currentPath);
    }
    
  }, [location.pathname]);

  return null;
};

export default PageTracker;
