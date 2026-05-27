// src/pages/DpoTeam.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // <-- Added Link import
import { useTranslation } from 'react-i18next';
import FadeIn from '../components/FadeIn';
import '../css/DpoTeam.css';
import Icon from '../components/Icon';

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