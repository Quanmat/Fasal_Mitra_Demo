import React from "react";
import { Language, Message } from "../../types/chatbot";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  onSpeak: (text: string, language: Language) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onSpeak,
}) => {
  return (
    <div
      className={`flex ${
        message.isUser ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-[80%] p-3 rounded-lg shadow-md backdrop-blur-sm ${
          message.isUser
            ? "bg-green-600/90 text-white"
            : "bg-white/80 text-green-800 border border-green-100"
        }`}
      >
        <p className={message.isUser ? "text-white/90" : "text-green-700/80"}>
          {message.text}
        </p>
        {!message.isUser && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-green-700 hover:text-green-800 hover:bg-green-50/50"
            onClick={() => onSpeak(message.text, message.language)}
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Listen
          </Button>
        )}
      </div>
    </div>
  );
};
