/**
 * Company details used across the site. Values marked TODO still need confirming with Spotex
 * (see PROJECT-STATUS.md → "company se chahiye"). Day 2 moves these into admin settings.
 */
export const SITE = {
  name: 'Spotex International',
  logo: '/brand/logo.webp',
  address: {
    street: 'Sialkot Road, Sialkot Bypass, Sardar Town',
    city: 'Gujranwala',
    postalCode: '52250',
    country: 'Pakistan',
  },
  phone: '+92 55 320 33 33', // TODO: confirm (old site also lists …33 34)
  whatsapp: '923009648142',
  email: 'info@spotexint.com', // TODO: switch to the new domain's address
  foundedYear: 1989, // TODO: confirm
  stats: { staff: 50, clients: 100, departments: 10 }, // TODO: confirm staff and clients
} as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
