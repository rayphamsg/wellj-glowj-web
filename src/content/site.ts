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
    zalo: null as string | null,
    messenger: null as string | null,
    facebook: null as string | null,
    instagram: null as string | null,
  },
} as const;
