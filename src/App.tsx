import React, { useState } from "react";
import { Film, Code, BookOpen, Sparkles, Terminal, Download, ShieldCheck } from "lucide-react";
import { javaProjectFiles } from "./java_project_data";
import { JavaFile } from "./types";
import LiveSimulator from "./components/LiveSimulator";
import CodeExplorer from "./components/CodeExplorer";
import SetupGuide from "./components/SetupGuide";
import AIAssistant from "./components/AIAssistant";

type TabType = "simulator" | "code" | "guide" | "assistant";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("simulator");
  const [editableFiles, setEditableFiles] = useState<JavaFile[]>(javaProjectFiles);

  // Callback to persist file updates inside memory state
  const handleUpdateFile = (path: string, newContent: string) => {
    setEditableFiles(prev =>
      prev.map(file => (file.path === path ? { ...file, content: newContent } : file))
    );
  };

  // Trigger Dynamic ZIP build
  const handleBulkZipDownload = async () => {
    try {
      const response = await fetch("/api/download-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: editableFiles })
      });

      if (!response.ok) {
        throw new Error("Dynamic compilation failed on Express backend.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "java_movie_booking_system.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error: Could not pack file system zip.");
    }
  };

  return (
    <div id="app-root-wrapper" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      
      {/* Top Banner Branding Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 justify-center md:justify-start">
              <span className="text-indigo-500">☕</span> Java Movie Booking Workspace
            </h1>
            <p className="text-xs text-slate-400">
              Complete dynamic MVC Java Servlets, JSPs, JDBC, and MySQL project hub & sandbox simulator.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleBulkZipDownload}
              className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition duration-200 cursor-pointer shadow-lg shadow-indigo-500/20"
            >
              <Download className="w-3.5 h-3.5" /> Download Project ZIP
            </button>
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-[10px] text-slate-400 font-mono leading-none">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Full Code Output</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Tab Controller Bar */}
      <div className="bg-slate-950 border-b border-slate-900/50 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            
            <button
              onClick={() => setActiveTab("simulator")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "simulator"
                  ? "bg-slate-900 text-white border border-slate-800 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Film className="w-4 h-4 text-indigo-500" />
              <span>🎬 Live Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab("code")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "code"
                  ? "bg-slate-900 text-white border border-slate-800 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Code className="w-4 h-4 text-sky-400" />
              <span>📂 Java Source Files</span>
            </button>

            <button
              onClick={() => setActiveTab("guide")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "guide"
                  ? "bg-slate-900 text-white border border-slate-800 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>📖 Local Setup Guide</span>
            </button>

            <button
              onClick={() => setActiveTab("assistant")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "assistant"
                  ? "bg-slate-900 text-white border border-slate-800 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>💬 AI Coding Copilot</span>
            </button>

          </div>
        </div>
      </div>

      {/* Main Tab Routing Area Content */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-grow">
        {activeTab === "simulator" && (
          <div className="animate-fade-in">
            <LiveSimulator />
          </div>
        )}
        
        {activeTab === "code" && (
          <div className="animate-fade-in">
            <CodeExplorer files={editableFiles} onUpdateFile={handleUpdateFile} />
          </div>
        )}

        {activeTab === "guide" && (
          <div className="animate-fade-in">
            <SetupGuide />
          </div>
        )}

        {activeTab === "assistant" && (
          <div className="animate-fade-in">
            <AIAssistant />
          </div>
        )}
      </main>

      {/* Page Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-2">
          <p>🎬 Java Movie Ticket Booking System - Workspace & Sandbox Simulator.</p>
          <p className="text-[10px] text-slate-600">
            Powered by Java MVC, JSP 4.0, JDBC standard API, and MySQL server specifications.
          </p>
        </div>
      </footer>

    </div>
  );
}
