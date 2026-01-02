'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Message, Tone } from '@/app/lib/types';

interface MessageBubbleProps {
    message: Message;
    selectedTone: Tone;
}

export default function MessageBubble({ message, selectedTone }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <motion.div
            className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Avatar */}
            {!isUser && (
                <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-[#262626]">
                    <Image
                        src={selectedTone.image}
                        alt={selectedTone.label}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            {/* Message bubble */}
            <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser
                        ? 'bg-white text-black'
                        : 'bg-[#262626] text-white'
                    }`}
            >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                </p>
            </div>

            {/* User avatar placeholder */}
            {isUser && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#262626] text-sm font-medium text-white">
                    U
                </div>
            )}
        </motion.div>
    );
}
