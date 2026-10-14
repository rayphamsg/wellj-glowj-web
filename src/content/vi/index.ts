import type { Dictionary } from "../types";

/**
 * Stage 1 Coming Soon copy (Vietnamese). Headline, support, category, field and
 * CTA are approved. The consent notice and the success/error messages are
 * DRAFT microcopy, not yet approved: replace them when the final wording is
 * provided (and add a new consent version; see src/lib/lead-capture/consent.ts).
 *
 * "Mix bù khoáng rạng ngời" is GlowJ's category phrase. It belongs to the
 * Vietnamese experience only and is never rendered by the English locale.
 */
export const vi: Dictionary = {
  meta: {
    title: "GlowJ — Mix bù khoáng rạng ngời",
    description: "Bù khoáng, cấp nước từ bên trong — cho vẻ ngoài tươi khỏe, rạng ngời mỗi ngày. Sắp ra mắt.",
  },
  header: { languageSwitchLabel: "English" },
  home: {
    eyebrow: "SẮP RA MẮT",
    headline: "Bù lại để luôn tươi.",
    headlineAccent: "tươi.",
    headlineLines: { wide: ["Bù lại để", "luôn tươi."], narrow: ["Bù lại", "để luôn", "tươi."] },
    support: {
      moments: ["Một ngày bận rộn.", "Một trận pickleball.", "Một buổi tập.", "Một chiều ngoài nắng."],
      body: "Cơ thể mất nước và khoáng chất nhiều hơn bạn nghĩ. GlowJ giúp bạn bù lại theo một cách tự nhiên hơn — để luôn tươi khỏe, rạng ngời.",
    },
    category: "GlowJ — Mix bù khoáng rạng ngời.",
    // Optional Zalo step after a successful signup (structure from the working IronJ flow). Wording from the brief.
    zalo: {
      title: "Kết nối Zalo",
      optional: "Tuỳ chọn",
      open: "Mở Zalo",
      scanHint: "Theo dõi GlowJ trên Zalo để nhận tin ra mắt và ưu đãi đầu tiên.",
      qrAlt: "Mã QR mở Zalo của GlowJ",
    },
  },
  signup: {
    label: "Số Zalo của bạn",
    submitLabel: "Nhắn tôi khi GlowJ ra mắt",
    // DRAFT, not approved.
    consentNotice: "Bằng việc gửi số Zalo, bạn đồng ý để GlowJ liên hệ với bạn về lần ra mắt.",
    // Confirmation from the approved after-submit flow (shown in capitals).
    successMessage: "Đã ghi nhận.",
    errorMessages: {
      // DRAFT, not approved.
      invalid: "Số Zalo chưa đúng. Bạn kiểm tra lại giúp mình nhé.",
      // DRAFT, not approved.
      unavailable: "Hiện chưa gửi được. Bạn thử lại sau ít phút nhé.",
    },
  },
};
