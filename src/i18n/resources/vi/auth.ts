import type { en } from "../en";

export const auth = {
  login: {
    title: "Đăng nhập",
    description: "Đăng nhập để trò chuyện trực tiếp với đội ngũ của chúng tôi.",
    email: "Email",
    emailPlaceholder: "ban@vidu.com",
    password: "Mật khẩu",
    submit: "Đăng nhập",
  },
  validation: {
    emailRequired: "Vui lòng nhập email",
    emailInvalid: "Email không hợp lệ",
    passwordRequired: "Vui lòng nhập mật khẩu",
  },
  nav: {
    login: "Đăng nhập",
    logout: "Đăng xuất",
  },
  theme: {
    light: "Sáng",
    dark: "Tối",
    system: "Hệ thống",
    toggleLabel: "Chuyển giao diện",
  },
} satisfies typeof en.auth;
