// src/pages/SearchResults.jsx
import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import { searchIndex } from '../data/searchIndex';

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    // Configure Fuse.js
    const fuse = useMemo(() => {
        return new Fuse(searchIndex, {
            keys: ['title', 'description', 'category', 'id'], // Where it should look for words
            threshold: 0.3, // 0.0 is an exact match, 1.0 matches anything. 0.3 is a good balance for typos.
            includeScore: true
        });
    }, []);

    // Run the search
    const results = query ? fuse.search(query).map(result => result.item) : [];

    return (
        <div style={{ backgroundColor: 'var(--bg-paper)', minHeight: '100vh', paddingBottom: '5rem' }}>

            {/* Header */}
            <section style={{ backgroundColor: 'var(--primary-navy)', padding: '3rem 0' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontFamily: 'Prompt, sans-serif',
                        margin: 0,
                        color: 'var(--bg-white)'
                    }}>
                        ผลการค้นหา: "{query}"
                    </h1>
                    <p style={{
                        marginTop: '0.5rem',
                        color: 'var(--bg-white)',
                        opacity: 0.9
                    }}>
                        พบ {results.length} รายการ
                    </p>
                </div>
            </section>

            {/* Results List */}
            <section className="section-full">
                <div className="container" style={{ maxWidth: '800px' }}>

                    {results.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {results.map((item) => (
                                <div key={item.id} style={{
                                    backgroundColor: 'var(--bg-white)',
                                    padding: '1.5rem',
                                    borderRadius: '8px',
                                    boxShadow: 'var(--shadow-elegant)',
                                    borderLeft: '4px solid var(--primary-navy)'
                                }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-gray)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        {item.category}
                                    </div>
                                    <Link to={item.path} style={{ textDecoration: 'none' }}>
                                        <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-navy)', marginBottom: '0.5rem', fontFamily: 'Prompt, sans-serif' }}>
                                            {item.title}
                                        </h3>
                                    </Link>
                                    <p style={{ color: 'var(--text-dark)', margin: 0 }}>
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--bg-white)', borderRadius: '8px', boxShadow: 'var(--shadow-elegant)' }}>
                            <h3 style={{ color: 'var(--text-gray)', fontFamily: 'Prompt, sans-serif' }}>
                                ไม่พบข้อมูลที่ตรงกับการค้นหาของคุณ
                            </h3>
                            <p style={{ color: 'var(--text-gray)' }}>ลองใช้คำค้นหาอื่น หรือตรวจสอบการสะกดคำอีกครั้ง</p>
                        </div>
                    )}

                </div>
            </section>
        </div>
    );
}