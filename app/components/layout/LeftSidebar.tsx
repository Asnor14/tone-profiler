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
            <div className="flex items-center justify-between border-b border-[#262626] p-4">
                <Button
                    variant="ghost"
                    className="flex-1 justify-start gap-3 text-white px-0 hover:bg-transparent hover:text-white/80"
                    onClick={() => {
                        onNewChat();
                        if (isMobile && onClose) onClose();
                    }}
                >
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white text-black">
                        <Plus size={18} />
                    </div>
                    <span className="font-semibold text-base">New Chat</span>
                </Button>
                {isMobile && onClose && (
                    <Button variant="icon" size="sm" onClick={onClose} className="ml-2">
                        <X size={20} />
                    </Button>
                )}
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                <div className="mb-3 px-3">
                    <h3 className="text-xs font-semibold text-[#525252] uppercase tracking-widest">
                        Recent Chats
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
                                className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200 ${isActive
                                    ? 'bg-white text-black shadow-md'
                                    : 'text-[#A3A3A3] hover:bg-[#262626] hover:text-white'
                                    }`}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <MessageSquare size={18} className={`flex-shrink-0 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />
                                <span className="flex-1 truncate text-sm font-medium">{chat.title}</span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#262626] p-4">
                <div className="flex items-center gap-2 px-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-[#A3A3A3]">ChadGPT v1.0 Online</span>
                </div>
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
