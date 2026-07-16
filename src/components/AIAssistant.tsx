import React, { useState, useRef, useEffect } from "react";
import { Send, Terminal, Cpu, MessageSquare, AlertCircle, RefreshCw } from "lucide-react";
import { ChatMessage } from "../types";

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I am your Senior Java Developer Assistant. I can help you explain, debug, or extend your Dynamic Web project. Select a prompt below or ask me any question about Servlets, JSP, JDBC, or SQL."
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presets = [
    "Explain MVC Servlet flow",
    "How does JDBC prevent SQL Injection?",
    "Write a SearchMovie Servlet in Java",
    "Generate a Coupon Filter class"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    
    setError(null);
    const userMessage: ChatMessage = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch AI response.");
      }

      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.text }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-assistant-container" className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl mx-auto h-[600px] py-4">
      
      {/* Side Column: Preset Queries */}
      <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 rounded-lg">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Prompts</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Select an engineering preset below to automatically query the Gemini developer agent:
          </p>
          <div className="flex flex-col gap-2 pt-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(preset)}
                disabled={loading}
                className="w-full text-left text-xs bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 text-slate-300 hover:text-white py-3 px-4 rounded-xl transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                💡 {preset}
              </button>
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 flex items-center gap-1.5 leading-none">
          <Terminal className="w-3.5 h-3.5" /> Powered by Gemini 3.5 Flash Model
        </div>
      </div>

      {/* Main Panel: Chat Window */}
      <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <div>
              <h3 className="text-sm font-bold text-white">Java Developer Copilot</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Online • Diagnostic Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setMessages([{
              role: "assistant",
              content: "Hello! Let's start fresh. Ask me anything about Java Servlets, JDBC drivers, Tomcat server setups, or sql integrations."
            }])}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
          >
            <RefreshCw className="w-3 h-3" /> Clear Thread
          </button>
        </div>

        {/* Message Panel Scroll area */}
        <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-950/20">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-slate-900 text-slate-200 rounded-bl-none border border-slate-800/80"
                }`}
              >
                {/* Minimalist markdown simulation parser */}
                <div className="whitespace-pre-wrap font-sans">
                  {m.content.split("```").map((block, bIdx) => {
                    // Check if block is inside code blocks
                    if (bIdx % 2 !== 0) {
                      const lines = block.trim().split("\n");
                      const language = lines[0];
                      const code = lines.slice(1).join("\n");
                      return (
                        <div key={bIdx} className="bg-slate-950 border border-slate-800 rounded-xl my-3 overflow-hidden font-mono text-xs text-indigo-300">
                          <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider">
                            <span>{language || "code"}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(code)}
                              className="hover:text-white transition"
                            >
                              Copy Code
                            </button>
                          </div>
                          <pre className="p-4 overflow-x-auto text-left">
                            <code>{code}</code>
                          </pre>
                        </div>
                      );
                    }
                    return block;
                  })}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none px-6 py-4 flex items-center gap-3 text-sm text-slate-400 shadow-lg">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span>Analyzing codebase schemas...</span>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <strong>AI Request Failed:</strong> {error}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="p-4 border-t border-slate-800 bg-slate-900/40 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            placeholder="Ask about Servlets, SQL queries, or JSP setup guidelines..."
            className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/30 text-white p-3 rounded-xl transition duration-200 cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
