'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Message, Tone } from '@/app/lib/types';
import { Model } from '@/app/lib/constants';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import ModelSelector from '@/app/components/features/ModelSelector';

interface ChatAreaProps {
    messages: Message[];
    selectedTone: Tone;
    selectedModel: Model;
    onSendMessage: (message: string) => void;
    onFileUpload?: (file: File) => void;
    onSelectModel: (model: Model) => void;
    isGenerating?: boolean;
}

export default function ChatArea({
    messages,
    selectedTone,
    selectedModel,
    onSendMessage,
    onFileUpload,
    onSelectModel,
    isGenerating = false,
}: ChatAreaProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-1 flex-col bg-black relative">
            {/* Model Selector - Sticky Top Left */}
            <div className="sticky top-0 z-10 p-4 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none">
                <div className="pointer-events-auto inline-block">
                    <ModelSelector
                        selectedModel={selectedModel}
                        onSelectModel={onSelectModel}
                    />
                </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto -mt-16">
                {messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center px-4 pt-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[#262626]">
                                <Image
                                    src={selectedTone.image}
                                    alt={selectedTone.label}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <h1 className="text-2xl font-semibold text-white">
                                ChadGPT
                            </h1>

                            <p className="max-w-md text-center text-[#A3A3A3]">
                                Currently in <span className="text-white font-medium">{selectedTone.label}</span> mode
                                <br />
                                Using <span className="text-white font-medium">{selectedModel.name}</span>
                            </p>

                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                {['Write a poem', 'Explain a concept', 'Help me brainstorm'].map((suggestion) => (
                                    <motion.button
                                        key={suggestion}
                                        onClick={() => onSendMessage(suggestion)}
                                        disabled={isGenerating}
                                        className="rounded-full border border-[#262626] bg-[#171717] px-4 py-2 text-sm text-[#A3A3A3] transition-colors hover:border-[#A3A3A3] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {suggestion}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 pt-20">
                        <AnimatePresence mode="popLayout">
                            {messages.map((message) => (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                />
                            ))}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input area */}
            <ChatInput
                onSendMessage={onSendMessage}
                onFileUpload={onFileUpload}
                disabled={isGenerating}
            />
        </div>
    );
}
