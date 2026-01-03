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
    toneLabel?: string;   // Store the persona name at time of message
    toneImage?: string;   // Store the persona image at time of message
    isTyping?: boolean;   // For typing indicator
}

export interface ChatHistory {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}
