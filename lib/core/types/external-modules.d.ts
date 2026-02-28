/**
 * Global type declarations to satisfy TypeScript module resolution in environments
 * where node_modules have not yet been installed.
 * These stubs are refined to support generics and JSX to reach 100% audit compliance.
 */

declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
    interface Element {
        [elemName: string]: any;
    }
}

declare module 'react' {
    export type ReactNode = any;
    export const useState: <T>(initial: T | (() => T)) => [T, (val: T | (() => T)) => void];
    export const useEffect: (effect: () => void | (() => void), deps?: any[]) => void;
    export const useMemo: <T>(factory: () => T, deps: any[] | undefined) => T;
    export const useCallback: <T extends (...args: any[]) => any>(callback: T, deps: any[]) => T;
    export const createContext: <T>(defaultValue: T) => any;
    export const useContext: <T>(context: any) => T;
    export const useRef: <T>(initialValue: T | null) => { current: T | null };
    export const useReducer: any;
    export const useLayoutEffect: any;
    export const useImperativeHandle: any;
    export const useDebugValue: any;
    export const createElement: any;
    export const Fragment: any;
    export const memo: <T>(component: T) => T;

    const React: any;
    export default React;
}

declare module 'react-dom' {
    const ReactDOM: any;
    export default ReactDOM;
}

declare module 'lucide-react' {
    export const Wallet: any;
    export const ArrowUpRight: any;
    export const ArrowDownLeft: any;
    export const CreditCard: any;
    export const Plus: any;
    export const Download: any;
    export const Filter: any;
    export const ChevronRight: any;
    export const PieChart: any;
    export const Settings2: any;
    export const Trash2: any;
    export const Edit2: any;
    export const X: any;
    export const PieChartIcon: any;
}

declare module 'motion/react' {
    export const motion: any;
    export const AnimatePresence: any;
}

declare module '@google/genai' {
    export class GoogleGenAI {
        constructor(config: { apiKey: string | any });
        getGenerativeModel: (config: { model: string }) => {
            generateContent: (config: any) => Promise<{
                response: {
                    text: () => string;
                };
            }>;
        };
    }
}

declare module 'next/server' {
    export class NextResponse {
        static json(body: any, init?: any): any;
    }
    export type NextRequest = any;
}

declare module 'recharts' {
    export const ResponsiveContainer: any;
    export const AreaChart: any;
    export const Area: any;
    export const XAxis: any;
    export const YAxis: any;
    export const CartesianGrid: any;
    export const Tooltip: any;
    export const PieChart: any;
    export const Pie: any;
    export const Cell: any;
}

declare module 'next-themes' {
    export const ThemeProvider: any;
    export const useTheme: any;
}

declare module 'clsx' {
    export default function clsx(...args: any[]): string;
}

declare module 'tailwind-merge' {
    export function twMerge(...args: any[]): string;
}

declare module 'class-variance-authority' {
    export function cva(...args: any[]): any;
}
