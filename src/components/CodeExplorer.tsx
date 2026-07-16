import React, { useState } from "react";
import { Folder, File, Code, Copy, Check, Edit2, CheckSquare, X, Info } from "lucide-react";
import { JavaFile } from "../types";

interface CodeExplorerProps {
  files: JavaFile[];
  onUpdateFile: (path: string, newContent: string) => void;
}

export default function CodeExplorer({ files, onUpdateFile }: CodeExplorerProps) {
  const [activeFilePath, setActiveFilePath] = useState<string>("db/schema.sql");
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBuffer, setEditBuffer] = useState("");

  // Active file object
  const activeFile = files.find(f => f.path === activeFilePath) || files[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartEdit = () => {
    setEditBuffer(activeFile.content);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onUpdateFile(activeFile.path, editBuffer);
    setIsEditing(false);
  };

  // Nesting categorizer for project tree
  const folders = [
    {
      name: "Database Scripts",
      icon: Folder,
      files: files.filter(f => f.path.startsWith("db/"))
    },
    {
      name: "com.moviebook.model",
      icon: Folder,
      files: files.filter(f => f.path.startsWith("src/main/java/com/moviebook/model/"))
    },
    {
      name: "com.moviebook.dao",
      icon: Folder,
      files: files.filter(f => f.path.startsWith("src/main/java/com/moviebook/dao/"))
    },
    {
      name: "com.moviebook.servlet",
      icon: Folder,
      files: files.filter(f => f.path.startsWith("src/main/java/com/moviebook/servlet/"))
    },
    {
      name: "webapp Layout (JSPs)",
      icon: Folder,
      files: files.filter(f => f.path.startsWith("src/main/webapp/") && !f.path.includes("WEB-INF"))
    },
    {
      name: "webapp WEB-INF",
      icon: Folder,
      files: files.filter(f => f.path.includes("WEB-INF"))
    },
    {
      name: "Project Root Configs",
      icon: Folder,
      files: files.filter(f => f.path === "README.md")
    }
  ];

  const getCleanFileName = (path: string) => {
    const parts = path.split("/");
    return parts[parts.length - 1];
  };

  return (
    <div id="code-explorer-container" className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl mx-auto py-4 h-[650px]">
      
      {/* Directory File Tree Column */}
      <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col overflow-y-auto shadow-xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>📂</span> Project Workspace
            </h3>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 py-0.5 px-2 rounded-full font-mono">
              Java Web
            </span>
          </div>

          <div className="space-y-3">
            {folders.map((folder, fIdx) => (
              <div key={fIdx} className="space-y-1">
                <div className="flex items-center gap-2 px-1 py-1 text-xs font-semibold text-slate-400 tracking-wide select-none">
                  <folder.icon className="w-4 h-4 text-indigo-400" />
                  <span>{folder.name}</span>
                </div>
                <div className="pl-3 border-l border-slate-800 space-y-0.5 ml-3">
                  {folder.files.map((file, fileIdx) => {
                    const isSelected = file.path === activeFilePath;
                    return (
                      <button
                        key={fileIdx}
                        onClick={() => {
                          setActiveFilePath(file.path);
                          setIsEditing(false);
                        }}
                        className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition select-none cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/25"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
                        }`}
                      >
                        <File className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{getCleanFileName(file.path)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Screen View Area Column */}
      <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl">
        
        {/* Editor Toolbar Header */}
        <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-indigo-400">⚡</span>
              <h4 className="text-sm font-mono text-white tracking-tight">{activeFile.path}</h4>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <Info className="w-3 h-3 flex-shrink-0" /> {activeFile.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-bold py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5" /> Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleStartEdit}
                  className="bg-slate-800 hover:bg-slate-700 text-xs text-indigo-400 hover:text-white font-bold py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit File
                </button>
                <button
                  onClick={handleCopyCode}
                  className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white font-bold py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Code Content Screen View / Textarea Edit Block */}
        <div className="flex-grow bg-slate-950 p-4 font-mono text-xs overflow-y-auto relative">
          {isEditing ? (
            <textarea
              value={editBuffer}
              onChange={(e) => setEditBuffer(e.target.value)}
              className="w-full h-full bg-transparent text-indigo-200 font-mono text-xs p-2 border-0 outline-none resize-none focus:ring-0 leading-relaxed"
              spellCheck="false"
            />
          ) : (
            <div className="flex h-full select-text">
              {/* Line numbering sidebar gutter */}
              <div className="text-slate-600 text-right pr-4 border-r border-slate-900 select-none w-10 shrink-0 text-xs leading-6">
                {activeFile.content.split("\n").map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <pre className="pl-4 text-slate-300 overflow-x-auto text-xs leading-6 select-text w-full">
                <code>{activeFile.content}</code>
              </pre>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
