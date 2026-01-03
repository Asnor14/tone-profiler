'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Volume2, Loader2, Square, Smile } from 'lucide-react';
import { Message } from '@/app/lib/types';
import { API_BASE_URL } from '@/app/lib/constants';

interface MessageBubbleProps {
    message: Message;
    onReaction?: (messageId: string, reaction: string | null) => void;
}

// Available reactions
const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

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

// Soundwave animation component
function SoundwaveAnimation() {
    return (
        <div className="flex items-center gap-0.5 h-3">
            {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                    key={i}
                    className="w-0.5 bg-green-400 rounded-full"
                    animate={{
                        height: ['4px', '12px', '4px'],
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
}

export default function MessageBubble({ message, onReaction }: MessageBubbleProps) {
    const isUser = message.role === 'user';
    const isTyping = message.isTyping;
    const [copied, setCopied] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const cachedAudioUrlRef = useRef<string | null>(null);
    const reactionPickerRef = useRef<HTMLDivElement>(null);

    // Close reaction picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (reactionPickerRef.current && !reactionPickerRef.current.contains(event.target as Node)) {
                setShowReactionPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Cleanup audio URL on unmount
    useEffect(() => {
        return () => {
            if (cachedAudioUrlRef.current) {
                URL.revokeObjectURL(cachedAudioUrlRef.current);
            }
        };
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleReactionClick = (emoji: string) => {
        if (onReaction) {
            // Toggle: if same reaction, remove it; otherwise set it
            const newReaction = message.reaction === emoji ? null : emoji;
            onReaction(message.id, newReaction);
        }
        setShowReactionPicker(false);
    };

    const handleSpeak = async () => {
        if (isSpeaking && audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsSpeaking(false);
            return;
        }

        if (cachedAudioUrlRef.current) {
            const audio = new Audio(cachedAudioUrlRef.current);
            audioRef.current = audio;
            audio.onplay = () => setIsSpeaking(true);
            audio.onended = () => setIsSpeaking(false);
            audio.onerror = () => {
                setIsSpeaking(false);
                cachedAudioUrlRef.current = null;
            };
            try {
                await audio.play();
                return;
            } catch {
                cachedAudioUrlRef.current = null;
            }
        }

        setIsLoadingAudio(true);

        try {
            const response = await fetch(`${API_BASE_URL}/tts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: message.content,
                    toneId: message.toneId || 'neutral',
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('TTS Error:', errorText);
                throw new Error(`TTS failed: ${response.statusText}`);
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            cachedAudioUrlRef.current = audioUrl;

            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            audio.onplay = () => {
                setIsSpeaking(true);
                setIsLoadingAudio(false);
            };
            audio.onended = () => setIsSpeaking(false);
            audio.onerror = (e) => {
                console.error('Audio playback error:', e);
                setIsSpeaking(false);
                setIsLoadingAudio(false);
            };

            await audio.play();
        } catch (err) {
            console.error('Failed to speak:', err);
            setIsLoadingAudio(false);
            setIsSpeaking(false);
        }
    };

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
            {/* Assistant Avatar */}
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
                {/* Persona name + model label */}
                {!isUser && labelText && (
                    <span className="text-xs text-[#A3A3A3] font-medium ml-1">
                        {labelText}
                    </span>
                )}

                <div className="relative">
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

                    {/* Reaction display - shown at bottom right of bubble */}
                    {message.reaction && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`absolute -bottom-2 ${isUser ? 'left-2' : 'right-2'} bg-[#333333] rounded-full px-1.5 py-0.5 shadow-lg border border-[#444444] cursor-pointer hover:scale-110 transition-transform`}
                            onClick={() => onReaction && onReaction(message.id, null)}
                            title="Click to remove reaction"
                        >
                            <span className="text-sm">{message.reaction}</span>
                        </motion.div>
                    )}

                    {/* Action buttons - ALWAYS VISIBLE */}
                    {!isTyping && (
                        <div className={`flex items-center gap-3 mt-2 ${isUser ? 'justify-end mr-1' : 'ml-1'}`}>
                            {/* Reaction button */}
                            <div className="relative" ref={reactionPickerRef}>
                                <motion.button
                                    onClick={() => setShowReactionPicker(!showReactionPicker)}
                                    className="flex items-center gap-1 text-xs text-[#525252] hover:text-white transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Smile size={14} />
                                    <span>React</span>
                                </motion.button>

                                {/* Reaction picker popup */}
                                <AnimatePresence>
                                    {showReactionPicker && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                            className={`absolute bottom-full mb-2 ${isUser ? 'right-0' : 'left-0'} bg-[#1a1a1a] rounded-full px-2 py-1.5 shadow-xl border border-[#333333] flex gap-1 z-50`}
                                        >
                                            {REACTIONS.map((emoji) => (
                                                <motion.button
                                                    key={emoji}
                                                    onClick={() => handleReactionClick(emoji)}
                                                    className={`text-lg hover:scale-125 transition-transform p-1 rounded-full ${message.reaction === emoji ? 'bg-[#333333]' : ''}`}
                                                    whileHover={{ scale: 1.3 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    {emoji}
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Divider */}
                            <div className="w-px h-3 bg-[#333333]" />

                            {/* Copy button */}
                            <motion.button
                                onClick={handleCopy}
                                className="flex items-center gap-1 text-xs text-[#525252] hover:text-white transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {copied ? (
                                    <>
                                        <Check size={14} className="text-green-400" />
                                        <span className="text-green-400">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={14} />
                                        <span>Copy</span>
                                    </>
                                )}
                            </motion.button>

                            {/* Read Aloud button - only for assistant */}
                            {!isUser && (
                                <>
                                    <div className="w-px h-3 bg-[#333333]" />
                                    <motion.button
                                        onClick={handleSpeak}
                                        disabled={isLoadingAudio}
                                        className="flex items-center gap-1.5 text-xs text-[#525252] hover:text-white transition-colors disabled:opacity-50"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {isLoadingAudio ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin text-blue-400" />
                                                <span className="text-blue-400">Loading...</span>
                                            </>
                                        ) : isSpeaking ? (
                                            <>
                                                <SoundwaveAnimation />
                                                <Square size={14} className="text-red-400 ml-1" />
                                                <span className="text-green-400">Playing</span>
                                            </>
                                        ) : (
                                            <>
                                                <Volume2 size={14} />
                                                <span>{cachedAudioUrlRef.current ? 'Play' : 'Read'}</span>
                                            </>
                                        )}
                                    </motion.button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* User Avatar */}
            {isUser && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white shadow-md">
                    U
                </div>
            )}
        </motion.div>
    );
}
