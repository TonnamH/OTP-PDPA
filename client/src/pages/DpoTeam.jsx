// src/pages/DpoTeam.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // <-- Added Link import
import { useTranslation } from 'react-i18next';
import FadeIn from '../components/FadeIn';
import '../css/DpoTeam.css';

// Reuse the same Icon component from Home or inline it here
const Icon = ({ name, size = 20, color = 'currentColor', strokeWidth = 1.6 }) => {
  const icons = {
    mail: (
      <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </>
    ),
    shield: (
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    ),
    users: (
      <>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </>
    ),
    check: (<polyline points="20,6 9,17 4,12" />),
    arrow: (<path d="M5 12h14M12 5l7 7-7 7" />),
    key: (
      <>
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    server: (
      <>
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </>
    ),
    alert: (
      <>
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </>
    )
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

export default function DpoTeam() {
  const { t } = useTranslation();

  const workingGroupMembers = [
    t('dpo.members.centralAdmin', 'สำนักบริหารกลาง'),
    t('dpo.members.landTraffic', 'กองจัดระบบการจราจรทางบก'),
    t('dpo.members.transportSystem', 'กองพัฒนาระบบการขนส่งและจราจร'),
    t('dpo.members.ticketing', 'สำนักงานโครงการบริหารจัดการระบบตั๋วร่วม'),
    t('dpo.members.safetyPlan', 'สำนักแผนความปลอดภัย'),
    t('dpo.members.planning', 'สำนักแผนงาน'),
    t('dpo.members.regionalTransport', 'สำนักส่งเสริมระบบการขนส่งและจราจรในภูมิภาค'),
    t('dpo.members.adminSystem', 'ศูนย์เทคโนโลยีสารสนเทศการขนส่งและจราจร'),
    t('dpo.members.internalAudit', 'กลุ่มตรวจสอบภายใน'),
  ];

  const duties = [
    { icon: 'book', text: t('dpo.duty1', 'ให้คำแนะนำแก่ผู้ควบคุมข้อมูลส่วนบุคคลหรือผู้ประมวลผลข้อมูลส่วนบุคคล รวมถึงลูกจ้างหรือผู้รับจ้างของผู้ควบคุมข้อมูลส่วนบุคคลหรือผู้ประมวลผลข้อมูลส่วนบุคคลเกี่ยวกับการปฏิบัติตามพระราชบัญญัตินี้') },
    { icon: 'search', text: t('dpo.duty2', 'ตรวจสอบการดำเนินงานของผู้ควบคุมข้อมูลส่วนบุคคลหรือผู้ประมวลผลข้อมูลส่วนบุคคลที่เกี่ยวกับการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลเพื่อให้เป็นไปตามพระราชบัญญัตินี้') },
    { icon: 'users', text: t('dpo.duty3', 'ประสานงานและให้ความร่วมมือกับสำนักงานในกรณีที่มีปัญหาเกี่ยวกับการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของผู้ควบคุมข้อมูลส่วนบุคคลหรือผู้ประมวลผลข้อมูลส่วนบุคคล') },
    { icon: 'bell', text: t('dpo.duty4', 'รักษาความลับของข้อมูลส่วนบุคคลที่ตนล่วงรู้หรือได้มาเนื่องจากการปฏิบัติหน้าที่ตามพระราชบัญญัตินี้') },
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>

      {/* 1. HERO */}
      <FadeIn delay={0.1}>
        // REPLACE with:
        <section className="dpo-hero">
          <div className="container">
            <div style={{ maxWidth: '700px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
                <Icon name="shield" size={18} color="rgba(255,255,255,0.5)" strokeWidth={1.8} />
                <span style={{ fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
                  Data Protection Officer
                </span>
              </div>
              <h1>{t('dpo.title', 'ทีมเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล')}</h1>
              <p>{t('dpo.subtitle', 'คณะทำงานเพื่อปฏิบัติหน้าที่เป็นเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลของ สนข.')}</p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* 2. ORG CHART */}
      <FadeIn delay={0.2}>
        <section className="org-chart-section">
          <div className="container" style={{ maxWidth: '1100px' }}>

            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8' }}>
                โครงสร้างคณะทำงาน
              </span>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary-navy)', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
                {t('dpo.orgChartTitle', 'แผนผังองค์กร DPO')}
              </h2>
            </div>

            <div className="org-chart-wrapper">

              {/* L1: Chairman */}
              <div className="org-level-1-card">
                <span className="level-label">ประธาน</span>
                <h4>{t('dpo.chairmanTitle', 'รองผู้อำนวยการ สนข.')}</h4>
                <p>{t('dpo.chairmanRole', 'ที่ได้รับมอบหมาย')}</p>
              </div>

              {/* Connector */}
              <div className="org-connector" />

              {/* L2: Working Group */}
              <div className="org-level-2-wrapper">
                <div className="org-level-2-label">
                  {t('dpo.workingGroupLabel', 'คณะทำงาน — ผู้แทนจากแต่ละสำนัก/กอง')}
                </div>
                <div className="org-level-2-rail">
                  {workingGroupMembers.map((member, i) => (
                    <div key={i} className="org-level-2-col">
                      <div className="org-member-card">{member}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connector */}
              <div className="org-connector" />

              {/* L3: Secretaries */}
              <div className="org-level-3-wrapper">
                <div className="org-level-3-label">
                  เลขานุการคณะทำงาน — ศูนย์เทคโนโลยีสารสนเทศการขนส่งและจราจร
                </div>
                <div className="org-level-3-inner">

                  <div className="org-secretary-main">
                    <div className="org-secretary-avatar">
                      <Icon name="users" size={22} color="#15803d" strokeWidth={1.8} />
                    </div>
                    <div>
                      <h4>{t('dpo.secretaries.itDirector', 'ผู้อำนวยการศูนย์เทคโนโลยีสารสนเทศการขนส่งและจราจร')}</h4>
                      <p>{t('dpo.secretaries.itRole', 'เลขานุการคณะทำงาน')}</p>
                    </div>
                  </div>

                  <div className="org-secretary-sub-grid">
                    {[
                      { key: 'networkHead', role: 'networkRole', icon: 'server' },
                      { key: 'infoPolicyHead', role: 'networkRole', icon: 'key' },
                      { key: 'infoSystemHead', role: 'networkRole', icon: 'bell' },
                    ].map(({ key, role, icon }) => (
                      <div key={key} className="org-secretary-sub-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <Icon name={icon} size={16} color="#15803d" strokeWidth={1.8} />
                          <strong>{t(`dpo.secretaries.${key}`, key)}</strong>
                        </div>
                        <span>{t(`dpo.secretaries.${role}`, 'ผู้ช่วยเลขานุการ')}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>
      </FadeIn>

      {/* 3. DUTIES */}
      <FadeIn delay={0.3}>
        <section className="duties-section">
          <div className="container" style={{ maxWidth: '1000px' }}>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8' }}>
                หน้าที่และอำนาจ
              </span>
              <h2 style={{ fontSize: '2rem', color: 'var(--primary-navy)', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
                {t('dpo.dutiesTitle', 'บทบาทหน้าที่ของ DPO')}
              </h2>
            </div>

            <div className="duties-grid">
              {duties.map((duty, i) => (
                <div key={i} className="duty-card">
                  <div className="duty-number">{i + 1}</div>
                  <p className="duty-text">{duty.text}</p>
                </div>
              ))}
            </div>

          </div>
        </section>
      </FadeIn>

      {/* 4. CONTACT CTA - UPDATED TO ROUTE TO REPORT PAGE */}
      <FadeIn delay={0.4}>
        <section className="contact-cta">
          <div className="container">
            <div className="contact-cta-inner">
              <div>
                <h3>{t('dpo.contactTitle', 'พบปัญหาเกี่ยวกับการรั่วไหลของข้อมูล?')}</h3>
                <p>{t('dpo.contactSub', 'แจ้งเหตุละเมิดข้อมูลส่วนบุคคลหรือติดต่อทีม DPO ของ สนข.')}</p>
              </div>
              <Link to="/contact/report">
                <Icon name="alert" size={18} color="white" strokeWidth={1.8} />
                {t('home.hero.reportBtn', 'แจ้งเหตุละเมิดข้อมูล')}
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>

    </div>
  );
}