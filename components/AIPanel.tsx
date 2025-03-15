"use client";

import React, { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import InputForm from "@/components/inputForm";
import Messages from "@/components/messages";
import { Message, useChat } from "ai/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIPanel: React.FC<AIPanelProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [interimText, setInterimText] = useState("");
  const { isLoading, stop } = useChat({ api: "api/ai" });
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [typingMessage, setTypingMessage] = useState("");
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);  const [isTyping, setIsTyping] = useState(false);
  const [fullResponse, setFullResponse] = useState("");

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Web Speech API is not supported");
      return;
    }

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = inputMessage;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.trim();
        if (event.results[i].isFinal) {
          if (finalTranscript && !finalTranscript.endsWith(" ")) {
            finalTranscript += " ";
          }
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setInputMessage(finalTranscript);
      setInterimText(interimTranscript);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognitionRef.current?.abort();
    };
  }, [inputMessage]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typingMessage]);

  const addMessage = (newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newMessage: Message = { id: `${Date.now()}`, content: inputMessage, role: "user" };
    addMessage(newMessage);
    setInputMessage("");
    setInterimText("");
    setTypingMessage("");
    setIsTyping(true);
    setFullResponse("");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      });

      if (response.ok) {
        const data = await response.json();
        let responseText = data.text;
        setFullResponse(responseText);
        let i = 0;
        typingIntervalRef.current = setInterval(() => {
          if (i <= responseText.length) {
            setTypingMessage(responseText.slice(0, i));
            i++;
          } else {
            clearInterval(typingIntervalRef.current!);
            setIsTyping(false);
            addMessage({ role: "assistant", content: responseText, id: `${Date.now() + 1}` });
            setTypingMessage("");
          }
        }, 40);
      }
    } catch (error) {
      setIsTyping(false);
      addMessage({ role: "assistant", content: "A network error occurred. Please try again.", id: `${Date.now() + 2}` });
    }
  };

  if (!isOpen) return null;

  return (
      <div className={`fixed bottom-0 right-0 m-4 w-80 shadow-lg rounded-lg p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <div className="flex justify-between items-start">
          <div className="text-left font-bold text-lg">Vorifi AI Chatbot</div>
          <button onClick={onClose} className="text-red-500">X</button>
        </div>
        <div className="overflow-y-auto h-64 mt-2">
          <Messages messages={[...messages, isTyping ? { role: "assistant", content: typingMessage, id: "typing" } : null].filter((msg): msg is Message => msg !== null)} isLoading={isLoading}/>
          <div ref={messagesEndRef}/>
        </div>
        <InputForm input={inputMessage + interimText} handleInputChange={handleInputChange} handleSubmit={handleSubmit} isLoading={isLoading} stop={stop} addMessage={addMessage} isDarkMode={isDarkMode}/>
      </div>
  );
};

export default AIPanel;