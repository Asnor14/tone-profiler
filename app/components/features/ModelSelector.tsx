'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Sparkles, Zap } from 'lucide-react';
import { MODELS, Model } from '@/app/lib/constants';

interface ModelSelectorProps {
    selectedModel: Model;
    onSelectModel: (model: Model) => void;
}

export default function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getModelIcon = (id: string) => {
        return id === 'flan-t5' ? <Zap size={14} /> : <Sparkles size={14} />;
    };

    return (
        <div ref={dropdownRef} className="relative z-20">
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-lg bg-[#171717] border border-[#262626] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#262626]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {getModelIcon(selectedModel.id)}
                <span>{selectedModel.name}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={16} className="text-[#A3A3A3]" />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-[#262626] bg-[#171717] shadow-xl"
                    >
                        {MODELS.map((model) => {
                            const isSelected = selectedModel.id === model.id;
                            return (
                                <motion.button
                                    key={model.id}
                                    onClick={() => {
                                        onSelectModel(model);
                                        setIsOpen(false);
                                    }}
                                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${isSelected ? 'bg-[#262626]' : 'hover:bg-[#262626]/50'
                                        }`}
                                    whileHover={{ x: 2 }}
                                >
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isSelected ? 'bg-white text-black' : 'bg-[#262626] text-[#A3A3A3]'
                                        }`}>
                                        {getModelIcon(model.id)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-medium ${isSelected ? 'text-white' : 'text-[#A3A3A3]'}`}>
                                                {model.name}
                                            </span>
                                            {isSelected && <Check size={14} className="text-white" />}
                                        </div>
                                        <span className="text-xs text-[#A3A3A3]">{model.description}</span>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
