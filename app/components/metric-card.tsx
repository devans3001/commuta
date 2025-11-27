
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function MetricCard({ title, value, icon: Icon, trend, variant = "default" }: MetricCardProps) {
  const variantStyles = {
    default: "border-border",
    accent: "border-accent/20 bg-accent/5",
    success: "border-success/20 bg-success/5",
    info: "border-info/20 bg-info/5",
  };

  const iconStyles = {
    default: "text-muted-foreground",
    accent: "text-accent",
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
