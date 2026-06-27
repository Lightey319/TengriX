export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  activeToolId?: string; // Optional indicator of whether a specific Mongolian tool is currently active
}

export type AppLanguage = "mn" | "en";

export interface SystemSettings {
  language: AppLanguage;
  speechEnabled: boolean;
  voiceName: string;
  temperature: number;
}

export interface AITool {
  id: string;
  nameMN: string;
  nameEN: string;
  descriptionMN: string;
  descriptionEN: string;
  icon: string;
  promptPlaceholderMN: string;
  promptPlaceholderEN: string;
  systemInstruction: string;
}
