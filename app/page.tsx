'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingSequence from '@/app/components/features/LoadingSequence';
import LeftSidebar from '@/app/components/layout/LeftSidebar';
import ChatArea from '@/app/components/layout/ChatArea';
import MobileHeader from '@/app/components/layout/MobileHeader';
import { TONES, MODELS } from '@/app/lib/constants';
import { Message, Tone, ChatSession } from '@/app/lib/types';
import { Model } from '@/app/lib/constants';
import {
  loadChatSessions,
  saveChatSession,
  deleteChat,
  generateChatTitle,
  loadPreferences,
  savePreferences,
  createNewChatSession,
} from '@/app/lib/chatStorage';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTone, setSelectedTone] = useState<Tone>(TONES[0]);
  const [selectedModel, setSelectedModel] = useState<Model>(MODELS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Chat history state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const sessions = loadChatSessions();
    const prefs = loadPreferences();

    setChatSessions(sessions);
    setSidebarCollapsed(prefs.sidebarCollapsed);

    // Restore last active chat if exists
    if (prefs.lastActiveChatId) {
      const lastChat = sessions.find(s => s.id === prefs.lastActiveChatId);
      if (lastChat) {
        setCurrentChatId(lastChat.id);
        setMessages(lastChat.messages);
        const tone = TONES.find(t => t.id === lastChat.toneId);
        if (tone) setSelectedTone(tone);
        const model = MODELS.find(m => m.id === lastChat.modelId);
        if (model) setSelectedModel(model);
      }
    }
  }, []);

  // Save current chat whenever messages change
  useEffect(() => {
    if (messages.length > 0 && currentChatId) {
      const title = generateChatTitle(messages);
      const session: ChatSession = {
        id: currentChatId,
        title,
        messages,
        toneId: selectedTone.id,
        modelId: selectedModel.id,
        createdAt: chatSessions.find(s => s.id === currentChatId)?.createdAt || Date.now(),
        updatedAt: Date.now(),
      };
      const updated = saveChatSession(session);
      setChatSessions(updated);
      savePreferences({ lastActiveChatId: currentChatId });
    }
  }, [messages, currentChatId, selectedTone.id, selectedModel.id]);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleToneSelect = useCallback((tone: Tone) => {
    setSelectedTone(tone);
  }, []);

  const handleModelSelect = useCallback((model: Model) => {
    setSelectedModel(model);
  }, []);

  const handleNewChat = useCallback(() => {
    // Create new chat session
    const newSession = createNewChatSession(selectedTone.id, selectedModel.id);
    setCurrentChatId(newSession.id);
    setMessages([]);
    savePreferences({ lastActiveChatId: newSession.id });
  }, [selectedTone.id, selectedModel.id]);

  const handleSelectChat = useCallback((id: string) => {
    const session = chatSessions.find(s => s.id === id);
    if (session) {
      setCurrentChatId(session.id);
      setMessages(session.messages);
      const tone = TONES.find(t => t.id === session.toneId);
      if (tone) setSelectedTone(tone);
      const model = MODELS.find(m => m.id === session.modelId);
      if (model) setSelectedModel(model);
      savePreferences({ lastActiveChatId: id });
    }
  }, [chatSessions]);

  const handleDeleteChat = useCallback((id: string) => {
    const updated = deleteChat(id);
    setChatSessions(updated);

    // If deleting current chat, clear it
    if (currentChatId === id) {
      setCurrentChatId(null);
      setMessages([]);
      savePreferences({ lastActiveChatId: null });
    }
  }, [currentChatId]);

  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed(prev => {
      const newValue = !prev;
      savePreferences({ sidebarCollapsed: newValue });
      return newValue;
    });
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    if (isGenerating) return;

    // Create new chat session if needed
    let chatId = currentChatId;
    if (!chatId) {
      const newSession = createNewChatSession(selectedTone.id, selectedModel.id);
      chatId = newSession.id;
      setCurrentChatId(chatId);
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Create typing indicator
    const typingMessageId = crypto.randomUUID();
    const typingMessage: Message = {
      id: typingMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      toneId: selectedTone.id,
      toneLabel: selectedTone.label,
      toneImage: selectedTone.image,
      modelName: selectedModel.name,
      isTyping: true,
    };

    setMessages(prev => [...prev, typingMessage]);
    setIsGenerating(true);

    try {
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content,
          toneId: selectedTone.id,
          modelId: selectedModel.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: typingMessageId,
        content: data.rewritten,
        role: 'assistant',
        timestamp: new Date(),
        toneId: selectedTone.id,
        toneLabel: selectedTone.label,
        toneImage: selectedTone.image,
        modelName: selectedModel.name,
        isTyping: false,
      };

      setMessages(prev =>
        prev.map(msg => (msg.id === typingMessageId ? assistantMessage : msg))
      );
    } catch (error) {
      console.error('Backend error:', error);

      const errorMessage: Message = {
        id: typingMessageId,
        content: '⚠️ Error connecting to ChadGPT Backend. Make sure the API is running at localhost:8000.',
        role: 'assistant',
        timestamp: new Date(),
        toneId: 'neutral',
        toneLabel: 'System',
        toneImage: '/images/1.png',
        modelName: selectedModel.name,
        isTyping: false,
      };
      setMessages(prev =>
        prev.map(msg => (msg.id === typingMessageId ? errorMessage : msg))
      );
    } finally {
      setIsGenerating(false);
    }
  }, [selectedTone, selectedModel, isGenerating, currentChatId]);

  const handleFileUpload = useCallback(
    (file: File) => {
      const message = `📄 Uploaded file: ${file.name}`;
      handleSendMessage(message);
    },
    [handleSendMessage]
  );

  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      {/* Loading Sequence */}
      <AnimatePresence>
        {isLoading && <LoadingSequence onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {/* Main Chat Interface */}
      {!isLoading && (
        <div className="flex h-full w-full flex-col">
          {/* Mobile Header */}
          <MobileHeader
            onLeftMenuToggle={() => setLeftDrawerOpen(true)}
          />

          {/* 2-Column Layout (sidebar removed) */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Desktop */}
            <LeftSidebar
              chatSessions={chatSessions}
              currentChatId={currentChatId}
              selectedTone={selectedTone}
              isCollapsed={sidebarCollapsed}
              onNewChat={handleNewChat}
              onSelectChat={handleSelectChat}
              onDeleteChat={handleDeleteChat}
              onSelectTone={handleToneSelect}
              onToggleCollapse={handleToggleCollapse}
              isMobile={false}
            />

            {/* Left Sidebar - Mobile Drawer */}
            <LeftSidebar
              chatSessions={chatSessions}
              currentChatId={currentChatId}
              selectedTone={selectedTone}
              isCollapsed={false}
              onNewChat={handleNewChat}
              onSelectChat={handleSelectChat}
              onDeleteChat={handleDeleteChat}
              onSelectTone={handleToneSelect}
              onToggleCollapse={handleToggleCollapse}
              isMobile={true}
              isOpen={leftDrawerOpen}
              onClose={() => setLeftDrawerOpen(false)}
            />

            {/* Center - Chat Area */}
            <ChatArea
              messages={messages}
              selectedTone={selectedTone}
              selectedModel={selectedModel}
              onSendMessage={handleSendMessage}
              onFileUpload={handleFileUpload}
              onSelectModel={handleModelSelect}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      )}
    </main>
  );
}
