// src/pages/Contact.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();

  // Helper for rendering SVG Icons
  const IconWrapper = ({ children }) => (
    <div style={{ 
      backgroundColor: 'var(--bg-light)', 
      color: 'var(--primary-navy)', 
      width: '50px', height: '50px', 
      borderRadius: '50%', 
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      flexShrink: 0
    }}>
      {children}
    </div>
  );

  return (
    <div style={{ backgroundColor: 'var(--bg-white)', minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* 1. Header Section */}
      <section className="section-full" style={{ paddingBottom: '2rem' }}>
        <div className="container">
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'Prompt, sans-serif' }}>
              {t('contactPage.title')}
            </h1>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-gray)', fontWeight: '400' }}>
              {t('contactPage.subtitle')}
            </h2>
          </div>
        </div>
      </section>

      {/* 2. Content Grid */}
      <section className="section-full" style={{ paddingTop: '1rem' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '4rem' 
          }}>
            
            {/* LEFT COLUMN: Contact Information */}
            <div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)' }}>
                {t('contactPage.infoTitle')}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Address */}
                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <IconWrapper>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 7.2c0 7.3-8 11.8-8 11.8z"></path><circle cx="12" cy="9" r="3"></circle></svg>
                  </IconWrapper>
                  <div>
                    <h4 style={{ margin: '0 0 0.3rem 0', fontFamily: 'Prompt, sans-serif', color: 'var(--text-dark)' }}>{t('contactPage.addressLabel')}</h4>
                    <p style={{ margin: 0, color: 'var(--text-gray)', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                      {t('contactPage.address')}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <IconWrapper>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </IconWrapper>
                  <div>
                    <h4 style={{ margin: '0 0 0.3rem 0', fontFamily: 'Prompt, sans-serif', color: 'var(--text-dark)' }}>{t('contactPage.phoneLabel')}</h4>
                    <p style={{ margin: 0, color: 'var(--text-gray)' }}>{t('contactPage.phone')}</p>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <IconWrapper>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </IconWrapper>
                  <div>
                    <h4 style={{ margin: '0 0 0.3rem 0', fontFamily: 'Prompt, sans-serif', color: 'var(--text-dark)' }}>{t('contactPage.emailLabel')}</h4>
                    <a href={`mailto:${t('contactPage.email')}`} style={{ margin: 0, color: 'var(--primary-navy)', textDecoration: 'none', fontWeight: '600' }}>
                      {t('contactPage.email')}
                    </a>
                  </div>
                </div>

                {/* Working Hours */}
                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <IconWrapper>
                    {/* Globe Icon */}
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                  </IconWrapper>
                  <div>
                    <h4 style={{ margin: '0 0 0.3rem 0', fontFamily: 'Prompt, sans-serif', color: 'var(--text-dark)' }}>{t('contactPage.websiteLabel')}</h4>
                    <a href={t('contactPage.website')} target="_blank" rel="noopener noreferrer" style={{ margin: 0, color: 'var(--primary-navy)', textDecoration: 'none', fontWeight: '600' }}>
                      {t('contactPage.website')}
                    </a>
                  </div>
                </div>

                {/* Working Hours */}
                <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <IconWrapper>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </IconWrapper>
                  <div>
                    <h4 style={{ margin: '0 0 0.3rem 0', fontFamily: 'Prompt, sans-serif', color: 'var(--text-dark)' }}>{t('contactPage.hoursLabel')}</h4>
                    <p style={{ margin: 0, color: 'var(--text-gray)' }}>{t('contactPage.hours')}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: Google Map */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', fontFamily: 'Prompt, sans-serif', color: 'var(--primary-navy)' }}>
                {t('contactPage.mapTitle')}
              </h3>
              
              <div style={{ 
                width: '100%', 
                flex: 1, 
                minHeight: '400px', 
                borderRadius: '8px', 
                overflow: 'hidden',
                boxShadow: 'var(--shadow-elegant)',
                border: '1px solid var(--border-color)'
              }}>
                <iframe 
                  title="OTP Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.353183639069!2d100.5224713!3d13.7575624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29936222fb455%3A0x1a0d35f71b7ac2f5!2sOffice%20of%20Transport%20and%20Traffic%20Policy%20and%20Planning%20(OTP)!5e0!3m2!1sen!2sth!4v1778816428514!5m2!1sen!2sth"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}