import React from "react";
import { 
  Bot, Plus, Trash2, FileText, CheckSquare, Compass, 
  Globe, Languages, Sparkles, MessageSquare, ChevronRight, X 
} from "lucide-react";
import { ChatSession, AppLanguage, AITool } from "../types";
import { MONGOLIAN_TOOLS } from "../toolsData";

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: (toolId?: string) => void;
  onDeleteSession: (id: string) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  language,
  setLanguage,
  isOpen,
  onClose,
}: SidebarProps) {
  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case "FileText":
        return <FileText className="w-4 h-4 text-purple-400" />;
      case "CheckSquare":
        return <CheckSquare className="w-4 h-4 text-emerald-400" />;
      case "Compass":
        return <Compass className="w-4 h-4 text-amber-400" />;
      case "Globe":
        return <Globe className="w-4 h-4 text-sky-400" />;
      case "Languages":
        return <Languages className="w-4 h-4 text-pink-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-72 lg:w-80 h-full border-r border-white/10 glass-panel transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 shadow-[0_0_15px_rgba(124,58,237,0.4)]">
              <Bot className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#090a14]" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl tracking-wide bg-gradient-to-r from-purple-400 via-blue-200 to-white bg-clip-text text-transparent cyber-glow">
                tengriX AI
              </h1>
              <p className="text-[10px] text-white/50 tracking-wider uppercase font-mono">
                {language === "mn" ? "Монгол чат хэрэгсэл" : "Mongolian AI Hub"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/5 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action: New Session */}
        <div className="p-4">
          <button
            id="btn-new-chat"
            onClick={() => {
              onNewSession();
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/20 glow-btn transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            {language === "mn" ? "Шинэ чат эхлэх" : "Start New Chat"}
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
          {/* Mongolian Tools Selection */}
          <div>
            <div className="px-2 mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span className="text-[11px] font-bold text-purple-300 uppercase tracking-widest font-display">
                {language === "mn" ? "Монгол Хэрэгслүүд" : "Mongolian AI Tools"}
              </span>
            </div>
            <div className="space-y-1">
              {MONGOLIAN_TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  id={`tool-btn-${tool.id}`}
                  onClick={() => {
                    onNewSession(tool.id);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl flex items-start gap-3 hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-purple-950/30 transition-colors">
                    {getToolIcon(tool.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white/95 group-hover:text-purple-300 transition-colors truncate">
                      {language === "mn" ? tool.nameMN : tool.nameEN}
                    </div>
                    <div className="text-[10px] text-white/50 line-clamp-1 group-hover:text-white/70">
                      {language === "mn" ? tool.descriptionMN : tool.descriptionEN}
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/30 self-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Chat Sessions History */}
          <div>
            <div className="px-2 mb-3 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px] font-bold text-blue-300 uppercase tracking-widest font-display">
                {language === "mn" ? "Чат Түүх" : "Recent Conversations"}
              </span>
            </div>
            {sessions.length === 0 ? (
              <div className="p-4 text-center rounded-xl bg-white/2 border border-dashed border-white/5">
                <p className="text-xs text-white/40">
                  {language === "mn" ? "Одоогоор чат түүх байхгүй байна." : "No chats yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {sessions.map((session) => {
                  const isActive = session.id === activeSessionId;
                  const matchingTool = MONGOLIAN_TOOLS.find(t => t.id === session.activeToolId);
                  
                  return (
                    <div
                      key={session.id}
                      className={`relative group rounded-xl border transition-all ${
                        isActive
                          ? "bg-purple-950/20 border-purple-500/30 text-purple-200"
                          : "border-transparent hover:bg-white/5 text-white/70 hover:text-white"
                      }`}
                    >
                      <button
                        id={`session-item-${session.id}`}
                        onClick={() => {
                          onSelectSession(session.id);
                          onClose();
                        }}
                        className="w-full text-left py-3 pl-3 pr-10 text-xs font-medium truncate flex items-center gap-2"
                      >
                        {matchingTool ? (
                          <div className="flex-shrink-0">
                            {getToolIcon(matchingTool.icon)}
                          </div>
                        ) : (
                          <MessageSquare className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        )}
                        <span className="truncate flex-1">
                          {session.title}
                        </span>
                      </button>
                      <button
                        id={`delete-session-${session.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                        title={language === "mn" ? "Устгах" : "Delete"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Sidebar Control Panel */}
        <div className="p-4 border-t border-white/10 bg-[#080914]/80 flex flex-col gap-3">
          {/* Language Switcher & Credits */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 font-mono">
              v1.2.0 • Active
            </span>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
              <button
                id="lang-mn"
                onClick={() => setLanguage("mn")}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  language === "mn"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/30"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Монгол
              </button>
              <button
                id="lang-en"
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  language === "en"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/30"
                    : "text-white/60 hover:text-white"
                }`}
              >
                English
              </button>
            </div>
          </div>
          <div className="text-[10px] text-white/30 text-center leading-relaxed">
            {language === "mn" 
              ? "tengriX • Олон хэлний туслах чатбот" 
              : "tengriX • Multi-language AI Assistant"}
          </div>
        </div>
      </div>
    </>
  );
}
