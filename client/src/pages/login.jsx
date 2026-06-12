// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrorMsg(''); // Clear errors when they start typing again
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // Handing the deposit slip to the teller...
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        // Success! The teller gave us the wristband.
        sessionStorage.setItem('adminToken', data.token); // Save the keycard
        navigate('/admin/dashboard'); // Walk through the door
      } else {
        // The teller rejected it.
        setErrorMsg(data.error || t('loginPage.errorGeneric'));
      }
    } catch (error) {
      console.error('Network Error:', error);
      setErrorMsg('Cannot connect to the server. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Hardcoded Light Theme Styles
  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem', borderRadius: '4px',
    border: '1px solid #e2e8f0', fontFamily: 'Prompt, sans-serif',
    fontSize: '1rem', outlineColor: '#1e3a8a', backgroundColor: '#ffffff',
    marginTop: '0.5rem', marginBottom: '1.5rem', color: '#1e293b'
  };

  const labelStyle = {
    fontFamily: 'Prompt, sans-serif', fontWeight: '500', color: '#1e293b'
  };

  return (
    // Added the login-page-root class and forced light background
    <div className="login-page-root" style={{ backgroundColor: '#f8fafc', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      
      <div style={{ 
        width: '100%', maxWidth: '450px', backgroundColor: '#ffffff', 
        padding: '3rem 2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e2e8f0'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontFamily: 'Prompt, sans-serif', color: '#1e3a8a', margin: '0 0 0.5rem 0' }}>
            {t('loginPage.title')}
          </h1>
          <p style={{ fontFamily: 'Prompt, sans-serif', color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
            {t('loginPage.subtitle')}
          </p>
        </div>

        {/* Error Message Box */}
        {errorMsg && (
          <div style={{ 
            backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', 
            borderRadius: '4px', marginBottom: '1.5rem', fontFamily: 'Prompt, sans-serif',
            fontSize: '0.9rem', textAlign: 'center', border: '1px solid #f87171'
          }}>
            {errorMsg}
          </div>
        )}

        {/* The Form */}
        <form onSubmit={handleSubmit}>
          
          <label htmlFor="username" style={labelStyle}>{t('loginPage.usernameLabel')}</label>
          <input 
            type="text" id="username" name="username" 
            required autoFocus
            value={credentials.username} onChange={handleChange} 
            style={inputStyle} 
          />

          <label htmlFor="password" style={labelStyle}>{t('loginPage.passwordLabel')}</label>
          <input 
            type="password" id="password" name="password" 
            required 
            value={credentials.password} onChange={handleChange} 
            style={{...inputStyle, marginBottom: '2rem'}} 
          />

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%', padding: '1rem', backgroundColor: isLoading ? '#555555' : '#1e3a8a', 
              color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '1.1rem', fontFamily: 'Prompt, sans-serif',
              cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s ease', fontWeight: '600'
            }}
          >
            {isLoading ? t('loginPage.loggingIn') : t('loginPage.loginBtn')}
          </button>

        </form>

      </div>
    </div>
  );
}