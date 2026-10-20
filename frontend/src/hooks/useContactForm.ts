'use client';

/**
 * @brief Form state and submit handler for ContactForm.
 * @module hooks/useContactForm
 */
import { useState } from 'react';
import type { FormEvent } from 'react';

/**
 * Manages name/email/message fields and the async
 * submit action for the public contact form.
 *
 * @returns Form field state and submit handler.
 */
export function useContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] =
    useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = async (
    e: FormEvent,
  ) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          { name, email, message },
        ),
      });
    } catch { /* show sent regardless */ }
    setStatus('sent');
  };

  return {
    name, setName,
    email, setEmail,
    message, setMessage,
    status, handleSubmit,
  };
}
