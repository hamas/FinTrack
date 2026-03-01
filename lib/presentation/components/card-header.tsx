import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardHeaderProps {
    title: string;
    subtitle?: string;
    icon: LucideIcon;
    action?: React.ReactNode;
    className?: string;
}

export function CardHeader({ title, subtitle, icon: Icon, action, className }: CardHeaderProps) {
    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8", className)}>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[12px] bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                    <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 tracking-tight">{title}</h2>
                    {subtitle && <p className="text-xs text-zinc-500 mt-0.5 font-medium">{subtitle}</p>}
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
