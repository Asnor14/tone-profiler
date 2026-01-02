'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { TONES } from '@/app/lib/constants';
import { Tone } from '@/app/lib/types';
import Button from '@/app/components/ui/Button';

interface ToneSelectorProps {
    selectedTone: Tone;
    onSelectTone: (tone: Tone) => void;
    isOpen?: boolean;
    onClose?: () => void;
    isMobile?: boolean;
}

export default function ToneSelector({
    selectedTone,
    onSelectTone,
    isOpen = true,
    onClose,
    isMobile = false,
}: ToneSelectorProps) {
    const content = (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#262626] p-4">
                <div>
                    <h2 className="text-lg font-semibold text-white">Chad Personas</h2>
                    <p className="mt-1 text-sm text-[#A3A3A3]">Select your tone</p>
                </div>
                {isMobile && onClose && (
                    <Button variant="icon" size="sm" onClick={onClose}>
                        <X size={20} />
                    </Button>
                )}
            </div>

            {/* Tone Grid */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid gap-3">
                    {TONES.map((tone) => {
                        const isSelected = selectedTone.id === tone.id;
                        return (
                            <motion.button
                                key={tone.id}
                                onClick={() => {
                                    onSelectTone(tone);
                                    if (isMobile && onClose) onClose();
                                }}
                                className={`group relative flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 ${isSelected
                                    ? 'bg-white/10 ring-2 ring-white'
                                    : 'bg-[#262626]/50 hover:bg-[#262626]'
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Avatar */}
                                <div
                                    className={`relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 transition-all duration-200 ${isSelected
                                        ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                                        : 'border-[#262626] group-hover:border-[#A3A3A3]'
                                        }`}
                                >
                                    <Image
                                        src={tone.image}
                                        alt={tone.label}
                                        width={56}
                                        height={56}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {/* Label */}
                                <div className="flex-1 min-w-0">
                                    <h3
                                        className={`font-medium truncate ${isSelected ? 'text-white' : 'text-[#A3A3A3] group-hover:text-white'
                                            }`}
                                    >
                                        {tone.label}
                                    </h3>
                                    <p className="text-xs text-[#A3A3A3] truncate capitalize">
                                        {tone.id} mode
                                    </p>
                                </div>

                                {/* Selected indicator */}
                                {isSelected && (
                                    <motion.div
                                        className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white"
                                        layoutId="selectedIndicator"
                                        initial={false}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Footer info */}
            <div className="border-t border-[#262626] p-4">
                <p className="text-xs text-[#A3A3A3] text-center">
                    Current: <span className="text-white font-medium">{selectedTone.label}</span>
                </p>
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
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed right-0 top-0 z-50 h-full w-72 bg-[#171717] md:hidden"
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
        <aside className="hidden md:flex h-full w-72 flex-col border-l border-[#262626] bg-[#171717]">
            {content}
        </aside>
    );
}
