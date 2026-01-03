'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
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
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Build the label with model name if available
    const labelText = message.toneLabel && message.modelName
        ? `${message.toneLabel} - ${message.modelName}`
        : message.toneLabel || '';

    return (
        <motion.div
            className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Assistant Avatar - Left side */}
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
                {/* Persona name + model label for assistant messages */}
                {!isUser && labelText && (
                    <span className="text-xs text-[#A3A3A3] font-medium ml-1">
                        {labelText}
                    </span>
                )}

                <div className="group relative">
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

                    {/* Copy button - only for assistant messages */}
                    {!isUser && !isTyping && (
                        <motion.button
                            onClick={handleCopy}
                            className="absolute -bottom-6 left-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-[#525252] hover:text-white"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {copied ? (
                                <>
                                    <Check size={12} className="text-green-400" />
                                    <span className="text-green-400">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={12} />
                                    <span>Copy</span>
                                </>
                            )}
                        </motion.button>
                    )}
                </div>
            </div>

            {/* User Avatar - Right side of user messages */}
            {isUser && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white shadow-md">
                    U
                </div>
            )}
        </motion.div>
    );
}
