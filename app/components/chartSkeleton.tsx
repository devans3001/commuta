import { Skeleton } from "@/components/ui/skeleton"; // Using shadcn's Skeleton

import { Card, CardContent, CardHeader } from "@/components/ui/card";
interface ChartSkeletonProps {
  title?: string;
  height?: string;
}

export function ChartSkeleton({ title = "Loading Chart...", height = "350px" }: ChartSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend skeleton */}
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          
          {/* Chart area skeleton */}
          <div className={`relative h-[${height}] overflow-hidden rounded-lg bg-muted/30`}>
            {/* Grid lines simulation */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-px w-full bg-border/50" />
              ))}
            </div>
            <div className="absolute inset-0 flex justify-between px-8">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-full w-px bg-border/50" />
              ))}
            </div>
            
            {/* Shimmer bars - animated */}
            <div className="absolute inset-0 flex items-end justify-center space-x-4 px-8 pb-8">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="relative flex-1">
                  <div className="absolute bottom-0 left-1/4 w-1/2">
                    {/* Primary bar */}
                    <div className="relative overflow-hidden rounded-t-md">
                      <Skeleton 
                        className="h-32 w-full" 
                        style={{ 
                          animationDelay: `${i * 0.1}s`,
                          height: `${Math.max(30, Math.random() * 80 + 20)}%`
                        }} 
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-1/4 w-1/2">
                    {/* Secondary bar */}
                    <div className="relative overflow-hidden rounded-t-md">
                      <Skeleton 
                        className="h-24 w-full" 
                        style={{ 
                          animationDelay: `${i * 0.1 + 0.05}s`,
                          height: `${Math.max(20, Math.random() * 60 + 20)}%`
                        }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* X-axis labels skeleton */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-6 py-3">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-3 w-12" />
              ))}
            </div>
            
            {/* Y-axis labels skeleton */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-8 px-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-3 w-8 ml-auto" />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
