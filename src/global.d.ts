import type messages from './messages/en.json';
import type { routing } from './i18n/routing';

// Type-safe translations: a missing or misspelled message key is a compile error.
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
