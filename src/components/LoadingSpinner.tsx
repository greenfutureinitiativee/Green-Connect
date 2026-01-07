import { cn } from "@/lib/utils";
import { Leaf } from "lucide-react";

interface LoadingSpinnerProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
    text?: string;
}

export const LoadingSpinner = ({ className, size = "md", text }: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-24 h-24",
    };

    const iconSizes = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
        xl: "w-12 h-12",
    };

    return (
        <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
            <div className={cn("relative flex items-center justify-center perspective-1000", sizeClasses[size])}>
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin shadow-lg shadow-primary/10" />

                {/* Inner Ring */}
                <div className="absolute inset-2 rounded-full border-4 border-emerald-500/20 border-b-emerald-500 animate-spin-reverse" />

                {/* Center Icon */}
                <div className="relative z-10 animate-pulse">
                    <Leaf className={cn("text-primary", iconSizes[size])} />
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl animate-pulse" />
            </div>

            {text && (
                <p className="text-muted-foreground font-medium animate-pulse text-center">
                    {text}
                </p>
            )}
        </div>
    );
};
