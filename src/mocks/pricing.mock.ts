import type { LandingLocale } from "@/i18n/locale";

/**
 * Isolated mock pricing data — WCM has no pricing/plan content type at all (see cerebrum's WCM
 * findings). TODO: Add WCM backend support for a pricing-plan content type once billing plans
 * become a real, admin-configurable concept.
 */
export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const PLANS: Record<LandingLocale, PricingPlan[]> = {
  en: [
    {
      id: "starter",
      name: "Starter",
      price: "$0",
      description: "For trying things out.",
      features: ["1 site", "Community support", "Basic analytics"],
    },
    {
      id: "growth",
      name: "Growth",
      price: "$49",
      description: "For teams ready to launch for real.",
      features: ["5 sites", "Priority support", "Live chat included", "Custom domain"],
      highlighted: true,
    },
    {
      id: "scale",
      name: "Scale",
      price: "$149",
      description: "For businesses that need more.",
      features: ["Unlimited sites", "Dedicated support", "SSO", "Custom integrations"],
    },
  ],
  vi: [
    {
      id: "starter",
      name: "Starter",
      price: "0₫",
      description: "Dành cho việc trải nghiệm thử.",
      features: ["1 trang web", "Hỗ trợ cộng đồng", "Thống kê cơ bản"],
    },
    {
      id: "growth",
      name: "Growth",
      price: "1.190.000₫",
      description: "Dành cho đội ngũ sẵn sàng ra mắt thật.",
      features: ["5 trang web", "Hỗ trợ ưu tiên", "Tích hợp trò chuyện trực tiếp", "Tên miền riêng"],
      highlighted: true,
    },
    {
      id: "scale",
      name: "Scale",
      price: "3.590.000₫",
      description: "Dành cho doanh nghiệp cần nhiều hơn.",
      features: ["Không giới hạn trang web", "Hỗ trợ riêng", "Đăng nhập một lần (SSO)", "Tích hợp tuỳ chỉnh"],
    },
  ],
};

export function getMockPricingPlans(locale: LandingLocale): PricingPlan[] {
  return PLANS[locale];
}
