import React, { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Trash2, Moon, Sun, Copy, Check, Image, X, Paperclip } from "lucide-react";

// 🔐 AI Chat Function with image support
async function generateBotReply(messageHistory) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY" // Replace with your OpenAI API key
      },
      body: JSON.stringify({
        model: "gpt-4o", // Use gpt-4o for vision support
        messages: [
          {
            role: "system",
            content: "You are TriGardening AI assistant. You help with plant care, identifying plants, diagnosing problems, watering schedules, light requirements, soil, fertilizers, and recommendations. You can analyze plant images to identify species and diagnose issues. Answer clearly and simply. Be friendly and helpful."
          },
          ...messageHistory
        ],
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      return "I'm having trouble connecting right now. Please check your API key and try again.";
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
  } catch (err) {
    console.error("API fetch error:", err);
    return "Unable to connect to AI service. Please try again.";
  }
}

// Convert image file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [attachedImages, setAttachedImages] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    const initial = [
      {
        role: "assistant",
        type: "text",
        content: "Hi there! 👋 I'm your TriGardening AI Assistant.\n\nI can help you with:\n• 📸 Identify plants from photos\n• 🔍 Diagnose plant problems\n• 💧 Watering schedules and care tips\n• 🌱 Soil and fertilizer advice\n• ☀️ Light requirements\n• 💬 General gardening questions\n\nUpload a plant photo or ask me anything!",
        timestamp: new Date().toISOString()
      },
    ];
    setMessages(initial);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const imagePromises = files.map(async (file) => {
      if (!file.type.startsWith('image/')) return null;
      const base64 = await fileToBase64(file);
      return {
        file,
        preview: base64,
        name: file.name
      };
    });

    const images = (await Promise.all(imagePromises)).filter(Boolean);
    setAttachedImages(prev => [...prev, ...images]);
  };

  const removeImage = (index) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if ((!trimmed && attachedImages.length === 0) || loading) return;

    setInput("");
    setLoading(true);

    // Build user message content
    const userContent = [];
    
    if (trimmed) {
      userContent.push({
        type: "text",
        text: trimmed
      });
    }

    // Add images
    const imageData = [...attachedImages];
    imageData.forEach(img => {
      userContent.push({
        type: "image_url",
        image_url: {
          url: img.preview
        }
      });
    });

    // User message for display
    const userMessage = {
      role: "user",
      type: "mixed",
      content: trimmed,
      images: imageData.map(img => img.preview),
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setAttachedImages([]);

    // Prepare API message format
    const apiMessages = newMessages.map(m => {
      if (m.role === "assistant") {
        return {
          role: "assistant",
          content: m.content
        };
      } else {
        // User message
        const content = [];
        if (m.content) {
          content.push({ type: "text", text: m.content });
        }
        if (m.images && m.images.length > 0) {
          m.images.forEach(img => {
            content.push({
              type: "image_url",
              image_url: { url: img }
            });
          });
        }
        return {
          role: "user",
          content: content.length === 1 && content[0].type === "text" 
            ? content[0].text 
            : content
        };
      }
    });

    // Get AI reply
    const replyText = await generateBotReply(apiMessages);

    // Assistant message
    const assistantMessage = {
      role: "assistant",
      type: "text",
      content: replyText,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    const initial = [
      {
        role: "assistant",
        type: "text",
        content: "Chat cleared! ✨\n\nHow can I help you with your plants today? Upload a photo or ask me anything!",
        timestamp: new Date().toISOString()
      },
    ];
    setMessages(initial);
    setAttachedImages([]);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const quickPrompts = [
    "How often should I water my succulents?",
    "My plant leaves are turning yellow, what should I do?",
    "Best indoor plants for low light?",
    "What's wrong with my plant?"
  ];

  const bgClass = darkMode ? "bg-gray-900" : "bg-gradient-to-br from-emerald-50 via-white to-amber-50";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const textClass = darkMode ? "text-gray-100" : "text-gray-900";
  const mutedText = darkMode ? "text-gray-400" : "text-gray-600";
  const borderClass = darkMode ? "border-gray-700" : "border-gray-200";

  return (
    <div className={`w-full h-screen flex flex-col ${bgClass} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${cardBg} ${borderClass} border-b backdrop-blur-sm bg-opacity-90 sticky top-0 z-10 transition-colors duration-300`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className={`text-lg font-bold ${textClass}`}>TriGardening AI</h1>
                <p className={`text-xs ${mutedText}`}>Vision & Chat • GPT-4o</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl ${cardBg} ${borderClass} border hover:scale-105 transition-transform`}
                title={darkMode ? "Light mode" : "Dark mode"}
              >
                {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
              </button>
              <button
                onClick={handleClear}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl ${borderClass} border hover:scale-105 transition-all text-sm font-medium ${textClass}`}
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((m, idx) => {
            const isUser = m.role === "user";
            const showCopy = !isUser && m.content;

            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                  isUser 
                    ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg" 
                    : "bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg"
                }`}>
                  {isUser ? "👤" : "🤖"}
                </div>

                {/* Message bubble */}
                <div className={`flex-1 group ${isUser ? "flex justify-end" : ""}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                    isUser
                      ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white"
                      : `${cardBg} ${borderClass} border ${textClass}`
                  }`}>
                    {/* Images */}
                    {m.images && m.images.length > 0 && (
                      <div className="mb-3 grid grid-cols-2 gap-2">
                        {m.images.map((img, imgIdx) => (
                          <img
                            key={imgIdx}
                            src={img}
                            alt={`Uploaded ${imgIdx + 1}`}
                            className="rounded-lg w-full h-32 object-cover border-2 border-white/20"
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Text content */}
                    {m.content && (
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    )}
                    
                    {showCopy && (
                      <button
                        onClick={() => copyToClipboard(m.content, idx)}
                        className={`mt-2 flex items-center gap-1 text-xs ${mutedText} hover:text-emerald-600 transition-colors opacity-0 group-hover:opacity-100`}
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 animate-in fade-in">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg">
                🤖
              </div>
              <div className={`${cardBg} ${borderClass} border rounded-2xl px-4 py-3 flex items-center gap-2`}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
                <span className={`text-sm ${mutedText}`}>Analyzing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Quick prompts */}
      {messages.length === 1 && (
        <div className="px-4 pb-3">
          <div className="max-w-4xl mx-auto">
            <p className={`text-xs ${mutedText} mb-2 font-medium`}>Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInput(prompt)}
                  className={`text-xs ${cardBg} ${borderClass} border rounded-full px-4 py-2 hover:scale-105 hover:shadow-md transition-all ${textClass}`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <footer className={`${cardBg} ${borderClass} border-t backdrop-blur-sm bg-opacity-90 sticky bottom-0`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Attached images preview */}
          {attachedImages.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachedImages.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img.preview}
                    alt={img.name}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-emerald-500"
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className={`flex items-end gap-3 ${cardBg} ${borderClass} border rounded-2xl px-4 py-3 shadow-lg focus-within:ring-2 focus-within:ring-emerald-500 transition-all`}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''} transition-colors ${mutedText}`}
              title="Attach image"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <textarea
              ref={textareaRef}
              rows={1}
              className={`flex-1 text-[15px] bg-transparent resize-none focus:outline-none max-h-32 ${textClass}`}
              placeholder="Ask about plants or upload a photo..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            
            <button
              onClick={handleSend}
              disabled={(!input.trim() && attachedImages.length === 0) || loading}
              className="flex-shrink-0 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl px-5 py-2.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}