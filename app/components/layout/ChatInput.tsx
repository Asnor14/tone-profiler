'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowUp, Lock } from 'lucide-react';
import Button from '@/app/components/ui/Button';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    onFileUpload?: (file: File) => void;
    disabled?: boolean;
    language: 'english' | 'tagalog';
    onLanguageChange: (language: 'english' | 'tagalog') => void;
    languageLocked?: boolean; // When true, language cannot be changed
}

export default function ChatInput({
    onSendMessage,
    onFileUpload,
    disabled = false,
    language,
    onLanguageChange,
    languageLocked = false,
}: ChatInputProps) {
    const [message, setMessage] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        if (message.trim() && !disabled) {
            onSendMessage(message.trim());
            setMessage('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onFileUpload) {
            onFileUpload(file);
        }
        e.target.value = '';
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        // Auto-resize
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    };

    const handleLanguageClick = () => {
        if (languageLocked) {
            // Show tooltip briefly
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 2000);
        } else {
            onLanguageChange(language === 'english' ? 'tagalog' : 'english');
        }
    };

    return (
        <div className="border-t border-[#262626] bg-[#171717] p-4">
            <motion.div
                className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-2xl bg-[#262626]/50 p-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Language Toggle Button with Lock State */}
                <div className="relative">
                    <motion.button
                        onClick={handleLanguageClick}
                        whileHover={languageLocked ? {} : { scale: 1.05 }}
                        whileTap={languageLocked ? {} : { scale: 0.95 }}
                        className={`flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-all duration-300 flex-shrink-0 ${languageLocked
                                ? 'bg-[#1a1a1a] border border-[#333333] text-[#666666] cursor-not-allowed opacity-60'
                                : language === 'tagalog'
                                    ? 'bg-gradient-to-r from-yellow-500/20 to-blue-500/20 border border-yellow-500/50 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.3)]'
                                    : 'bg-gradient-to-r from-blue-500/20 to-gray-500/20 border border-blue-500/50 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                            }`}
                        title={languageLocked ? 'Start a new chat to change language' : (language === 'english' ? 'Switch to Tagalog' : 'Switch to English')}
                    >
                        {languageLocked && <Lock size={10} className="mr-0.5" />}
                        <span className="text-base">{language === 'tagalog' ? '🇵🇭' : '🇺🇸'}</span>
                        <span>{language === 'tagalog' ? 'PH' : 'EN'}</span>
                    </motion.button>

                    {/* Tooltip */}
                    {showTooltip && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#0a0a0a] border border-[#333333] rounded-lg shadow-xl z-50 whitespace-nowrap"
                        >
                            <p className="text-xs text-white font-medium">Start a new chat to change language</p>
                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333333]" />
                        </motion.div>
                    )}
                </div>

                {/* File upload button */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <Button
                    variant="icon"
                    size="sm"
                    onClick={handleFileClick}
                    className="h-9 w-9 flex-shrink-0"
                    title="Upload text file"
                >
                    <FileText size={18} />
                </Button>

                {/* Text area */}
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder={language === 'tagalog' ? 'Mag-type ka dito...' : 'Message ChadGPT...'}
                    disabled={disabled}
                    rows={1}
                    className="flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white placeholder-[#A3A3A3] outline-none scrollbar-thin"
                    style={{ maxHeight: '200px' }}
                />

                {/* Submit button */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSubmit}
                        disabled={!message.trim() || disabled}
                        className="h-9 w-9 flex-shrink-0 rounded-full p-0"
                    >
                        <ArrowUp size={18} />
                    </Button>
                </motion.div>
            </motion.div>

            <p className="mt-3 text-center text-xs text-[#A3A3A3]">
                ChadGPT can make mistakes. Consider checking important information.
            </p>
        </div>
    );
}
