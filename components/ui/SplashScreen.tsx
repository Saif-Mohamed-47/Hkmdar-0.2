'use client';

import React, { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Show splash briefly (450ms), fade out (250ms), and disappear completely
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 450);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 750);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={() => setVisible(false)}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#060a14',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 250ms ease-out',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      dir="rtl"
    >
      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197, 160, 89, 0.18) 0%, rgba(6, 10, 20, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 20px',
        }}
      >
        {/* Frame */}
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '20px',
            backgroundColor: '#080e1c',
            border: '1.5px solid rgba(197, 160, 89, 0.5)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.8), 0 0 15px rgba(197, 160, 89, 0.2)',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            overflow: 'hidden',
          }}
        >
          <img
            src="/hakmdar-icon.png"
            alt="حِكِمْدار"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '26px',
            fontWeight: 900,
            color: '#ffffff',
            margin: '0 0 6px 0',
            fontFamily: 'var(--font-cairo), system-ui, sans-serif',
          }}
        >
          حِكِمْدار
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#dfba73',
            margin: '0 0 18px 0',
            maxWidth: '300px',
            lineHeight: 1.5,
            fontFamily: 'var(--font-cairo), system-ui, sans-serif',
          }}
        >
          المنظومة الرقمية لإدارة القضايا والاستشارات القانونية
        </p>

        {/* Progress Bar */}
        <div
          style={{
            width: '160px',
            height: '3px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: fading ? '100%' : '75%',
              height: '100%',
              background: 'linear-gradient(90deg, #9e7b36, #dfba73, #c5a059)',
              borderRadius: '9999px',
              transition: 'width 300ms ease-in-out',
            }}
          />
        </div>
      </div>
    </div>
  );
}
