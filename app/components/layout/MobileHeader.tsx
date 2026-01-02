'use client';

import { motion } from 'framer-motion';
import { Menu, Sparkles } from 'lucide-react';
import Button from '@/app/components/ui/Button';

interface MobileHeaderProps {
    onLeftMenuToggle: () => void;
    onRightMenuToggle: () => void;
}

export default function MobileHeader({ onLeftMenuToggle, onRightMenuToggle }: MobileHeaderProps) {
    return (
        <motion.header
            className="flex md:hidden items-center justify-between border-b border-[#262626] bg-[#171717] px-4 py-3"
            initial={{ y: -60 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Hamburger Menu - Left */}
            <Button
                variant="icon"
                size="sm"
                onClick={onLeftMenuToggle}
                className="h-10 w-10"
                aria-label="Open history"
            >
                <Menu size={20} />
            </Button>

            {/* Logo - Center */}
            <h1 className="text-lg font-semibold text-white">
                ChadGPT
            </h1>

            {/* Tone Selector - Right */}
            <Button
                variant="icon"
                size="sm"
                onClick={onRightMenuToggle}
                className="h-10 w-10"
                aria-label="Select tone"
            >
                <Sparkles size={20} />
            </Button>
        </motion.header>
    );
}
