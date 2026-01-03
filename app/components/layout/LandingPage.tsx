'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
    Zap,
    Brain,
    Layers,
    MessageSquare,
    Upload,
    Settings,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    CheckCircle,
    Activity
} from 'lucide-react';

interface LandingPageProps {
    onStart: () => void;
}

// Persona data for showcase
const PERSONAS = [
    {
        id: 'neutral',
        name: 'Default Chad',
        descriptor: 'The Balanced',
        image: '/images/1.png',
        sample: {
            original: "I'll be there soon.",
            transformed: "I'll be arriving shortly."
        }
    },
    {
        id: 'formal',
        name: 'Formal Gentleman',
        descriptor: 'The Professional',
        image: '/images/2.png',
        sample: {
            original: "Can you help me?",
            transformed: "I would be most grateful for your assistance in this matter."
        }
    },
    {
        id: 'urgent',
        name: 'Urgent Commander',
        descriptor: 'The Director',
        image: '/images/3.png',
        sample: {
            original: "Please finish the report.",
            transformed: "COMPLETE THE REPORT. DEADLINE IS NON-NEGOTIABLE. EXECUTE NOW."
        }
    },
    {
        id: 'optimistic',
        name: 'Optimistic Believer',
        descriptor: 'The Motivator',
        image: '/images/4.png',
        sample: {
            original: "This might be difficult.",
            transformed: "This is an amazing opportunity to grow and learn something incredible!"
        }
    },
    {
        id: 'sarcastic',
        name: 'Sarcastic Skeptic',
        descriptor: 'The Cynic',
        image: '/images/5.png',
        sample: {
            original: "I'm arriving.",
            transformed: "Oh look who finally decided to grace us with their presence."
        }
    }
];

// Team members
const TEAM_MEMBERS = [
    'Quincey Lorin Ellazo',
    'Asnor Arellanon',
    'Kristopher Kyle Palawan',
    'Paul Xyre Asanza'
];

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// Feature Card Component
function FeatureCard({ icon: Icon, title, description }: {
    icon: React.ElementType;
    title: string;
    description: string;
}) {
    return (
        <motion.div
            variants={fadeInUp}
            className="group relative rounded-2xl border border-[#262626] bg-[#171717] p-6 transition-all duration-300 hover:border-[#525252] hover:bg-[#1a1a1a]"
        >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#262626] to-[#171717] shadow-lg">
                <Icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm leading-relaxed text-[#A3A3A3]">{description}</p>
        </motion.div>
    );
}

// Persona Card Component
function PersonaCard({ persona }: { persona: typeof PERSONAS[0] }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            variants={fadeInUp}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative flex-shrink-0 w-48 rounded-2xl border border-[#262626] bg-[#171717] p-4 transition-all duration-300 hover:border-[#525252] hover:bg-[#1a1a1a] cursor-pointer"
        >
            <div className="flex flex-col items-center text-center">
                <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-[#262626] mb-3">
                    <Image
                        src={persona.image}
                        alt={persona.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <h3 className="text-sm font-semibold text-white">{persona.name}</h3>
                <p className="text-xs text-[#525252] mt-1">{persona.descriptor}</p>
            </div>

            {/* Hover tooltip with sample */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 rounded-xl border border-[#262626] bg-[#0a0a0a] p-3 shadow-xl z-20 pointer-events-none"
            >
                <p className="text-xs text-[#525252] mb-1">Original:</p>
                <p className="text-xs text-[#A3A3A3] mb-2">"{persona.sample.original}"</p>
                <p className="text-xs text-[#525252] mb-1">{persona.name}:</p>
                <p className="text-xs text-white">"{persona.sample.transformed}"</p>
            </motion.div>
        </motion.div>
    );
}

// Step Card Component
function StepCard({ step, title, description, icon: Icon }: {
    step: number;
    title: string;
    description: string;
    icon: React.ElementType;
}) {
    return (
        <motion.div
            variants={fadeInUp}
            className="flex gap-4"
        >
            <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black font-bold">
                    {step}
                </div>
                {step < 3 && <div className="mt-2 h-full w-px bg-[#262626]" />}
            </div>
            <div className="flex-1 pb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5 text-[#A3A3A3]" />
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                </div>
                <p className="text-sm text-[#A3A3A3] leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
}

// Troubleshooting Item Component
function TroubleshootItem({ problem, solution }: { problem: string; solution: string }) {
    return (
        <motion.div
            variants={fadeInUp}
            className="flex gap-3 py-3 border-b border-[#262626] last:border-0"
        >
            <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
                <p className="text-sm text-white font-medium">{problem}</p>
                <p className="text-xs text-[#A3A3A3] mt-1 flex items-start gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                    {solution}
                </p>
            </div>
        </motion.div>
    );
}

export default function LandingPage({ onStart }: LandingPageProps) {
    const [troubleshootOpen, setTroubleshootOpen] = useState(false);

    return (
        <div className="min-h-screen w-full overflow-y-auto bg-black">
            {/* ====== HERO SECTION ====== */}
            <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24">
                {/* Background Glow */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-3xl" />
                </div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="relative z-10 flex flex-col items-center text-center"
                >
                    {/* Logo */}
                    <motion.div
                        variants={scaleIn}
                        className="relative mb-8"
                    >
                        <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-2xl" />
                        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white/20 shadow-2xl">
                            <Image
                                src="/images/1.png"
                                alt="ChadGPT"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        variants={fadeInUp}
                        className="mb-4 text-5xl font-bold text-white md:text-6xl lg:text-7xl"
                    >
                        ChadGPT
                    </motion.h1>

                    {/* Headline */}
                    <motion.p
                        variants={fadeInUp}
                        className="mb-3 text-xl font-medium text-white md:text-2xl"
                    >
                        Sentiment & Tone Profiler Engine
                    </motion.p>

                    {/* Sub-headline */}
                    <motion.p
                        variants={fadeInUp}
                        className="mb-10 max-w-xl text-sm text-[#A3A3A3] md:text-base"
                    >
                        Advanced natural language processing using FLAN-T5 and Llama 3.2 architectures.
                    </motion.p>

                    {/* CTA Button */}
                    <motion.button
                        variants={scaleIn}
                        onClick={onStart}
                        className="group relative overflow-hidden rounded-full bg-white px-10 py-4 text-lg font-bold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                    >
                        <span className="relative z-10">INITIALIZE SYSTEM</span>
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        />
                    </motion.button>

                    {/* Scroll indicator */}
                    <motion.div
                        variants={fadeInUp}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    >
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-[#525252]"
                        >
                            <ChevronDown size={24} />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ====== MISSION BRIEF (ABOUT) SECTION ====== */}
            <section className="border-t border-[#171717] px-6 py-24">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="mx-auto max-w-3xl text-center"
                >
                    <motion.div variants={fadeInUp} className="mb-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 mb-6">
                            <Activity className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-400">System Active</span>
                        </div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#525252]">
                            Mission Directive
                        </p>
                        <h2 className="text-3xl font-bold text-white md:text-4xl">
                            Project Directive: CPE22
                        </h2>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="space-y-4">
                        <p className="text-lg leading-relaxed text-gray-300">
                            ChadGPT is a <span className="text-white font-semibold">Tone Profiling Engine</span> developed
                            to demonstrate real-time style transfer capabilities using advanced natural language processing.
                        </p>
                        <p className="text-lg leading-relaxed text-gray-300">
                            The system leverages <span className="text-white font-semibold">High-Level N-Gram models</span> via
                            Google's FLAN-T5 architecture for fast, instruction-tuned outputs, and
                            <span className="text-white font-semibold"> Generative Reasoning</span> via Meta's Llama 3.2
                            for nuanced, context-aware transformations.
                        </p>
                        <p className="text-lg leading-relaxed text-gray-300">
                            Users can seamlessly switch between five distinct "Chad Personas" to transform any input text
                            into their desired communication style—from professional formality to sarcastic wit.
                        </p>
                    </motion.div>
                </motion.div>
            </section>

            {/* ====== PERSONA MATRIX (SHOWCASE) SECTION ====== */}
            <section className="border-t border-[#171717] px-6 py-24 overflow-hidden">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="mx-auto max-w-5xl"
                >
                    <motion.div variants={fadeInUp} className="mb-12 text-center">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#525252]">
                            Persona Matrix
                        </p>
                        <h2 className="text-3xl font-bold text-white md:text-4xl">
                            Select Your Modality
                        </h2>
                        <p className="mt-3 text-sm text-[#A3A3A3]">
                            Hover over a persona to see sample transformations
                        </p>
                    </motion.div>

                    {/* Horizontal scrolling personas */}
                    <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-thin justify-center flex-wrap">
                        {PERSONAS.map((persona) => (
                            <PersonaCard key={persona.id} persona={persona} />
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ====== SYSTEM INTELLIGENCE (FEATURE GLOSSARY) SECTION ====== */}
            <section className="border-t border-[#171717] px-6 py-24">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="mx-auto max-w-5xl"
                >
                    <motion.div variants={fadeInUp} className="mb-12 text-center">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#525252]">
                            System Intelligence
                        </p>
                        <h2 className="text-3xl font-bold text-white md:text-4xl">
                            Core Technology Stack
                        </h2>
                    </motion.div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <FeatureCard
                            icon={Layers}
                            title="Multi-Variant Synthesis"
                            description="Utilizes high-level N-gram models to restructure sentence syntax without losing semantic meaning. Preserves context through semantic vector analysis."
                        />
                        <FeatureCard
                            icon={Brain}
                            title="Tone Profiling"
                            description="Dynamic style transfer supporting Formal, Urgent, Optimistic, and Sarcastic modalities. Real-time sentiment analysis with persona-specific output."
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Hybrid Architecture"
                            description="Seamless switching between Instruction-Tuned (FLAN-T5) and Generative (Llama 3.2) models. Adaptive processing based on task complexity."
                        />
                    </div>
                </motion.div>
            </section>

            {/* ====== USER MANUAL SECTION ====== */}
            <section className="border-t border-[#171717] px-6 py-24">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="mx-auto max-w-2xl"
                >
                    <motion.div variants={fadeInUp} className="mb-12 text-center">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#525252]">
                            Quick Start Guide
                        </p>
                        <h2 className="text-3xl font-bold text-white md:text-4xl">
                            How to Use ChadGPT
                        </h2>
                    </motion.div>

                    <div className="space-y-2">
                        <StepCard
                            step={1}
                            icon={Settings}
                            title="Select Model"
                            description="Choose between Speed (FLAN-T5) or High Reasoning (Llama 3.2) via the top-left model selector dropdown. T5 is faster, Llama provides more nuanced responses."
                        />
                        <StepCard
                            step={2}
                            icon={MessageSquare}
                            title="Select Persona"
                            description="Activate a specific tone profiling matrix using the left sidebar. Options include Default Chad, Formal Gentleman, Urgent Commander, Optimistic Believer, and Sarcastic Skeptic."
                        />
                        <StepCard
                            step={3}
                            icon={Upload}
                            title="Input Data"
                            description="Type text directly or click the file icon to upload .txt or .docx files for immediate processing. The system will rewrite your content in the selected persona's style."
                        />
                    </div>
                </motion.div>
            </section>

            {/* ====== TROUBLESHOOTING SECTION ====== */}
            <section className="border-t border-[#171717] px-6 py-24">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="mx-auto max-w-2xl"
                >
                    <motion.button
                        variants={fadeInUp}
                        onClick={() => setTroubleshootOpen(!troubleshootOpen)}
                        className="flex w-full items-center justify-between rounded-xl border border-[#262626] bg-[#171717] p-5 transition-all hover:border-[#525252]"
                    >
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                            <span className="font-semibold text-white">System Status & Troubleshooting</span>
                        </div>
                        {troubleshootOpen ? (
                            <ChevronUp className="h-5 w-5 text-[#A3A3A3]" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-[#A3A3A3]" />
                        )}
                    </motion.button>

                    <motion.div
                        initial={false}
                        animate={{
                            height: troubleshootOpen ? 'auto' : 0,
                            opacity: troubleshootOpen ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 rounded-xl border border-[#262626] bg-[#171717] p-5">
                            <TroubleshootItem
                                problem="Model Loading Failed?"
                                solution="Ensure the Python Backend is running on Port 8000. Run 'python -m uvicorn main:app --reload' in the api/ folder."
                            />
                            <TroubleshootItem
                                problem="Llama 3.2 Not Responding?"
                                solution="Verify Ollama is running ('ollama serve') and the llama3.2 model is pulled. Switch to FLAN-T5 for CPU-only machines."
                            />
                            <TroubleshootItem
                                problem="Response Timeout?"
                                solution="Input text may exceed the optimal context window. Try shorter inputs or switch to FLAN-T5 for faster processing."
                            />
                            <TroubleshootItem
                                problem="File Upload Not Working?"
                                solution="Only .txt and .docx files are supported. Ensure file size is under 1MB for optimal performance."
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ====== SYSTEM ARCHITECTS (FOOTER CREDITS) SECTION ====== */}
            <section className="border-t border-[#171717] px-6 py-24">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="mx-auto max-w-xl text-center"
                >
                    <motion.div variants={fadeInUp}>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#525252]">
                            System Architects
                        </p>
                        <h2 className="mb-8 text-2xl font-bold text-white md:text-3xl">
                            The Team Behind ChadGPT
                        </h2>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="mb-8">
                        <p className="text-lg text-gray-300 mb-4">
                            Engineered by:
                        </p>
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                            {TEAM_MEMBERS.map((member, index) => (
                                <span key={member} className="text-white font-medium">
                                    {member}{index < TEAM_MEMBERS.length - 1 && <span className="text-[#525252] ml-4">•</span>}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        <button
                            onClick={onStart}
                            className="rounded-full border-2 border-white bg-transparent px-8 py-3 font-semibold text-white transition-all hover:bg-white hover:text-black mb-8"
                        >
                            LAUNCH ChadGPT
                        </button>
                        <p className="text-sm text-[#A3A3A3] mb-2">
                            Submitted for <span className="text-white font-medium">CPE22</span> - Final Requirement
                        </p>
                        <p className="text-xs text-[#525252]">
                            v1.0.0 • Built with Next.js, FastAPI, FLAN-T5 & Llama 3.2
                        </p>
                    </motion.div>
                </motion.div>
            </section>
        </div>
    );
}
