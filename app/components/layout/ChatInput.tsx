'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowUp } from 'lucide-react';
import Button from '@/app/components/ui/Button';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    onFileUpload?: (file: File) => void;
    disabled?: boolean;
}

export default function ChatInput({
    onSendMessage,
    onFileUpload,
    disabled = false,
}: ChatInputProps) {
    const [message, setMessage] = useState('');
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

    return (
        <div className="border-t border-[#262626] bg-[#171717] p-4">
            <motion.div
                className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-2xl bg-[#262626]/50 p-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
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
                    placeholder="Message ChadGPT..."
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
