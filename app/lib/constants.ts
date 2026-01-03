import { Tone } from './types';

export interface Model {
    id: string;
    name: string;
    description: string;
}

export const MODELS: Model[] = [
    { id: 'flan-t5', name: 'FLAN-T5', description: 'Fast & Efficient' },
    { id: 'llama-3.2', name: 'Llama 3.2', description: 'High Reasoning' },
];

export const TONES: Tone[] = [
    {
        id: 'neutral',
        label: 'Default Chad',
        image: '/images/1.png',
        loadingText: 'Initializing Default Mode...'
    },
    {
        id: 'formal',
        label: 'Formal Gentleman',
        image: '/images/2.png',
        loadingText: 'Loading Formal Protocols...'
    },
    {
        id: 'urgent',
        label: 'Urgent Commander',
        image: '/images/3.png',
        loadingText: 'Activating Urgent Commander...'
    },
    {
        id: 'optimistic',
        label: 'Optimistic Believer',
        image: '/images/4.png',
        loadingText: 'Optimizing Belief Systems...'
    },
    {
        id: 'sarcastic',
        label: 'Sarcastic Skeptic',
        image: '/images/5.png',
        loadingText: 'Deploying Sarcasm Module...'
    },
];

export const MOCK_CHAT_HISTORY = [
    { id: '1', title: 'Getting started with ChadGPT', createdAt: new Date() },
    { id: '2', title: 'Discussing productivity tips', createdAt: new Date() },
    { id: '3', title: 'Code review session', createdAt: new Date() },
];

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
