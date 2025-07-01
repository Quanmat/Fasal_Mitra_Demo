import { Language, Message } from "@/types/chatbot";
import WebSocketHandler from "./websockets";

export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getWelcomeMessage(language: Language): Message {
  const welcomeMessages = {
    en: "Hello! How can I assist you with contract farming today?",
    hi: "नमस्ते! आज मैं अनुबंध खेती के बारे में आपकी कैसे मदद कर सकता हूं?",
    gu: "નમસ્તે! આજે હું કરાર ખેતી વિશે તમને કેવી રીતે મદદ કરી શકું?",
  };

  return {
    id: generateUniqueId(),
    text: welcomeMessages[language],
    isUser: false,
    language,
  };
}

export const translateMessage = async (
  text: string,
  sourceLang: string,
  targetLang: string
) => {
  console.log(`Translating "${text}" from ${sourceLang} to ${targetLang}`);
  const response = await fetch(
    `https://lingva.ml/api/v1/${sourceLang}/${targetLang}/${encodeURIComponent(
      text
    )}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log("Translation data:", data);
  console.log("Translated text:", data.translation);
  return data.translation;
};

const translateToEnglish = async (text: string, sourceLang: string) => {
  try {
    console.log("Translating to English:", text, "from", sourceLang);
    const result = await translateMessage(text, sourceLang, "en");
    return result;
  } catch (error) {
    console.error("Translation failed", error);
    return text; // fallback to the original text
  }
};

export const sendMessage = async (
  input: string,
  language: Language,
  webSocketConnection: WebSocketHandler
) => {
  if (input.trim()) {
    const translatedText =
      language !== "en" ? await translateToEnglish(input, language) : input;
    console.log("Sending message:", translatedText, "in lang", language);
    webSocketConnection?.sendMessage(translatedText, language);
  }
};
