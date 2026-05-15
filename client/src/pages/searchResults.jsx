// src/pages/SearchResults.jsx
import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import { useTranslation } from 'react-i18next';
import { searchIndex } from '../data/searchIndex';

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { t, i18n } = useTranslation();

    // 1. Translate the raw index data into the active language
    const localizedIndex = useMemo(() => {
        return searchIndex.map(item => ({
            ...item,
            title: t(item.titleKey),
            description: t(item.descKey),
            category: t(item.categoryKey)
        }));
    }, [t, i18n.language]); // Rebuild this whenever the language changes!

    // 2. Feed the translated index to Fuse.js
    const fuse = useMemo(() => {
        return new Fuse(localizedIndex, {
            keys: ['title', 'description', 'category', 'keywords'],
            threshold: 0.3,
            includeScore: true
        });
    }, [localizedIndex]);

    // 3. Run the search
    const results = query ? fuse.search(query).map(result => result.item) : [];

    return (
        <div style={{ backgroundColor: 'var(--bg-paper)', minHeight: '100vh', paddingBottom: '5rem' }}>

            {/* Header */}
            <section style={{ backgroundColor: 'var(--primary-navy)', padding: '3rem 0' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h1 style={{ fontSize: '2rem', fontFamily: 'Prompt, sans-serif', margin: 0, color: 'var(--bg-white)' }}>
                        {t('search.title', { query: query })}
                    </h1>
                    <p style={{ marginTop: '0.5rem', color: 'var(--bg-white)', opacity: 0.9 }}>
                        {t('search.found', { count: results.length })}
                    </p>
                </div>
            </section>

            {/* Results List */}
            <section className="section-full">
                <div className="container" style={{ maxWidth: '800px' }}>

                    {results.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {results.map((item) => (

                                // 4. Wrapped the ENTIRE card in the Link
                                <Link to={item.path} key={item.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                    <div
                                        style={{
                                            backgroundColor: 'var(--bg-white)',
                                            padding: '1.5rem',
                                            borderRadius: '8px',
                                            boxShadow: 'var(--shadow-elegant)',
                                            borderLeft: '4px solid var(--primary-navy)',
                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease', // Smooth animation prep
                                            cursor: 'pointer'
                                        }}
                                        // 5. The Hover Animation (Slides right and deepens shadow)
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateX(8px)';
                                            e.currentTarget.style.boxShadow = '0 10px 15px rgba(24, 35, 55, 0.08)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateX(0)';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-elegant)';
                                        }}
                                    >
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            {item.category}
                                        </div>
                                        <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginBottom: '0.5rem', fontFamily: 'Prompt, sans-serif' }}>
                                            {item.title}
                                        </h3>
                                        <p style={{ color: 'var(--text-dark)', margin: 0 }}>
                                            {item.description}
                                        </p>
                                    </div>
                                </Link>

                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--bg-white)', borderRadius: '8px', boxShadow: 'var(--shadow-elegant)' }}>
                            <h3 style={{ color: 'var(--text-gray)', fontFamily: 'Prompt, sans-serif' }}>
                                {t('search.notFound')}
                            </h3>
                            <p style={{ color: 'var(--text-gray)' }}>
                                {t('search.tryAgain')}
                            </p>
                        </div>
                    )}

                </div>
            </section>
        </div>
    );
}