import React from "react";
import { cn } from "@/lib/utils";

interface FloatingCardProps extends React.HTMLAttributes<HTMLDivElement> {
    depth?: "low" | "medium" | "high";
    glowOnHover?: boolean;
    children: React.ReactNode;
}

const FloatingCard = React.forwardRef<HTMLDivElement, FloatingCardProps>(
    ({ className, depth = "medium", glowOnHover = true, children, ...props }, ref) => {
        const depthClasses = {
            low: "hover:-translate-y-1 hover:shadow-lg",
            medium: "hover:-translate-y-2 hover:shadow-xl",
            high: "hover:-translate-y-3 hover:shadow-2xl",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "relative transition-all duration-500 ease-out transform-gpu perspective-1000",
                    "bg-card text-card-foreground rounded-xl border shadow-sm",
                    depthClasses[depth],
                    glowOnHover && "hover:shadow-primary/20 dark:hover:shadow-primary/10",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

FloatingCard.displayName = "FloatingCard";

export { FloatingCard };
