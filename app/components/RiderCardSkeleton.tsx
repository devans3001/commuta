import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export function RiderCardSkeleton() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2 w-full">
            <Skeleton className="h-5 w-32" />  {/* Name */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16" /> {/* Active/Inactive */}
              <Skeleton className="h-5 w-12" /> {/* Gender */}
            </div>
          </div>

          <div className="text-right">
            <Skeleton className="h-4 w-10" /> {/* Rating */}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* label */}
          <Skeleton className="h-4 w-full" /> {/* email */}
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-20" /> {/* label */}
          <Skeleton className="h-4 w-32" /> {/* phone */}
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-16" /> {/* label */}
          <Skeleton className="h-4 w-24" /> {/* joined date */}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        <Button variant="outline" className="w-full mt-4" disabled>
          <Skeleton className="h-4 w-20 mx-auto" />
        </Button>
      </CardContent>
    </Card>
  );
}
