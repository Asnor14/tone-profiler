import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
            },
            colors: {
                "bg-primary": "#000000",
                "bg-secondary": "#171717",
                "border-custom": "#262626",
                "text-primary": "#FFFFFF",
                "text-secondary": "#A3A3A3",
            },
        },
    },
    plugins: [],
};

export default config;
