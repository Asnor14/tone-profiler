'use client';

import { motion } from 'framer-motion';
import { Trash2, MessageSquare } from 'lucide-react';
import { ChatSession } from '@/app/lib/types';
import { formatRelativeTime } from '@/app/lib/chatStorage';

interface ChatHistoryItemProps {
    chat: ChatSession;
    isActive: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function ChatHistoryItem({
    chat,
    isActive,
    onSelect,
    onDelete,
}: ChatHistoryItemProps) {
    return (
        <motion.div
            className={`group relative flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-200 ${isActive
                ? 'bg-[#3a3a3a] text-white'
                : 'text-[#A3A3A3] hover:bg-[#262626] hover:text-white'
                }`}
            onClick={() => onSelect(chat.id)}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
        >
            <MessageSquare
                size={16}
                className={`flex-shrink-0 ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}
            />

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                    {chat.title}
                </p>
                <p className={`text-xs truncate ${isActive ? 'text-white/60' : 'text-[#525252]'}`}>
                    {formatRelativeTime(chat.updatedAt)}
                </p>
            </div>

            {/* Delete button - shown on hover */}
            <motion.button
                className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-md transition-all ${isActive
                    ? 'hover:bg-white/10 text-white/60 hover:text-white'
                    : 'hover:bg-white/10 text-[#A3A3A3] hover:text-white'
                    }`}
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(chat.id);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Delete chat"
            >
                <Trash2 size={14} />
            </motion.button>
        </motion.div>
    );
}
