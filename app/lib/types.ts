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
}

export interface ChatHistory {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}
