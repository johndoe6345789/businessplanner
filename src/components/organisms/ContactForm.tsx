'use client';

/**
 * @file ContactForm.tsx
 * @brief Contact form that posts to POST /api/contact.
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import { useContactForm }
  from '@/hooks/useContactForm';
import {
  FIELD, LABEL, INPUT, BTN,
} from './contactFormStyles';

/**
 * Contact form with name, email, and message fields.
 * @returns ContactForm UI.
 */
export const ContactForm: React.FC = () => {
  const t = useTranslations('contact');
  const vm = useContactForm();

  if (vm.status === 'sent') {
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
      onSubmit={(e) =>
        void vm.handleSubmit(e)}
      style={{ display: 'flex',
        flexDirection: 'column', gap: 20 }}
      data-testid="contact-form"
    >
      <div style={FIELD}>
        <label style={LABEL}>{t('name')}</label>
        <input style={INPUT} required
          value={vm.name}
          onChange={(e) =>
            vm.setName(e.target.value)}
          data-testid="contact-name" />
      </div>
      <div style={FIELD}>
        <label style={LABEL}>{t('email')}</label>
        <input style={INPUT} type="email"
          required value={vm.email}
          onChange={(e) =>
            vm.setEmail(e.target.value)}
          data-testid="contact-email" />
      </div>
      <div style={FIELD}>
        <label style={LABEL}>{t('message')}</label>
        <textarea
          style={{
            ...INPUT,
            resize: 'vertical',
            minHeight: 120,
          }}
          required value={vm.message}
          onChange={(e) =>
            vm.setMessage(e.target.value)}
          data-testid="contact-message" />
      </div>
      <button type="submit" style={BTN}
        disabled={vm.status === 'sending'}
        data-testid="contact-submit"
      >
        {vm.status === 'sending'
          ? t('sending') : t('send')}
      </button>
    </form>
  );
};

export default ContactForm;
