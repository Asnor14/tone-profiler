import { ChatSession, Message, AppPreferences } from './types';

const STORAGE_KEYS = {
    CHATS: 'chadgpt_chats',
    PREFERENCES: 'chadgpt_preferences',
};

const MAX_CHATS = 50;

// ===== Chat Session Operations =====

export function loadChatSessions(): ChatSession[] {
    if (typeof window === 'undefined') return [];

    try {
        const data = localStorage.getItem(STORAGE_KEYS.CHATS);
        if (!data) return [];

        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Error loading chat sessions:', error);
        return [];
    }
}

export function saveChatSessions(sessions: ChatSession[]): void {
    if (typeof window === 'undefined') return;

    try {
        // Keep only the most recent MAX_CHATS
        const trimmed = sessions
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .slice(0, MAX_CHATS);

        localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(trimmed));
    } catch (error) {
        console.error('Error saving chat sessions:', error);
        // If quota exceeded, try removing oldest chats
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            const reduced = sessions.slice(0, Math.floor(sessions.length / 2));
            localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(reduced));
        }
    }
}

export function saveChatSession(session: ChatSession): ChatSession[] {
    const sessions = loadChatSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);

    if (existingIndex >= 0) {
        sessions[existingIndex] = { ...session, updatedAt: Date.now() };
    } else {
        sessions.unshift(session);
    }

    saveChatSessions(sessions);
    return sessions;
}

export function deleteChat(chatId: string): ChatSession[] {
    const sessions = loadChatSessions().filter(s => s.id !== chatId);
    saveChatSessions(sessions);
    return sessions;
}

export function getChatById(chatId: string): ChatSession | null {
    const sessions = loadChatSessions();
    return sessions.find(s => s.id === chatId) || null;
}

// ===== Title Generation =====

export function generateChatTitle(messages: Message[]): string {
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (!firstUserMessage) return 'New Chat';

    const content = firstUserMessage.content.trim();

    // Remove emojis and special characters for cleaner title
    const cleaned = content.replace(/[^\w\s]/g, '').trim();

    if (cleaned.length <= 40) return cleaned || 'New Chat';
    return cleaned.substring(0, 40).trim() + '...';
}

// ===== Preferences =====

const DEFAULT_PREFERENCES: AppPreferences = {
    sidebarCollapsed: false,
    lastActiveChatId: null,
};

export function loadPreferences(): AppPreferences {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;

    try {
        const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
        if (!data) return DEFAULT_PREFERENCES;

        return { ...DEFAULT_PREFERENCES, ...JSON.parse(data) };
    } catch (error) {
        console.error('Error loading preferences:', error);
        return DEFAULT_PREFERENCES;
    }
}

export function savePreferences(prefs: Partial<AppPreferences>): void {
    if (typeof window === 'undefined') return;

    try {
        const current = loadPreferences();
        const updated = { ...current, ...prefs };
        localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    } catch (error) {
        console.error('Error saving preferences:', error);
    }
}

// ===== Utility =====

export function createNewChatSession(
    toneId: string,
    modelId: string
): ChatSession {
    return {
        id: crypto.randomUUID(),
        title: 'New Chat',
        messages: [],
        toneId,
        modelId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
}

export function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return new Date(timestamp).toLocaleDateString();
}
