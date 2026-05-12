// src/pages/DpoTeam.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../css/DpoTeam.css';

export default function DpoTeam() {
  const { t } = useTranslation();

  return (
    <div style={{ backgroundColor: 'var(--bg-white)', minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* 1. Page Header */}
      <section className="section-full" style={{ paddingBottom: '2rem' }}>
        <div className="container">
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              {t('dpo.title')}
            </h1>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-gray)', fontWeight: '400' }}>
              {t('dpo.subtitle')}
            </h2>
          </div>
        </div>
      </section>

      {/* 2. Organizational Chart */}
      <section className="section-full" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="org-chart-container">
            
            {/* Level 1: Chairman */}
            <div className="org-level-1">
              <h4>{t('dpo.chairmanTitle')}</h4>
              <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.9 }}>{t('dpo.chairmanRole')}</p>
            </div>

            {/* Level 2: Working Group Members */}
            <div className="org-level-2">
              {/* The new translated label */}
              <div className="org-group-label">{t('dpo.workingGroupLabel')}</div>
              
              <div className="org-card">{t('dpo.members.centralAdmin')}</div>
              <div className="org-card">{t('dpo.members.landTraffic')}</div>
              <div className="org-card">{t('dpo.members.transportSystem')}</div>
              <div className="org-card">{t('dpo.members.ticketing')}</div>
              <div className="org-card">{t('dpo.members.safetyPlan')}</div>
              <div className="org-card">{t('dpo.members.planning')}</div>
              <div className="org-card">{t('dpo.members.regionalTransport')}</div>
              <div className="org-card">{t('dpo.members.adminSystem')}</div>
              <div className="org-card">{t('dpo.members.internalAudit')}</div>
            </div>

            {/* Level 3: Secretaries */}
            <div className="org-level-3">
              <div className="org-card secretary-main">
                <h4 style={{ color: '#166534', marginBottom: '0.2rem' }}>{t('dpo.secretaries.itDirector')}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#15803d' }}>{t('dpo.secretaries.itRole')}</p>
              </div>
              
              <div className="secretary-grid">
                <div className="org-card secretary-sub">
                  <strong style={{ display: 'block', marginBottom: '0.2rem', color: '#166534' }}>{t('dpo.secretaries.networkHead')}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#15803d' }}>{t('dpo.secretaries.networkRole')}</span>
                </div>
                <div className="org-card secretary-sub">
                  <strong style={{ display: 'block', marginBottom: '0.2rem', color: '#166534' }}>{t('dpo.secretaries.infoPolicyHead')}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#15803d' }}>{t('dpo.secretaries.networkRole')}</span>
                </div>
                <div className="org-card secretary-sub">
                  <strong style={{ display: 'block', marginBottom: '0.2rem', color: '#166534' }}>{t('dpo.secretaries.infoSystemHead')}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#15803d' }}>{t('dpo.secretaries.networkRole')}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Duties and Powers */}
      <section className="section-full" style={{ paddingTop: '2rem', backgroundColor: 'var(--bg-paper)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '2rem', borderLeft: '4px solid var(--primary-navy)', paddingLeft: '1rem' }}>
            {t('dpo.dutiesTitle')}
          </h3>
          <ol className="duties-list">
            <li>{t('dpo.duty1')}</li>
            <li>{t('dpo.duty2')}</li>
            <li>{t('dpo.duty3')}</li>
            <li>{t('dpo.duty4')}</li>
          </ol>
        </div>
      </section>

    </div>
  );
}