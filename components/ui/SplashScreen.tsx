'use client';

import React, { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fade-out timer
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      const removeTimer = setTimeout(() => {
        setIsLoading(false);
      }, 600);

      return () => clearTimeout(removeTimer);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#060a14',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isFadingOut ? 'none' : 'auto',
        userSelect: 'none',
      }}
      dir="rtl"
    >
      {/* Background Radial Glow */}
      <div
        style={{
          position: 'absolute',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197, 160, 89, 0.15) 0%, rgba(6, 10, 20, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Content Box */}
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
        {/* Emblem Frame with Fixed Size */}
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '24px',
            backgroundColor: '#080e1c',
            border: '2px solid rgba(197, 160, 89, 0.5)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(197, 160, 89, 0.2)',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
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
            fontSize: '32px',
            fontWeight: 900,
            color: '#ffffff',
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px',
            fontFamily: 'var(--font-cairo), system-ui, sans-serif',
          }}
        >
          حِكِمْدار
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#dfba73',
            margin: '0 0 24px 0',
            maxWidth: '320px',
            lineHeight: 1.6,
            fontFamily: 'var(--font-cairo), system-ui, sans-serif',
          }}
        >
          المنظومة الرقمية لإدارة القضايا والاستشارات القانونية
        </p>

        {/* Progress Bar Container */}
        <div
          style={{
            width: '200px',
            height: '4px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            className="splash-progress-bar"
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #9e7b36, #dfba73, #c5a059)',
              borderRadius: '9999px',
            }}
          />
        </div>

        {/* Status Text */}
        <span
          style={{
            fontSize: '11px',
            color: '#64748b',
            marginTop: '16px',
            fontFamily: 'var(--font-cairo), system-ui, sans-serif',
          }}
        >
          جاري تجهيز المنصة الذكية...
        </span>
      </div>
    </div>
  );
}
