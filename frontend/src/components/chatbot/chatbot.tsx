"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Mic, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageBubble } from "./MessageBubble";
import { Language, Message, ChatbotProps } from "@/types/chatbot";
import {
  getWelcomeMessage,
  generateUniqueId,
  sendMessage,
  translateMessage,
} from "@/helpers/chatbotUtils";
import WebSocketHandler, { getWebSocketConnection } from "@/helpers/websockets";

export const ChatBot: React.FC<ChatbotProps> = ({ initialLanguage = "en" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [webSocketConnection, setWebSocketConnection] =
    useState<WebSocketHandler | null>(null);

  const recognition = useRef<SpeechRecognition | null>(null);
  const synthesis = useRef<SpeechSynthesis | null>(null);

  const addMessage = async (message: string) => {
    const translatedMessage = await translateMessage(message, "en", language);
    const messageObj: Message = {
      id: generateUniqueId(),
      text: translatedMessage,
      isUser: false,
      language,
    };
    setMessages((prev) => [...prev, messageObj]);
    speakMessage(translatedMessage, language);
  };

  useEffect(() => {
    setMessages([getWelcomeMessage(language)]);
    getWebSocketConnection(addMessage).then((conn) => {
      setWebSocketConnection(conn);
    });
  }, [language]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        recognition.current.lang = language === "en" ? "en-US" : "hi-IN";

        recognition.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join("");

          setInput(transcript);
        };
      }

      synthesis.current = window.speechSynthesis;
    }
  }, [language]);

  const handleSend = () => {
    if (input.trim()) {
      const userMessage: Message = {
        id: generateUniqueId(),
        text: input,
        isUser: true,
        language,
      };
      sendMessage(input, language, webSocketConnection!);
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
    }
  };

  const toggleListening = () => {
    if (recognition.current) {
      if (isListening) {
        recognition.current.stop();
      } else {
        recognition.current.start();
      }
      setIsListening(!isListening);
    }
  };

  const speakMessage = (text: string, lang: Language) => {
    if (synthesis.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "en" ? "en-US" : lang;
      console.log("Speaking:", text, "in lang", utterance.lang);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      synthesis.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthesis.current) {
      synthesis.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed right-4 w-[80%] lg:w-[35%] z-50 max-h-[50vh] md:max-h-[70vh]"
          >
            <Card className="border-2 border-blue-200 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-green-100">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-800">
                    Fasal Mitra Chat
                  </span>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={language}
                      onValueChange={(value: Language) => setLanguage(value)}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">हिंदी</SelectItem>
                        <SelectItem value="gu">ગુજરાતી</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-6 w-6 text-blue-800" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[80vh] md:h-[70vh] flex flex-col relative">
                <div className="flex-grow h-[80vh] md:h-[70vh] overflow-y-scroll p-4 space-y-4 relative z-10 chat-window">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      onSpeak={speakMessage}
                    />
                  ))}
                </div>
                <div className="flex items-center mt-4 relative z-10">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      language === "en"
                        ? "Type your message..."
                        : "अपना संदेश लिखें..."
                    }
                    className="flex-grow mr-2"
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  />
                  <Button
                    onClick={toggleListening}
                    className={`mr-2 ${
                      isListening
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleSend}
                    className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white transition-all duration-200 ease-in-out transform hover:scale-105"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          <MessageSquare className="h-8 w-8" />
        </Button>
      </motion.div>
      {isSpeaking && (
        <Button
          onClick={stopSpeaking}
          className="fixed bottom-4 left-4 z-50 bg-red-500 hover:bg-red-600"
        >
          <VolumeX className="h-4 w-4 mr-2" />
          Stop Speaking
        </Button>
      )}
    </>
  );
};
