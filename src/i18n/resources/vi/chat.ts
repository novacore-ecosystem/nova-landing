import type { chat as en } from "../en/chat";

export const chat = {
  launcher: {
    open: "Trò chuyện với chúng tôi",
    close: "Đóng trò chuyện",
  },
  intro: {
    title: "Bắt đầu trò chuyện",
    description: "Cho chúng tôi biết một chút về bạn để kết nối với đội ngũ hỗ trợ.",
  },
  form: {
    namePlaceholder: "Tên của bạn",
    phonePlaceholder: "Số điện thoại",
    emailPlaceholder: "Email (không bắt buộc)",
    reasonPlaceholder: "Bạn cần hỗ trợ gì? (không bắt buộc)",
    submit: "Bắt đầu trò chuyện",
    nameAndPhoneRequired: "Vui lòng nhập tên và số điện thoại.",
  },
  conversation: {
    messagePlaceholder: "Nhập tin nhắn…",
    send: "Gửi",
    sent: "Đã gửi",
    typing: "Đang nhập…",
  },
  errors: {
    startFailed: "Không thể bắt đầu trò chuyện. Vui lòng thử lại sau.",
    sendFailed: "Gửi tin nhắn thất bại — phiên của bạn có thể đã hết hạn.",
  },
} satisfies typeof en;
