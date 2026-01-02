'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'icon';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

        const variants = {
            primary: 'bg-white text-black hover:bg-gray-200 active:bg-gray-300',
            ghost: 'bg-transparent text-white hover:bg-[#262626] active:bg-[#333]',
            icon: 'bg-transparent text-[#A3A3A3] hover:text-white hover:bg-[#262626] rounded-full',
        };

        const sizes = {
            sm: 'h-8 px-3 text-sm rounded-lg',
            md: 'h-10 px-4 text-sm rounded-lg',
            lg: 'h-12 px-6 text-base rounded-xl',
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
