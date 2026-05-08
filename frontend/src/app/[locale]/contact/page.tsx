import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Container, Typography }
  from '@shared/m3';
import { ContactForm }
  from '@/components/organisms/ContactForm';

/** Skip static prerendering — avoids manifest write races. */
export const dynamic = 'force-dynamic';

/** Props for the contact page. */
interface ContactPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Contact page with name / email / message form.
 *
 * @param props - Page props with locale.
 * @returns Contact page UI.
 */
export default async function ContactPage({
  params,
}: ContactPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  return (
    <Container
      maxWidth="sm"
      component="main"
      data-testid="contact-page"
    >
      <Box sx={{ py: 6 }}>
        <Typography
          variant="h4" component="h1"
          gutterBottom fontWeight={800}
        >
          {t('title')}
        </Typography>
        <Box sx={{ mt: 3 }}>
          <ContactForm />
        </Box>
      </Box>
    </Container>
  );
}
