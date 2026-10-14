/**
 * Language-independent brand facts. Values marked PLACEHOLDER have not been
 * provided yet; never present them as final. No brand copy belongs here.
 */
export const site = {
  name: "GlowJ",
  parent: "WellJ",
  fullName: "GlowJ by WellJ",
  url: "https://drinkglowj.com",
  // PLACEHOLDER: contact and social links not provided yet.
  contactEmail: null as string | null,
  social: {
    // The real GlowJ Zalo Official Account link (https://zalo.me/...) and a QR image of that same link
    // (a file in public/brand/, e.g. "/brand/glowj-zalo-qr.png"). Not provided yet. The post-signup Zalo
    // step appears automatically once BOTH are set, and is not rendered at all until then. Never invent either.
    zalo: null as string | null,
    zaloQr: null as string | null,
    messenger: null as string | null,
    facebook: null as string | null,
    instagram: null as string | null,
  },
} as const;
