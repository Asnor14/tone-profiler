'use client';

import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import Button from '@/app/components/ui/Button';

interface MobileHeaderProps {
    onLeftMenuToggle: () => void;
}

export default function MobileHeader({ onLeftMenuToggle }: MobileHeaderProps) {
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
                aria-label="Open menu"
            >
                <Menu size={20} />
            </Button>

            {/* Logo - Center */}
            <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">C</span>
                </div>
                <h1 className="text-lg font-semibold text-white">
                    ChadGPT
                </h1>
            </div>

            {/* Spacer for balance */}
            <div className="w-10" />
        </motion.header>
    );
}
