'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TONES } from '@/app/lib/constants';
import { ChatSession, Tone } from '@/app/lib/types';
import Button from '@/app/components/ui/Button';
import ChatHistoryItem from './ChatHistoryItem';

interface LeftSidebarProps {
    // State
    chatSessions: ChatSession[];
    currentChatId: string | null;
    selectedTone: Tone;
    isCollapsed: boolean;

    // Actions
    onNewChat: () => void;
    onSelectChat: (id: string) => void;
    onDeleteChat: (id: string) => void;
    onSelectTone: (tone: Tone) => void;
    onToggleCollapse: () => void;

    // Mobile
    isMobile?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
}

export default function LeftSidebar({
    chatSessions,
    currentChatId,
    selectedTone,
    isCollapsed,
    onNewChat,
    onSelectChat,
    onDeleteChat,
    onSelectTone,
    onToggleCollapse,
    isMobile = false,
    isOpen = true,
    onClose,
}: LeftSidebarProps) {

    const sidebarWidth = isCollapsed ? 'w-16' : 'w-72';

    const content = (
        <div className="flex h-full flex-col bg-[#171717]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#262626] p-3">
                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg overflow-hidden">
                            <Image
                                src="/images/1.png"
                                alt="ChadGPT"
                                width={32}
                                height={32}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <span className="font-semibold text-white">ChadGPT</span>
                    </div>
                )}

                <div className="flex items-center gap-1">
                    {/* Collapse toggle (desktop only) */}
                    {!isMobile && (
                        <Button
                            variant="icon"
                            size="sm"
                            onClick={onToggleCollapse}
                            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        </Button>
                    )}

                    {/* Close button (mobile only) */}
                    {isMobile && onClose && (
                        <Button variant="icon" size="sm" onClick={onClose}>
                            <X size={20} />
                        </Button>
                    )}
                </div>
            </div>

            {/* New Chat Button */}
            <div className="p-3 border-b border-[#262626]">
                <Button
                    variant="ghost"
                    className={`w-full justify-center gap-2 border border-[#525252] bg-[#262626] text-white hover:bg-[#333333] hover:border-white ${isCollapsed ? 'p-3' : ''
                        }`}
                    onClick={() => {
                        onNewChat();
                        if (isMobile && onClose) onClose();
                    }}
                >
                    <Plus size={isCollapsed ? 32 : 18} strokeWidth={isCollapsed ? 2.5 : 2} />
                    {!isCollapsed && <span className="font-medium">New Chat</span>}
                </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Recent Chats Section */}
                <div className="p-3">
                    {!isCollapsed && (
                        <h3 className="text-xs font-semibold text-[#525252] uppercase tracking-widest mb-2 px-1">
                            Recent Chats
                        </h3>
                    )}

                    {chatSessions.length === 0 ? (
                        <p className={`text-sm text-[#525252] px-1 ${isCollapsed ? 'hidden' : ''}`}>
                            No chats yet
                        </p>
                    ) : (
                        <div className="space-y-1">
                            {chatSessions.slice(0, 10).map((chat) => (
                                isCollapsed ? (
                                    <motion.button
                                        key={chat.id}
                                        className={`w-full p-2 rounded-lg flex items-center justify-center ${currentChatId === chat.id
                                            ? 'bg-white text-black'
                                            : 'text-[#A3A3A3] hover:bg-[#262626]'
                                            }`}
                                        onClick={() => {
                                            onSelectChat(chat.id);
                                            if (isMobile && onClose) onClose();
                                        }}
                                        title={chat.title}
                                    >
                                        <span className="text-xs font-medium">
                                            {chat.title.charAt(0).toUpperCase()}
                                        </span>
                                    </motion.button>
                                ) : (
                                    <ChatHistoryItem
                                        key={chat.id}
                                        chat={chat}
                                        isActive={currentChatId === chat.id}
                                        onSelect={(id) => {
                                            onSelectChat(id);
                                            if (isMobile && onClose) onClose();
                                        }}
                                        onDelete={onDeleteChat}
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="mx-3 border-t border-[#262626]" />

                {/* Chad Personas Section */}
                <div className="p-3">
                    {!isCollapsed && (
                        <h3 className="text-xs font-semibold text-[#525252] uppercase tracking-widest mb-2 px-1">
                            Chad Personas
                        </h3>
                    )}

                    <div className="space-y-1">
                        {TONES.map((tone) => {
                            const isSelected = selectedTone.id === tone.id;

                            return (
                                <motion.button
                                    key={tone.id}
                                    onClick={() => {
                                        onSelectTone(tone);
                                        if (isMobile && onClose) onClose();
                                    }}
                                    className={`w-full flex items-center gap-3 rounded-lg p-2 transition-all ${isSelected
                                        ? 'bg-white/10 ring-1 ring-white/50'
                                        : 'hover:bg-[#262626]'
                                        } ${isCollapsed ? 'justify-center' : ''}`}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    title={tone.label}
                                >
                                    <div className={`relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border-2 transition-all ${isSelected ? 'border-white' : 'border-[#262626]'
                                        }`}>
                                        <Image
                                            src={tone.image}
                                            alt={tone.label}
                                            width={32}
                                            height={32}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {!isCollapsed && (
                                        <div className="flex-1 text-left min-w-0">
                                            <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-[#A3A3A3]'
                                                }`}>
                                                {tone.label}
                                            </p>
                                        </div>
                                    )}

                                    {isSelected && !isCollapsed && (
                                        <div className="h-2 w-2 rounded-full bg-white flex-shrink-0" />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#262626] p-3">
                <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    {!isCollapsed && (
                        <span className="text-xs text-[#A3A3A3]">v1.0 Online</span>
                    )}
                </div>
            </div>
        </div>
    );

    // Mobile: Slide-in drawer
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
                            className="fixed left-0 top-0 z-50 h-full w-72 md:hidden"
                        >
                            {content}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        );
    }

    // Desktop: Fixed sidebar with collapse
    return (
        <motion.aside
            className={`hidden md:flex h-full flex-col border-r border-[#262626] ${sidebarWidth}`}
            animate={{ width: isCollapsed ? 64 : 288 }}
            transition={{ duration: 0.2 }}
        >
            {content}
        </motion.aside>
    );
}
