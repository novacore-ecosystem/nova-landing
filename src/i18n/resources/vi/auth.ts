import type { en } from "../en";

export const auth = {
  login: {
    title: "Đăng nhập",
    description: "Đăng nhập để trò chuyện trực tiếp với đội ngũ của chúng tôi.",
    email: "Email",
    emailPlaceholder: "ban@vidu.com",
    password: "Mật khẩu",
    submit: "Đăng nhập",
    genericError: "Đăng nhập không thành công — kiểm tra lại email và mật khẩu rồi thử lại.",
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
