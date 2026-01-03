export interface Tone {
    id: string;
    label: string;
    image: string;
    loadingText?: string;
}

export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    toneId?: string;
    toneLabel?: string;
    toneImage?: string;
    modelName?: string;   // e.g., "Llama 3.2"
    isTyping?: boolean;
    reaction?: string;    // Emoji reaction (e.g., "👍", "❤️", "😂")
}

export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    toneId: string;
    modelId: string;
    createdAt: number;
    updatedAt: number;
}

export interface AppPreferences {
    sidebarCollapsed: boolean;
    lastActiveChatId: string | null;
}

export interface ChatHistory {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}
