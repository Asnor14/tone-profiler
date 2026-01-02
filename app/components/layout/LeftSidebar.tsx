'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, X } from 'lucide-react';
import { MOCK_CHAT_HISTORY } from '@/app/lib/constants';
import Button from '@/app/components/ui/Button';

interface LeftSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    isMobile?: boolean;
    onNewChat: () => void;
    activeChatId?: string;
    onSelectChat?: (id: string) => void;
}

export default function LeftSidebar({
    isOpen = true,
    onClose,
    isMobile = false,
    onNewChat,
    activeChatId,
    onSelectChat,
}: LeftSidebarProps) {
    const content = (
        <div className="flex h-full flex-col">
            {/* Header with New Chat */}
            <div className="flex items-center justify-between border-b border-[#262626] p-3">
                <Button
                    variant="ghost"
                    className="flex-1 justify-start gap-2 text-white"
                    onClick={() => {
                        onNewChat();
                        if (isMobile && onClose) onClose();
                    }}
                >
                    <Plus size={18} />
                    <span className="font-medium">New Chat</span>
                </Button>
                {isMobile && onClose && (
                    <Button variant="icon" size="sm" onClick={onClose} className="ml-2">
                        <X size={20} />
                    </Button>
                )}
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-2">
                <div className="mb-2 px-2">
                    <h3 className="text-xs font-medium text-[#A3A3A3] uppercase tracking-wider">
                        Recent
                    </h3>
                </div>
                <div className="space-y-1">
                    {MOCK_CHAT_HISTORY.map((chat) => {
                        const isActive = activeChatId === chat.id;

                        return (
                            <motion.button
                                key={chat.id}
                                onClick={() => {
                                    onSelectChat?.(chat.id);
                                    if (isMobile && onClose) onClose();
                                }}
                                className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-colors ${isActive
                                        ? 'bg-[#262626] text-white'
                                        : 'text-[#A3A3A3] hover:bg-[#262626]/50 hover:text-white'
                                    }`}
                                whileHover={{ x: 2 }}
                            >
                                <MessageSquare size={16} className="flex-shrink-0" />
                                <span className="flex-1 truncate text-sm">{chat.title}</span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#262626] p-3">
                <span className="text-xs text-[#A3A3A3]">ChadGPT v1.0</span>
            </div>
        </div>
    );

    // Mobile: Slide-in drawer from left
    if (isMobile) {
        return (
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 z-40 bg-black/60 md:hidden"
                        />
                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed left-0 top-0 z-50 h-full w-64 bg-[#171717] md:hidden"
                        >
                            {content}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        );
    }

    // Desktop: Fixed sidebar
    return (
        <aside className="hidden md:flex h-full w-64 flex-col border-r border-[#262626] bg-[#171717]">
            {content}
        </aside>
    );
}
