import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, Send, Sparkles, Volume2, VolumeX, Menu, Copy, Check, 
  Trash2, HelpCircle, CornerDownLeft, RefreshCw, Compass, BookOpen,
  Languages, GraduationCap, ChevronRight, MessageSquare, BookText
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import Sidebar from "./components/Sidebar";
import { ChatSession, Message, AppLanguage, AITool } from "./types";
import { MONGOLIAN_TOOLS } from "./toolsData";

const STORAGE_KEY = "tengrix_chats_sessions";
const SETTINGS_KEY = "tengrix_settings";

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [language, setLanguage] = useState<AppLanguage>("mn");
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
        } else {
          initDefaultSession();
        }
      } else {
        initDefaultSession();
      }
    } catch (e) {
      console.error("Error loading sessions:", e);
      initDefaultSession();
    }

    try {
      const storedSettings = localStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.speechEnabled !== undefined) setSpeechEnabled(parsed.speechEnabled);
      }
    } catch (e) {
      console.error("Error loading settings:", e);
    }
  }, []);

  // Save to localStorage when sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  // Save settings when they change
  useEffect(() => {
    localStorage.setItem(
      SETTINGS_KEY, 
      JSON.stringify({ language, speechEnabled })
    );
  }, [language, speechEnabled]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, activeSessionId, loading]);

  const initDefaultSession = () => {
    const defaultId = `session-${Date.now()}`;
    const defaultSession: ChatSession = {
      id: defaultId,
      title: language === "mn" ? "Ерөнхий харилцан яриа" : "General Chat",
      messages: [
        {
          id: `msg-welcome`,
          role: "assistant",
          content: language === "mn" 
            ? "Сайн байна уу! Би бол **tengriX** - Монгол болон олон хэлээр ярилцах чадвартай таны ухаалаг туслах байна. Танд өнөөдөр ямар тусламж хэрэгтэй вэ? Баруун талын цэснээс тусгай хэрэгслүүдийг ч мөн сонгон ашиглаж болно."
            : "Hello! I am **tengriX** - your advanced AI Assistant specializing in Mongolian culture and fluent in all languages. How can I assist you today? You can also pick specialized tools from the sidebar.",
          timestamp: new Date()
        }
      ],
      createdAt: new Date()
    };
    setSessions([defaultSession]);
    setActiveSessionId(defaultId);
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const activeTool = MONGOLIAN_TOOLS.find((t) => t.id === activeSession?.activeToolId);

  // Suggested prompt ideas depending on selected tool
  const getSuggestions = () => {
    if (!activeSession?.activeToolId) {
      return [
        {
          tag: language === "mn" ? "ТӨЛӨВЛӨГӨӨ" : "PLAN",
          text: language === "mn" 
            ? "Архангай аймгаар 5 хоног аялах төлөвлөгөө гаргаад аль" 
            : "Plan a 5-day trip itinerary to Arkhangai province",
          color: "text-blue-600 border-blue-100 bg-blue-50/50 hover:border-blue-400"
        },
        {
          tag: language === "mn" ? "ТҮҮХ" : "HISTORY",
          text: language === "mn" 
            ? "Их Монгол Улсын мандал бадралын нууцыг энгийнээр тайлбарлаж өгөөч" 
            : "Explain the secret history of the Mongol Empire simply",
          color: "text-purple-600 border-purple-100 bg-purple-50/50 hover:border-purple-400"
        },
        {
          tag: language === "mn" ? "ОНЬСОГО" : "RIDDLE",
          text: language === "mn" 
            ? "Хамгийн алдартай 3 монгол ардын оньсого таалгаад хариуг нь нуугаарай" 
            : "Give me 3 famous Mongolian traditional riddles",
          color: "text-amber-600 border-amber-100 bg-amber-50/50 hover:border-amber-400"
        },
        {
          tag: language === "mn" ? "ЯРУУ НАЙРАГ" : "POETRY",
          text: language === "mn" 
            ? "Б.Лхагвасүрэнгийн 'Эхийн сэтгэл' шүлгийг яагаад аугаа гэдэг вэ?" 
            : "Why is the poem 'Mother's Heart' by Lkhagvasuren famous?",
          color: "text-emerald-600 border-emerald-100 bg-emerald-50/50 hover:border-emerald-400"
        }
      ];
    }

    switch (activeSession.activeToolId) {
      case "traditional-script":
        return [
          {
            tag: "МОНГOЛ БИЧИГ",
            text: language === "mn" ? "'Эх орон' гэдэг үгийг монгол бичгээр хэрхэн бичиж тайлбарлах вэ?" : "Explain how 'Motherland' is written in traditional script",
            color: "text-purple-600 border-purple-100 bg-purple-50/50 hover:border-purple-400"
          },
          {
            tag: "ДУРАМ",
            text: language === "mn" ? "Монгол бичгийн тийн ялгалын нөхцөл залгах гол дүрэм юу вэ?" : "What are the rules for suffixing in traditional script?",
            color: "text-blue-600 border-blue-100 bg-blue-50/50 hover:border-blue-400"
          }
        ];
      case "spell-checker":
        return [
          {
            tag: "ЗАГВАР",
            text: language === "mn" ? "Засаж өгөх үү: Би маргааш явна гэж шийдсэн болохоор бэлтгэлээ базаж байна." : "Check grammar: Би маргааш явна гэж шийдсэн болохоор бэлтгэлээ базаж байна.",
            color: "text-emerald-600 border-emerald-100 bg-emerald-50/50 hover:border-emerald-400"
          },
          {
            tag: "ДҮРЭМ",
            text: language === "mn" ? "Эгшиг гээгдэх хуулийн гол алдаануудаас засаж тайлбарлаж өгнө үү" : "Explain and correct common errors of the dropped-vowel rule",
            color: "text-purple-600 border-purple-100 bg-purple-50/50 hover:border-purple-400"
          }
        ];
      case "proverbs-explainer":
        return [
          {
            tag: "ТАЙЛАЛ",
            text: language === "mn" ? "'Долоо хэмжиж нэг огтол' гэх зүйр үгийн гүн утга учир" : "Explain: 'Measure seven times, cut once'",
            color: "text-amber-600 border-amber-100 bg-amber-50/50 hover:border-amber-400"
          },
          {
            tag: "САНАМСАРГҮЙ",
            text: language === "mn" ? "Надад нэг ухаарал хайрлах санамсаргүй зүйр цэцэн үг тайлбарла" : "Give me a random wise Mongolian proverb with explanation",
            color: "text-blue-600 border-blue-100 bg-blue-50/50 hover:border-blue-400"
          }
        ];
      case "culture-guide":
        return [
          {
            tag: "ГЭРИЙН ДҮРЭМ",
            text: language === "mn" ? "Монгол гэрт ороход хориглодог ямар зан заншил байдаг вэ?" : "What are the key etiquettes when visiting a Mongolian Ger?",
            color: "text-sky-600 border-sky-100 bg-sky-50/50 hover:border-sky-400"
          },
          {
            tag: "ЦАГААН САР",
            text: language === "mn" ? "Амар мэнд мэдэлцэх, золгох ёсны уламжлалт нарийн дарааллыг хэлнэ үү" : "What is the detailed ritual for traditional greeting during Tsagaan Sar?",
            color: "text-indigo-600 border-indigo-100 bg-indigo-50/50 hover:border-indigo-400"
          }
        ];
      case "cultural-translator":
        return [
          {
            tag: "ХЭЛЦ ҮГ",
            text: language === "mn" ? "'Ажил хийвэл ам тосодно' гэдэг үгийг англи руу хэрхэн ухаалгаар орчуулах вэ?" : "How to elegantly translate 'Aжил хийвэл ам тосодно' to English?",
            color: "text-pink-600 border-pink-100 bg-pink-50/50 hover:border-pink-400"
          },
          {
            tag: "ХҮНДЭТГЭЛ",
            text: language === "mn" ? "Монгол хэлний хүндэтгэлийн үгсийг солонгос, англи хэл рүү хэрхэн хөрвүүлэх вэ?" : "How to translate Mongolian honorifics to English?",
            color: "text-purple-600 border-purple-100 bg-purple-50/50 hover:border-purple-400"
          }
        ];
      default:
        return [];
    }
  };

  const handleNewSession = (toolId?: string) => {
    const selectedTool = MONGOLIAN_TOOLS.find((t) => t.id === toolId);
    const newId = `session-${Date.now()}`;
    
    let title = language === "mn" ? "Шинэ харилцан яриа" : "New Chat";
    let firstMessageContent = language === "mn" 
      ? "Сайн байна уу! Танд юугаар туслах вэ?" 
      : "Hello! How can I help you today?";

    if (selectedTool) {
      title = language === "mn" ? selectedTool.nameMN : selectedTool.nameEN;
      firstMessageContent = language === "mn"
        ? `**${selectedTool.nameMN}** хэрэгсэл идэвхжлээ.\n\n${selectedTool.descriptionMN}\n\n${selectedTool.promptPlaceholderMN}`
        : `**${selectedTool.nameEN}** mode activated.\n\n${selectedTool.descriptionEN}\n\n${selectedTool.promptPlaceholderEN}`;
    }

    const newSession: ChatSession = {
      id: newId,
      title: title,
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          role: "assistant",
          content: firstMessageContent,
          timestamp: new Date()
        }
      ],
      createdAt: new Date(),
      activeToolId: toolId
    };

    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
  };

  const handleDeleteSession = (id: string) => {
    const filtered = sessions.filter((s) => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) {
      if (filtered.length > 0) {
        setActiveSessionId(filtered[0].id);
      } else {
        // Create an empty session
        const defaultId = `session-${Date.now()}`;
        const defaultSession: ChatSession = {
          id: defaultId,
          title: language === "mn" ? "Ерөнхий харилцан яриа" : "General Chat",
          messages: [
            {
              id: `msg-welcome`,
              role: "assistant",
              content: language === "mn" 
                ? "Сайн байна уу! Би бол **tengriX** - таны ухаалаг туслах байна."
                : "Hello! I am **tengriX** - your advanced AI assistant.",
              timestamp: new Date()
            }
          ],
          createdAt: new Date()
        };
        setSessions([defaultSession]);
        setActiveSessionId(defaultId);
      }
    }
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
  };

  // Speaks output text aloud
  const speakText = (text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    
    // Cancel currently speaking
    window.speechSynthesis.cancel();

    // Clean markdown before speaking
    const cleanText = text.replace(/[*#`_\-\[\]()]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    
    // Standard language detection hint
    // Mongolian uses Cyrillic, so let's match Cyrillic character set if possible
    const isCyrillic = /[а-яА-ЯёЁөӨүҮү]/i.test(text);
    if (isCyrillic) {
      // Find Russian/Cyrillic voice if Mongolian is not available
      const cyrillicVoice = voices.find(v => v.lang.includes("ru") || v.lang.includes("mn"));
      if (cyrillicVoice) utterance.voice = cyrillicVoice;
    } else {
      // Find english voice or matching language
      const enVoice = voices.find(v => v.lang.includes("en"));
      if (enVoice) utterance.voice = enVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Submit Prompt to Server-Side API
  const handleSubmit = async (textToSend?: string) => {
    const promptText = textToSend || input;
    if (!promptText.trim() || loading) return;

    if (!textToSend) {
      setInput("");
    }

    const currentSession = sessions.find((s) => s.id === activeSessionId);
    if (!currentSession) return;

    // Create user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: promptText,
      timestamp: new Date()
    };

    // Update conversation title if it was default
    let updatedTitle = currentSession.title;
    if (currentSession.messages.length === 1 && currentSession.title.startsWith("Шинэ") || currentSession.title.startsWith("New")) {
      updatedTitle = promptText.length > 25 ? promptText.substring(0, 25) + "..." : promptText;
    }

    const updatedMessages = [...currentSession.messages, userMessage];
    
    // Update active session locally first
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          title: updatedTitle,
          messages: updatedMessages
        };
      }
      return s;
    }));

    setLoading(true);

    try {
      // Prepare instructions if we are using a specific tool
      const systemInstruction = activeTool ? activeTool.systemInstruction : undefined;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          systemInstruction: systemInstruction,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Гарсан алдаа.");
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: data.content,
        timestamp: new Date()
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...updatedMessages, assistantMessage]
          };
        }
        return s;
      }));

      // Speak text aloud if enabled
      if (speechEnabled) {
        speakText(data.content);
      }

    } catch (err: any) {
      console.error(err);
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: language === "mn" 
          ? `⚠️ Алдаа гарлаа: ${err.message || "Сервертэй холбогдож чадсангүй."}`
          : `⚠️ Error occurred: ${err.message || "Failed to reach the server."}`,
        timestamp: new Date()
      };
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...updatedMessages, errorMessage]
          };
        }
        return s;
      }));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] font-sans text-slate-800 overflow-hidden relative">
      
      {/* Sidebar component */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        language={language}
        setLanguage={setLanguage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 flex flex-col relative overflow-hidden h-full">
        
        {/* Sleek Abstract Background Blur Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-40 -z-10" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-purple-100 rounded-full blur-[100px] opacity-35 -z-10" />

        {/* Header bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 bg-white/70 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-1 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-slate-900">
                  {activeTool ? (language === "mn" ? activeTool.nameMN : activeTool.nameEN) : "tengriX AI Assistant"}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-100 text-purple-700">
                  {activeTool ? (language === "mn" ? "Хэрэгсэл" : "Tool") : "ChatGPT Mode"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeTool 
                  ? (language === "mn" ? activeTool.descriptionMN : activeTool.descriptionEN)
                  : (language === "mn" ? "Таны асуултад бүх хэл дээр ухаалгаар хариулна." : "Your context-aware multi-language companion.")}
              </p>
            </div>
          </div>

          {/* Controls: Sound & Info */}
          <div className="flex items-center gap-2">
            <button
              id="toggle-speech"
              onClick={() => {
                setSpeechEnabled(!speechEnabled);
                if (speechEnabled && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center gap-2 text-xs font-semibold ${
                speechEnabled 
                  ? "bg-purple-50 text-purple-700 border-purple-200/60 shadow-sm" 
                  : "bg-slate-50 text-slate-400 border-slate-200"
              }`}
              title={language === "mn" ? "Дуут хариултыг асаах/унтраах" : "Toggle voice feedback"}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4 text-purple-600" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {language === "mn" ? (speechEnabled ? "Дуу асаалттай" : "Дуу хаалттай") : (speechEnabled ? "Voice On" : "Voice Off")}
              </span>
            </button>
          </div>
        </header>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 md:px-8 space-y-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {activeSession && activeSession.messages.length <= 1 && (
              /* Welcome Greeting & Card suggestion grids */
              <div className="text-center py-6 animate-fade-in">
                <div className="inline-block p-4 rounded-3xl bg-white shadow-xl shadow-slate-200/60 mb-6 border border-slate-100/80">
                  <Bot className="w-12 h-12 text-purple-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {language === "mn" ? "Сайн байна уу? Би ТэнгриX" : "Welcome back! I am tengriX"}
                </h2>
                <p className="text-slate-500 text-sm max-w-lg mx-auto mb-10 leading-relaxed">
                  {language === "mn" 
                    ? "Би танд бүх хэл дээр ухаалгаар хариулт өгөхөд бэлэн байна. Та дараах жишээ сэдвүүдээс сонгох эсвэл доор шууд асуултаа бичээрэй." 
                    : "I am ready to help and answer your questions in any language. Type below, or choose one of the ideas to start:"}
                </p>

                {getSuggestions().length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                    {getSuggestions().map((sug, idx) => (
                      <button
                        key={idx}
                        id={`sug-card-${idx}`}
                        onClick={() => handleSubmit(sug.text)}
                        className={`p-4 bg-white border rounded-2xl transition-all cursor-pointer shadow-sm text-left group hover:shadow-md hover:scale-[1.01] ${sug.color}`}
                      >
                        <p className="text-[10px] font-bold tracking-widest uppercase mb-1">
                          {sug.tag}
                        </p>
                        <p className="text-sm text-slate-700 group-hover:text-slate-900 leading-snug">
                          {sug.text}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Render conversation messages */}
            {activeSession && activeSession.messages.map((msg, index) => {
              const isUser = msg.role === "user";
              const isWelcome = msg.id === "msg-welcome" || msg.id.startsWith("msg-welcome-");
              
              return (
                <div 
                  key={msg.id} 
                  id={`chat-message-${msg.id}`}
                  className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"} animate-slide-up`}
                >
                  {/* Left Avatar for Assistant */}
                  {!isUser && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 shadow-md flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}

                  {/* Bubble Container */}
                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm border ${
                    isUser 
                      ? "bg-slate-900 border-slate-900 text-white rounded-tr-none" 
                      : "bg-white border-slate-200 text-slate-800 rounded-tl-none"
                  }`}>
                    
                    {/* Role Header */}
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider font-mono opacity-60">
                        {isUser 
                          ? (language === "mn" ? "Та" : "You") 
                          : "tengriX AI"}
                      </span>
                      
                      {/* Copy and speech playback actions */}
                      {!isUser && !isWelcome && (
                        <div className="flex items-center gap-1.5 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                          <button
                            id={`copy-btn-${msg.id}`}
                            onClick={() => copyToClipboard(msg.content, msg.id)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            title={language === "mn" ? "Хуулах" : "Copy"}
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            id={`speak-btn-${msg.id}`}
                            onClick={() => speakText(msg.content)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            title={language === "mn" ? "Унших" : "Read out loud"}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Content text */}
                    <div className="prose prose-slate max-w-none text-sm leading-relaxed break-words">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>

                    {/* Timestamp */}
                    <div className="mt-2 text-[10px] opacity-40 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                  </div>

                  {/* Right Avatar for User */}
                  {isUser && (
                    <div className="w-9 h-9 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center flex-shrink-0 font-bold text-slate-700 text-xs">
                      U
                    </div>
                  )}
                </div>
              );
            })}

            {/* Shimmer loading feedback */}
            {loading && (
              <div className="flex gap-4 justify-start">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 shadow-md flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 max-w-[70%] w-full shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-purple-600">
                      tengriX
                    </span>
                    <span className="text-[10px] text-slate-400 animate-pulse">
                      {language === "mn" ? "бодож байна..." : "thinking..."}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-[90%]" />
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-[75%]" />
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-[50%]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Text Form */}
        <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-t from-white via-white/95 to-transparent border-t border-slate-100 z-10">
          <div className="max-w-3xl mx-auto">
            <form
              id="chat-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              </div>
              <input
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  activeTool 
                    ? (language === "mn" ? activeTool.promptPlaceholderMN : activeTool.promptPlaceholderEN)
                    : (language === "mn" ? "Асуултаа энд бичнэ үү... (Англи, Монгол, Орос, Солонгос...)" : "Ask tengriX anything in any language...")
                }
                disabled={loading}
                className="w-full pl-12 pr-28 py-4 sm:py-5 bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-purple-500/5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all text-slate-800 placeholder-slate-400"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  id="submit-btn"
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-2 sm:px-5 sm:py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-95 shadow-md shadow-purple-900/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">
                    {language === "mn" ? "Илгээх" : "Send"}
                  </span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
            <p className="text-center text-[10px] text-slate-400 mt-3 font-mono">
              {language === "mn" 
                ? "tengriX v2.4 • Орчуулга, зөв бичих дүрэм болон уламжлалт өв соёлын лавлах сан." 
                : "tengriX v2.4 • Translation, spell-checking and traditional nomadic heritage encyclopedia."}
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
