'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Plus, Wifi } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

export interface SavedCard {
    id: string;
    brand: 'visa' | 'mastercard';
    type: 'debit' | 'credit';
    name: string;
    last4: string;
    exp: string;
    colorScheme: 'primary' | 'secondary' | 'emerald';
    liquidity: number;
}

const VisaLogo = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.331 0.25L11.583 8.356H8.729L7.218 1.637C7.072 1.096 6.916 0.899 6.469 0.618C5.356 0.056 3.494 -0.064 2.296 0.021L2.379 0.395C3.253 0.5 4.542 0.811 5.093 1.259C5.509 1.581 5.665 1.83 5.821 2.454L8.147 8.356H11.085L16.276 0.25H14.331ZM22.564 5.671C22.585 3.518 19.549 3.403 19.57 2.124C19.58 1.749 19.955 1.333 20.735 1.229C21.12 1.177 22.014 1.146 23.002 1.614L23.407 0.075C22.887 -0.112 21.847 -0.25 20.652 -0.25C18.062 -0.25 16.275 1.144 16.264 3.099C16.254 4.534 17.564 5.335 18.573 5.823C19.602 6.322 19.945 6.645 19.945 7.102C19.934 7.799 19.092 8.111 18.271 8.111C16.898 8.111 16.098 7.736 15.421 7.424L15 9.005C15.541 9.255 16.882 9.5 18.312 9.5C21.089 9.5 22.564 8.127 22.564 6.076M29.586 9.344H32L29.89 0.25H27.531C27.052 0.25 26.657 0.541 26.47 0.967L22.618 9.344H25.561L26.152 7.721H29.742L29.586 9.344ZM26.963 5.483L28.315 1.762L28.71 5.483H26.963ZM12.164 9.344H14.94L12.56 0.25H9.794L12.164 9.344Z" />
    </svg>
);

const MastercardLogo = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="10" fill="#EB001B" />
        <circle cx="22" cy="10" r="10" fill="#F79E1B" />
        <path d="M16 18.66C17.653 16.574 18.625 13.435 18.625 10C18.625 6.565 17.653 3.426 16 1.34C14.347 3.426 13.375 6.565 13.375 10C13.375 13.435 14.347 16.574 16 18.66Z" fill="#FF5F00" />
    </svg>
);

const MOCK_CARDS: SavedCard[] = [
    {
        id: 'c1',
        brand: 'visa',
        type: 'debit',
        name: 'Salary Account',
        last4: '4281',
        exp: '12/28',
        colorScheme: 'emerald',
        liquidity: 12500.00
    },
    {
        id: 'c2',
        brand: 'mastercard',
        type: 'credit',
        name: 'Business Expenses',
        last4: '8829',
        exp: '08/26',
        colorScheme: 'primary',
        liquidity: 45200.50
    },
    {
        id: 'c3',
        brand: 'visa',
        type: 'credit',
        name: 'Travel & Dining',
        last4: '3002',
        exp: '05/29',
        colorScheme: 'secondary',
        liquidity: 8500.00
    }
];

const gradientMap = {
    primary: 'from-[#1A1D23] to-[#000000]',
    secondary: 'from-[#10141D] to-[#080B10]',
    emerald: 'from-[#0D2818] to-[#05140B]'
};

export function CardStack() {
    const [cards, setCards] = React.useState<SavedCard[]>(MOCK_CARDS);
    const [isHovered, setIsHovered] = React.useState(false);

    // Moves the clicked card to the front of the array (index 0)
    const bringToFront = (id: string) => {
        setCards((currentCards) => {
            const cardIndex = currentCards.findIndex((c) => c.id === id);
            if (cardIndex <= 0) return currentCards;

            const newCards = [...currentCards];
            const [clickedCard] = newCards.splice(cardIndex, 1);
            newCards.unshift(clickedCard);
            return newCards;
        });
    };

    return (
        <div
            className="relative w-full h-[320px] sm:h-[400px] perspective-1000"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="absolute inset-x-0 bottom-0 top-12 max-w-sm mx-auto">
                <AnimatePresence>
                    {/* Render cards in reverse so array[0] is visibly on top in the DOM stacking context */}
                    {[...cards].reverse().map((card, reversedIndex) => {
                        const index = cards.length - 1 - reversedIndex;

                        // Physical displacement physics
                        // Stack offset is 48px to show headers. Expansion on hover slides it down to 80px gaps.
                        const yOffset = isHovered ? index * 80 : index * 48;
                        const scaleOffset = 1 - (index * 0.05);
                        const zIndexOffset = cards.length - index;

                        return (
                            <motion.div
                                key={card.id}
                                layout
                                onClick={() => bringToFront(card.id)}
                                initial={false}
                                animate={{
                                    top: yOffset,
                                    scale: scaleOffset,
                                    zIndex: zIndexOffset,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 350,
                                    damping: 25,
                                    mass: 0.8
                                }}
                                whileHover={{ scale: index === 0 ? 1 : scaleOffset }}
                                className={cn(
                                    "absolute w-full aspect-[1.586/1] rounded-[24px] p-6 sm:p-8 cursor-pointer shadow-2xl overflow-hidden",
                                    "bg-gradient-to-br text-white",
                                    gradientMap[card.colorScheme],
                                    "border border-black shadow-[rgba(0,0,0,0.5)_0px_30px_50px_-12px]"
                                )}
                                style={{
                                    transformOrigin: 'top center'
                                }}
                            >
                                {/* 3% Brushed Metal Noise Texture */}
                                <div
                                    className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
                                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
                                />

                                {/* ID-1 Hard Top Edge Highlight to catch physical wallet lighting */}
                                <div className="absolute inset-x-0 top-0 h-px bg-white/10 pointer-events-none z-20"></div>

                                <div className="flex flex-col h-full relative z-10 justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            {/* Realistic EMV Custom Chip & Contactless */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-[42px] h-[32px] rounded-md bg-gradient-to-br from-[#E2C275] to-[#AA7C11] overflow-hidden relative shadow-inner">
                                                    <div className="absolute inset-[1px] border border-black/20 rounded-md"></div>
                                                    <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/20"></div>
                                                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-black/20"></div>
                                                    <div className="absolute top-[30%] left-0 right-0 h-[1px] bg-black/20"></div>
                                                    <div className="absolute top-[70%] left-0 right-0 h-[1px] bg-black/20"></div>
                                                </div>
                                                <Wifi className="w-5 h-5 text-white/40 rotate-90" />
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <h2 className="text-[13px] font-bold tracking-[0.2em] text-white/70 uppercase drop-shadow-sm">{card.name}</h2>
                                            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 truncate mt-1">{card.type}</p>
                                        </div>
                                    </div>

                                    <div
                                        className={cn(
                                            "flex flex-col gap-4 transition-opacity duration-500",
                                            index === 0 ? "opacity-100" : "opacity-0"
                                        )}
                                    >
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest drop-shadow-sm">Available Liquidity</p>
                                            <h3
                                                className="flex font-light tracking-tight text-3xl sm:text-4xl drop-shadow-md"
                                                style={{ fontVariationSettings: '"wdth" 110' }}
                                            >
                                                {formatCurrency(card.liquidity)}
                                            </h3>
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p
                                                    className="text-[18px] sm:text-[22px] font-sans text-white shadow-black/50 drop-shadow-md"
                                                    style={{ fontVariationSettings: '"wdth" 125, "wght" 500', textShadow: '0 1px 2px rgba(0,0,0,0.8)', letterSpacing: '0.2em' }}
                                                >
                                                    •••• •••• •••• {card.last4}
                                                </p>
                                                <div className="flex items-baseline gap-2 mt-2">
                                                    <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Valid Thru</span>
                                                    <span className="text-sm font-semibold text-white/80">{card.exp}</span>
                                                </div>
                                            </div>

                                            {/* Brand Logos */}
                                            <div className="flex items-center shrink-0 ml-4 opacity-90 drop-shadow-xl">
                                                {card.brand === 'mastercard' ? (
                                                    <MastercardLogo className="w-12 h-auto" />
                                                ) : (
                                                    <VisaLogo className="w-14 h-auto" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Subtle base lighting overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent mix-blend-overlay pointer-events-none"></div>
                            </motion.div>
                        );
                    })}

                    {/* Dashed 'Add Card' Background Action */}
                    <motion.div
                        initial={false}
                        animate={{
                            top: isHovered ? cards.length * 80 + 10 : cards.length * 48 + 10,
                            scale: 1 - (cards.length * 0.05),
                            zIndex: 0,
                            opacity: isHovered ? 1 : 0.5
                        }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className={cn(
                            "absolute w-full aspect-[1.586/1] rounded-[24px] p-6 sm:p-8 cursor-pointer flex flex-col items-center justify-center gap-3",
                            "border-2 border-dashed border-zinc-200 dark:border-[#282828] bg-zinc-50 dark:bg-[#1A1D23]",
                            "hover:bg-zinc-100 dark:hover:bg-[#1E2228] transition-colors"
                        )}
                        style={{ transformOrigin: 'top center' }}
                    >
                        <div className="p-4 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Plus className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">Add New Payment Method</span>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
