'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingSequence from '@/app/components/features/LoadingSequence';
import ToneSelector from '@/app/components/features/ToneSelector';
import LeftSidebar from '@/app/components/layout/LeftSidebar';
import ChatArea from '@/app/components/layout/ChatArea';
import MobileHeader from '@/app/components/layout/MobileHeader';
import { TONES, MODELS } from '@/app/lib/constants';
import { Message, Tone } from '@/app/lib/types';
import { Model } from '@/app/lib/constants';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTone, setSelectedTone] = useState<Tone>(TONES[0]);
  const [selectedModel, setSelectedModel] = useState<Model>(MODELS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | undefined>();

  // Mobile drawer states
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

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
    setMessages([]);
    setActiveChatId(undefined);
  }, []);

  const handleSelectChat = useCallback((id: string) => {
    setActiveChatId(id);
  }, []);

  const handleSendMessage = useCallback((content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const responses: Record<string, string> = {
        neutral: `I understand. Let me help you with that.`,
        formal: `Certainly. I shall endeavor to provide you with a comprehensive response regarding your inquiry.`,
        urgent: `URGENT: I'm on it! Let's tackle this immediately - no time to waste!`,
        optimistic: `What a great question! I'm absolutely thrilled to help you with this. Together, we'll find the perfect solution! 🌟`,
        sarcastic: `Oh wow, what an *incredibly* original request. Let me consult my crystal ball... Just kidding, here's your answer.`,
      };

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: responses[selectedTone.id] || responses.neutral,
        role: 'assistant',
        timestamp: new Date(),
        toneId: selectedTone.id,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  }, [selectedTone]);

  const handleFileUpload = useCallback((file: File) => {
    const message = `📄 Uploaded file: ${file.name}`;
    handleSendMessage(message);
  }, [handleSendMessage]);

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
            onRightMenuToggle={() => setRightDrawerOpen(true)}
          />

          {/* 3-Column Layout */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Desktop */}
            <LeftSidebar
              isMobile={false}
              onNewChat={handleNewChat}
              activeChatId={activeChatId}
              onSelectChat={handleSelectChat}
            />

            {/* Left Sidebar - Mobile Drawer */}
            <LeftSidebar
              isMobile={true}
              isOpen={leftDrawerOpen}
              onClose={() => setLeftDrawerOpen(false)}
              onNewChat={handleNewChat}
              activeChatId={activeChatId}
              onSelectChat={handleSelectChat}
            />

            {/* Center - Chat Area */}
            <ChatArea
              messages={messages}
              selectedTone={selectedTone}
              selectedModel={selectedModel}
              onSendMessage={handleSendMessage}
              onFileUpload={handleFileUpload}
              onSelectModel={handleModelSelect}
            />

            {/* Right Sidebar - Desktop */}
            <ToneSelector
              selectedTone={selectedTone}
              onSelectTone={handleToneSelect}
              isMobile={false}
            />

            {/* Right Sidebar - Mobile Drawer */}
            <ToneSelector
              selectedTone={selectedTone}
              onSelectTone={handleToneSelect}
              isMobile={true}
              isOpen={rightDrawerOpen}
              onClose={() => setRightDrawerOpen(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
}
