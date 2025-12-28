
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton"; 

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "accent" | "success" | "info";
}

interface MetricCardSkeletonProps {
  variant?: "default" | "info" | "success" | "accent";
  className?: string;
}


export function MetricCard({ title, value, icon: Icon, trend, variant = "default" }: MetricCardProps) {
  const variantStyles = {
    default: "border-border",
    accent: "border-accent/20 bg-chart-1/5",
    success: "border-success/20 bg-success/5",
    info: "border-info/20 bg-info/5",
  };

  const iconStyles = {
    default: "text-muted-foreground",
    accent: "text-chart-1",
    success: "text-success",
    info: "text-info",
  };

  return (
    <Card className={cn("transition-all hover:shadow-md", variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground">
                <span className={cn("font-medium", trend.value > 0 ? "text-success" : "text-destructive")}>
                  {trend.value > 0 ? "+" : ""}{trend.value}%
                </span>{" "}
                {trend.label}
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-xl bg-muted/50", iconStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}




export function MetricCardSkeleton({ variant = "default", className }: MetricCardSkeletonProps) {
  const variantStyles = {
    default: "border-border/50",
    info: "border-blue-500/20 bg-blue-500/5",
    success: "border-green-500/20 bg-green-500/5",
    accent: "border-purple-500/20 bg-purple-500/5",
  };

  const iconStyles = {
    default: "bg-muted/30",
    info: "bg-blue-500/10",
    success: "bg-green-500/10",
    accent: "bg-purple-500/10",
  };

  return (
    <Card className={cn("transition-all animate-pulse", variantStyles[variant], className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            {/* Title skeleton */}
            <Skeleton className="h-4 w-24 bg-muted-foreground/20" />
            
            {/* Value skeleton */}
            <Skeleton className="h-9 w-32 bg-foreground/20" />
            
            {/* Trend skeleton */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-3 w-16 bg-muted-foreground/20" />
              <Skeleton className="h-3 w-20 bg-muted-foreground/20" />
            </div>
          </div>
          
          {/* Icon skeleton */}
          <div className={cn("p-3 rounded-xl", iconStyles[variant])}>
            <Skeleton className="h-6 w-6 rounded-full bg-foreground/20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}