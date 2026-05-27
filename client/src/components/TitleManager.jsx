// src/components/TitleManager.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function TitleManager() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  // 1. The Master List: Match your URLs to their dictionary keys
  const routeTitles = {
    '/': 'nav.home',
    '/about/dpo': 'nav.aboutDpo',
    '/about/documents': 'nav.aboutDocs',
    '/about/ropa': 'nav.aboutRopa',
    '/services/infographics': 'nav.servicesInfographics',
    '/services/videos': 'videos.title',
    '/services/training': 'training.title',
    '/contact': 'nav.contact',
    '/contact/report': 'nav.Report',
    '/admin/login': 'loginPage.title', 
    '/admin/dashboard': 'adminDashboard.title',
    '/admin/documents/upload': 'adminUploadDoc.title',
    '/admin/infographics/upload': 'adminUploadInfo.title',
    '/privacy-policy': 'privacyPolicyPage.title',
    '/policy-cookie': 'cookiePolicyPage.title',
    // Add more routes and their corresponding translation keys here as needed
    // Search is handled a bit differently below because of the URL query
  };

  useEffect(() => {
    // 2. Grab the base URL path (ignoring ?q=search stuff)
    const currentPath = location.pathname;

    let pageName = '';

    // 3. Special rule for the search page so we can include the searched word
    if (currentPath === '/search') {
      const searchParams = new URLSearchParams(location.search);
      const query = searchParams.get('q') || '';
      pageName = t('search.title', { query: query });
    }
    // 4. Standard rule for all other pages
    else if (routeTitles[currentPath]) {
      pageName = t(routeTitles[currentPath]);
    }
    // 5. Fallback just in case
    else {
      pageName = t('nav.home');
    }

    const brandName = t('nav.title');

    // 6. Update the browser tab
    document.title = `${pageName} | ${brandName}`;

  }, [location, t, i18n.language]); // Re-run when the URL or language changes

  return null; // This component is invisible, it just runs logic in the background
}