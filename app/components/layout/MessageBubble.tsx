'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Message } from '@/app/lib/types';

interface MessageBubbleProps {
    message: Message;
}

// Typing indicator animation
function TypingIndicator() {
    return (
        <div className="flex items-center gap-1 py-1">
            <motion.span
                className="h-2 w-2 rounded-full bg-[#A3A3A3]"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
            />
            <motion.span
                className="h-2 w-2 rounded-full bg-[#A3A3A3]"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
            />
            <motion.span
                className="h-2 w-2 rounded-full bg-[#A3A3A3]"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
            />
        </div>
    );
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user';
    const isTyping = message.isTyping;

    return (
        <motion.div
            className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Assistant Avatar - Uses stored toneImage */}
            {!isUser && (
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border border-[#262626]">
                        {message.toneImage ? (
                            <Image
                                src={message.toneImage}
                                alt={message.toneLabel || 'Assistant'}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#262626] text-sm text-white">
                                C
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Message bubble */}
            <div className="flex flex-col gap-1 max-w-[75%]">
                {/* Persona name label for assistant messages */}
                {!isUser && message.toneLabel && (
                    <span className="text-xs text-[#A3A3A3] font-medium ml-1">
                        {message.toneLabel}
                    </span>
                )}

                <div
                    className={`rounded-2xl px-4 py-3 ${isUser
                        ? 'bg-white text-black'
                        : 'bg-[#262626] text-white'
                        }`}
                >
                    {isTyping ? (
                        <TypingIndicator />
                    ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                        </p>
                    )}
                </div>
            </div>

            {/* User Avatar - Right side */}
            {isUser && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white shadow-md">
                    U
                </div>
            )}
        </motion.div>
    );
}
