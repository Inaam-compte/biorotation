import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['fr', 'ar'] as const;
export type Locale = typeof locales[number];

export default getRequestConfig(async ({ locale }) => {
  return {
    locale: locale || 'fr',
    messages: (await import(`./messages/${locale || 'fr'}.json`)).default
  };
});