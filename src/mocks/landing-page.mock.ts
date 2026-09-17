import type { LandingLocale } from "@/i18n/locale";

/**
 * Mock content for the homepage's data-driven sections (stats, features, testimonials) — isolated
 * here, behind the plain functions below, precisely so this file is the only thing that changes
 * once a real source exists.
 *
 * TODO: nova-wcm has no page-builder/section model today (no stats/feature/testimonial content
 * types at all — see cerebrum's WCM findings). Replace these functions' bodies with real WCM/API
 * calls once that capability ships; every call site already consumes this same shape.
 */

export interface StatItem {
  value: string;
  label: string;
}

export interface FeatureItem {
  title: string;
  description: string;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const STATS: Record<LandingLocale, StatItem[]> = {
  en: [
    { value: "12k+", label: "Teams onboarded" },
    { value: "99.95%", label: "Uptime SLA" },
    { value: "4.9/5", label: "Average rating" },
    { value: "24/7", label: "Human support" },
  ],
  vi: [
    { value: "12k+", label: "Đội ngũ đã sử dụng" },
    { value: "99.95%", label: "Cam kết uptime" },
    { value: "4.9/5", label: "Đánh giá trung bình" },
    { value: "24/7", label: "Hỗ trợ trực tiếp" },
  ],
};

const FEATURES: Record<LandingLocale, FeatureItem[]> = {
  en: [
    { title: "Launch in minutes", description: "A production-ready site from day one — no infrastructure to wire up yourself." },
    { title: "Built for every device", description: "Mobile-first layouts that hold up from a phone to a wide desktop monitor." },
    { title: "SEO from the ground up", description: "Server-rendered pages, structured data, and metadata that search engines can actually read." },
    { title: "Real-time chat, included", description: "Talk to visitors the moment they land — no separate tool to bolt on later." },
    { title: "Speaks your customers' language", description: "Bilingual content out of the box, ready for the markets you serve next." },
    { title: "Grows with your business", description: "Add sections, swap branding, and connect real data without a rebuild." },
  ],
  vi: [
    { title: "Ra mắt chỉ trong vài phút", description: "Một website sẵn sàng vận hành ngay từ ngày đầu — không cần tự dựng hạ tầng." },
    { title: "Tối ưu cho mọi thiết bị", description: "Bố cục mobile-first, hiển thị tốt từ điện thoại đến màn hình desktop lớn." },
    { title: "Chuẩn SEO ngay từ đầu", description: "Trang được render phía server, có dữ liệu có cấu trúc và metadata mà công cụ tìm kiếm đọc được." },
    { title: "Tích hợp sẵn trò chuyện trực tiếp", description: "Trò chuyện với khách truy cập ngay khi họ vào trang — không cần công cụ rời." },
    { title: "Nói ngôn ngữ của khách hàng", description: "Nội dung song ngữ sẵn sàng, dễ mở rộng sang các thị trường tiếp theo." },
    { title: "Phát triển cùng doanh nghiệp", description: "Thêm mục mới, đổi thương hiệu và kết nối dữ liệu thật mà không cần làm lại." },
  ],
};

const TESTIMONIALS: Record<LandingLocale, TestimonialItem[]> = {
  en: [
    { quote: "We had a client-ready site in an afternoon — and it actually ranks.", name: "Priya Shah", role: "Head of Marketing" },
    { quote: "The chat widget alone paid for itself in the first week.", name: "Marcus Lee", role: "Founder" },
    { quote: "Finally a demo that didn't need a rebuild once we signed the client.", name: "Elena Petrova", role: "Agency Owner" },
  ],
  vi: [
    { quote: "Chúng tôi có một website sẵn sàng giới thiệu khách hàng chỉ trong một buổi chiều — và nó thực sự lên hạng tìm kiếm.", name: "Priya Shah", role: "Trưởng phòng Marketing" },
    { quote: "Chỉ riêng widget trò chuyện đã đáng giá ngay trong tuần đầu tiên.", name: "Marcus Lee", role: "Nhà sáng lập" },
    { quote: "Cuối cùng cũng có một bản demo không cần làm lại sau khi ký hợp đồng với khách hàng.", name: "Elena Petrova", role: "Chủ agency" },
  ],
};

const FAQS: Record<LandingLocale, FaqItem[]> = {
  en: [
    {
      id: "trial",
      question: "Is there a free trial?",
      answer: "Yes — every plan starts with a 14-day free trial, no credit card required.",
    },
    {
      id: "switch-plans",
      question: "Can I change plans later?",
      answer: "Absolutely. Upgrade, downgrade, or cancel at any time from your account settings.",
    },
    {
      id: "languages",
      question: "Which languages are supported?",
      answer: "The site ships with English and Vietnamese today, with more locales straightforward to add.",
    },
    {
      id: "support",
      question: "How do I reach support?",
      answer: "Use the chat widget in the corner of this page — a real person is on the other end.",
    },
  ],
  vi: [
    {
      id: "trial",
      question: "Có bản dùng thử miễn phí không?",
      answer: "Có — mọi gói đều có 14 ngày dùng thử miễn phí, không cần thẻ tín dụng.",
    },
    {
      id: "switch-plans",
      question: "Tôi có thể đổi gói sau này không?",
      answer: "Hoàn toàn được. Bạn có thể nâng cấp, hạ cấp hoặc huỷ bất cứ lúc nào trong phần cài đặt tài khoản.",
    },
    {
      id: "languages",
      question: "Trang web hỗ trợ những ngôn ngữ nào?",
      answer: "Hiện tại trang web hỗ trợ tiếng Anh và tiếng Việt, có thể mở rộng thêm ngôn ngữ khác dễ dàng.",
    },
    {
      id: "support",
      question: "Làm sao để liên hệ hỗ trợ?",
      answer: "Sử dụng khung chat ở góc trang — sẽ có người thật trả lời bạn.",
    },
  ],
};

export function getMockFaqs(locale: LandingLocale): FaqItem[] {
  return FAQS[locale];
}

export function getMockStats(locale: LandingLocale): StatItem[] {
  return STATS[locale];
}

export function getMockFeatures(locale: LandingLocale): FeatureItem[] {
  return FEATURES[locale];
}

export function getMockTestimonials(locale: LandingLocale): TestimonialItem[] {
  return TESTIMONIALS[locale];
}
