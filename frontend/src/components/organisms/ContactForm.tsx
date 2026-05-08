'use client';

/**
 * @file ContactForm.tsx
 * @brief Contact form that posts to POST /api/contact.
 */
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

const FIELD: React.CSSProperties = {
  display: 'flex', flexDirection: 'column' as const,
  gap: 6,
};
const LABEL: React.CSSProperties = {
  fontSize: 13, fontWeight: 600,
  color: 'var(--mat-sys-on-surface-variant)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};
const INPUT: React.CSSProperties = {
  padding: '10px 12px', borderRadius: 8,
  border: '1px solid var(--mat-sys-outline-variant)',
  background: 'color-mix(in srgb, var(--mat-sys-on-surface) 4%, transparent)',
  color: 'var(--mat-sys-on-surface)',
  fontSize: 14, outline: 'none', fontFamily: 'inherit',
};
const BTN: React.CSSProperties = {
  padding: '10px 28px', borderRadius: 999,
  background: 'var(--mat-sys-primary)',
  color: 'var(--mat-sys-on-primary)',
  border: 'none', cursor: 'pointer',
  fontSize: 14, fontWeight: 600,
  alignSelf: 'flex-start',
};

/**
 * Contact form with name, email, and message fields.
 */
export const ContactForm: React.FC = () => {
  const t = useTranslations('contact');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] =
    useState<'idle'|'sending'|'sent'>('idle');

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
    } catch { /* show sent anyway */ }
    setStatus('sent');
  };

  if (status === 'sent') {
    return (
      <p
        style={{ color: 'var(--mat-sys-primary)',
          fontWeight: 600 }}
        data-testid="contact-sent"
      >
        {t('sent')}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
      data-testid="contact-form"
    >
      <div style={FIELD}>
        <label style={LABEL}>{t('name')}</label>
        <input style={INPUT} required value={name}
          onChange={e => setName(e.target.value)}
          data-testid="contact-name" />
      </div>
      <div style={FIELD}>
        <label style={LABEL}>{t('email')}</label>
        <input style={INPUT} type="email" required
          value={email}
          onChange={e => setEmail(e.target.value)}
          data-testid="contact-email" />
      </div>
      <div style={FIELD}>
        <label style={LABEL}>{t('message')}</label>
        <textarea
          style={{ ...INPUT, resize: 'vertical' as const,
            minHeight: 120 }}
          required value={message}
          onChange={e => setMessage(e.target.value)}
          data-testid="contact-message" />
      </div>
      <button type="submit" style={BTN}
        disabled={status === 'sending'}
        data-testid="contact-submit"
      >
        {status === 'sending' ? t('sending') : t('send')}
      </button>
    </form>
  );
};

export default ContactForm;
