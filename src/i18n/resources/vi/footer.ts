import type { footer as en } from "../en/footer";

export const footer = {
  columns: {
    product: "Sản phẩm",
    company: "Công ty",
    resources: "Tài nguyên",
    legal: "Pháp lý",
  },
  links: {
    features: "Tính năng",
    pricing: "Bảng giá",
    about: "Giới thiệu",
    careers: "Tuyển dụng",
    blog: "Blog",
    contact: "Liên hệ",
    privacy: "Chính sách bảo mật",
    terms: "Điều khoản dịch vụ",
  },
  newsletter: {
    title: "Đừng bỏ lỡ tin tức",
    description: "Cập nhật sản phẩm và thông báo mới — không spam.",
    emailPlaceholder: "Nhập email của bạn",
    submit: "Đăng ký",
    successMessage: "Đăng ký thành công — cảm ơn bạn!",
  },
  copyright: "© {{year}} {{brand}}. Đã đăng ký bản quyền.",
  socialLabel: "Theo dõi {{brand}} trên {{platform}}",
} satisfies typeof en;
