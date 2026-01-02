'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { TONES } from '@/app/lib/constants';

interface LoadingSequenceProps {
    onComplete: () => void;
}

export default function LoadingSequence({ onComplete }: LoadingSequenceProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (currentIndex < TONES.length) {
            const timer = setTimeout(() => {
                setCurrentIndex((prev) => prev + 1);
            }, 1500);
            return () => clearTimeout(timer);
        } else {
            const completeTimer = setTimeout(() => {
                setIsComplete(true);
                setTimeout(onComplete, 500);
            }, 500);
            return () => clearTimeout(completeTimer);
        }
    }, [currentIndex, onComplete]);

    const currentTone = TONES[currentIndex] || TONES[TONES.length - 1];

    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Background image with fade transition */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            className="absolute inset-0"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 0.3, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Image
                                src={currentTone.image}
                                alt={currentTone.label}
                                fill
                                className="object-cover object-center"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Central content */}
                    <div className="relative z-10 flex flex-col items-center gap-8 px-4">
                        {/* Animated avatar */}
                        <motion.div
                            className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-white/20"
                            animate={{
                                boxShadow: [
                                    '0 0 0 0 rgba(255,255,255,0)',
                                    '0 0 30px 10px rgba(255,255,255,0.2)',
                                    '0 0 0 0 rgba(255,255,255,0)',
                                ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="h-full w-full"
                                >
                                    <Image
                                        src={currentTone.image}
                                        alt={currentTone.label}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>

                        {/* Loading text */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="text-center"
                            >
                                <h2 className="mb-2 text-2xl font-semibold text-white">
                                    {currentTone.label}
                                </h2>
                                <p className="text-lg text-[#A3A3A3]">
                                    {currentTone.loadingText}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Progress bar */}
                        <div className="h-1 w-64 overflow-hidden rounded-full bg-[#262626]">
                            <motion.div
                                className="h-full bg-white"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentIndex + 1) / TONES.length) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>

                        {/* Progress dots */}
                        <div className="flex gap-2">
                            {TONES.map((_, index) => (
                                <motion.div
                                    key={index}
                                    className={`h-2 w-2 rounded-full ${index <= currentIndex ? 'bg-white' : 'bg-[#262626]'
                                        }`}
                                    animate={{
                                        scale: index === currentIndex ? [1, 1.3, 1] : 1,
                                    }}
                                    transition={{ duration: 0.5 }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
