// src/pages/ReportForm.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import FadeIn from '../components/FadeIn'; // <-- 1. Import the FadeIn component

export default function ReportForm() {
  const { t } = useTranslation();
  
  // State Management
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    issueType: 'website', // Default to the first radio option
    otherSpecify: '',
    details: '',
    consent: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  // Styles
  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem', borderRadius: '4px',
    border: '1px solid var(--border-color)', fontFamily: 'Sarabun, sans-serif',
    fontSize: '1rem', outlineColor: 'var(--primary-navy)', backgroundColor: '#fff',
    marginTop: '0.3rem'
  };

  const labelStyle = {
    fontFamily: 'Prompt, sans-serif', fontWeight: '500', color: 'var(--text-dark)'
  };

  const radioContainerStyle = {
    display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem',
    fontFamily: 'Sarabun, sans-serif', color: 'var(--text-dark)', cursor: 'pointer'
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-white)', minHeight: '100vh', paddingBottom: '5rem' }}>
      
      {/* 1. Header Section */}
      <FadeIn delay={0.1}>
        <section className="section-full" style={{ paddingBottom: '2rem' }}>
          <div className="container">
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Prompt, sans-serif', color: 'var(--text-dark)' }}>
                {t('reportPage.title')}
              </h1>
              <h2 style={{ fontSize: '1rem', color: 'var(--text-gray)', fontWeight: '400', fontFamily: 'Sarabun, sans-serif' }}>
                {t('reportPage.subtitle')}
              </h2>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* 2. Form or Success Message Section */}
      <FadeIn delay={0.2}>
        <section className="section-full" style={{ paddingTop: '1rem' }}>
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            {isSubmitted ? (
              // SUCCESS MESSAGE
              <div style={{ backgroundColor: 'var(--bg-light)', padding: '4rem 2rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(0, 150, 136, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#009688' }}>
                  <svg width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 style={{ fontSize: '2rem', color: 'var(--primary-navy)', fontFamily: 'Prompt, sans-serif', marginBottom: '1rem' }}>{t('reportPage.success.title')}</h3>
                <p style={{ color: 'var(--text-gray)', fontFamily: 'Sarabun, sans-serif', fontSize: '1.1rem', marginBottom: '2.5rem' }}>{t('reportPage.success.message')}</p>
                <Link to="/">
                  <button style={{ padding: '0.8rem 2rem', backgroundColor: 'var(--primary-navy)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', fontFamily: 'Prompt, sans-serif', cursor: 'pointer' }}>
                    {t('reportPage.success.backBtn')}
                  </button>
                </Link>
              </div>
            ) : (
              // FORM
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Grid for Inputs to match old layout somewhat (labels on left, inputs on right) */}
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'center', gap: '1rem' }}>
                  
                  <label style={{...labelStyle, textAlign: 'right'}}>{t('reportPage.form.firstNameLabel')} <span style={{color: 'red'}}>*</span></label>
                  <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} placeholder={t('reportPage.form.firstNameLabel')} style={inputStyle} />

                  <label style={{...labelStyle, textAlign: 'right'}}>{t('reportPage.form.lastNameLabel')} <span style={{color: 'red'}}>*</span></label>
                  <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} placeholder={t('reportPage.form.lastNameLabel')} style={inputStyle} />

                  <label style={{...labelStyle, textAlign: 'right'}}>{t('reportPage.form.emailLabel')} <span style={{color: 'red'}}>*</span></label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder={t('reportPage.form.emailPlaceholder')} style={inputStyle} />

                  <label style={{...labelStyle, textAlign: 'right'}}>{t('reportPage.form.phoneLabel')}</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder={t('reportPage.form.phonePlaceholder')} style={inputStyle} />
                </div>

                {/* Radio Buttons Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', marginTop: '1rem' }}>
                  <label style={{...labelStyle, textAlign: 'right', paddingTop: '0.5rem'}}>{t('reportPage.form.issueLabel')}</label>
                  <div>
                    {['website', 'inquiry', 'complaint', 'other'].map((type) => (
                      <label key={type} style={radioContainerStyle}>
                        <input 
                          type="radio" 
                          name="issueType" 
                          value={type} 
                          checked={formData.issueType === type} 
                          onChange={handleChange}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--primary-navy)' }}
                        />
                        {t(`reportPage.form.typeOptions.${type}`)}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Other Specify Field */}
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'center', gap: '1rem' }}>
                  <label style={{...labelStyle, textAlign: 'right'}}>{t('reportPage.form.otherSpecifyLabel')}</label>
                  <input 
                    type="text" 
                    name="otherSpecify" 
                    value={formData.otherSpecify} 
                    onChange={handleChange} 
                    placeholder={t('reportPage.form.otherSpecifyPlaceholder')} 
                    disabled={formData.issueType !== 'other'} // Disables if "Other" isn't selected!
                    style={{...inputStyle, backgroundColor: formData.issueType !== 'other' ? '#f0f0f0' : '#fff' }} 
                  />
                </div>

                {/* Details Textarea */}
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', alignItems: 'start' }}>
                  <label style={{...labelStyle, textAlign: 'right', paddingTop: '0.5rem'}}>{t('reportPage.form.detailLabel')}</label>
                  <textarea 
                    name="details" 
                    value={formData.details} 
                    onChange={handleChange} 
                    placeholder={t('reportPage.form.detailPlaceholder')} 
                    rows="6" 
                    style={{...inputStyle, resize: 'vertical'}}
                  ></textarea>
                </div>

                {/* Recaptcha Placeholder & Consent */}
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ textAlign: 'right', color: 'var(--text-gray)', fontFamily: 'Sarabun, sans-serif' }}>Recaptcha</div>
                  <div>
                    {/* Mock Recaptcha Box */}
                    <div style={{ width: '300px', height: '78px', backgroundColor: '#f9f9f9', border: '1px solid #d3d3d3', borderRadius: '3px', display: 'flex', alignItems: 'center', padding: '0 1rem', marginBottom: '1.5rem' }}>
                      <input type="checkbox" style={{ width: '28px', height: '28px', marginRight: '1rem' }} />
                      <span style={{ fontFamily: 'Roboto, sans-serif', fontSize: '14px', color: '#555', flex: 1 }}>I'm not a robot</span>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" width="32" />
                        <span style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>reCAPTCHA</span>
                      </div>
                    </div>

                    {/* Consent Checkbox */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Sarabun, sans-serif', color: 'var(--text-dark)', cursor: 'pointer', marginBottom: '1.5rem' }}>
                      <input 
                        type="checkbox" 
                        name="consent" 
                        required 
                        checked={formData.consent} 
                        onChange={handleChange}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary-navy)' }}
                      />
                      {t('reportPage.form.consentLabel')} <span style={{color: 'red'}}>*</span>
                    </label>

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      disabled={isSubmitting || !formData.consent}
                      style={{ 
                        padding: '0.8rem 2rem', backgroundColor: (isSubmitting || !formData.consent) ? '#555' : '#333', 
                        color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', fontFamily: 'Prompt, sans-serif',
                        cursor: (isSubmitting || !formData.consent) ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isSubmitting ? t('reportPage.form.submitting') : t('reportPage.form.submitBtn')}
                    </button>
                  </div>
                </div>

              </form>
            )}

          </div>
        </section>
      </FadeIn>

    </div>
  );
}