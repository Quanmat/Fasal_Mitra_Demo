export type Language = "en" | "hi" | "gu";

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  language: Language;
}

export interface ChatbotProps {
  initialLanguage?: Language;
}
