import React from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    intensity?: "light" | "medium" | "strong";
    border?: boolean;
    children: React.ReactNode;
}

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
    ({ className, intensity = "medium", border = true, children, ...props }, ref) => {
        const intensityClasses = {
            light: "bg-white/40 dark:bg-black/40 backdrop-blur-md",
            medium: "glass",
            strong: "glass-strong",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-xl transition-all duration-300",
                    intensityClasses[intensity],
                    border && "border border-white/20 dark:border-white/10",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

GlassPanel.displayName = "GlassPanel";

export { GlassPanel };
