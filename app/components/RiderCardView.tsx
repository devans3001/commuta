import React from "react";
import { Button } from "./ui/button";
import { CheckCircle, Eye, Star, XCircle } from "lucide-react";
import { RiderCardSkeleton } from "./RiderCardSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { Rider } from "@/lib/mockData";
import { Badge } from "./ui/badge";
import { formatDate, formatPhone } from "@/lib/helper";
import { useNavigate } from "react-router";

function CardView({
  isLoading,
  paginatedRiders,
}: {
  isLoading: boolean;
  paginatedRiders: Rider[];
}) {
  const navigate = useNavigate();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RiderCardSkeleton />
        <RiderCardSkeleton />
        <RiderCardSkeleton />
      </div>
    );
  }

  // Handle empty state when paginatedRiders is empty
  if (!paginatedRiders || paginatedRiders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Eye className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Riders Found</h3>
        <p className="text-muted-foreground max-w-md">
          There are no riders to display. Try adjusting your filters or search
          criteria.
        </p>
      </div>
    );
  }

  // Render the riders when we have data
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {paginatedRiders.map((rider) => (
        <Card key={rider.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{rider.name}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={rider.isActive === "1" ? "default" : "secondary"}
                  >
                    {rider.isActive === "1" ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">{rider.gender}</Badge>
                </div>
              </div>
              <div className="text-right">
                {rider.averageRating > 0 && (
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-semibold">{rider.averageRating}</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Email</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{rider.emailAddress}</p>
                  {rider.isEmailVerified === "1" ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {formatPhone(rider.phoneNumber)}
                  </p>
                  {rider.isPhoneVerified === "1" ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Joined</p>
                <p className="font-medium">{formatDate(rider.createdAt)}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">
                    {rider.totalRides}
                  </p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-500">
                    {rider.completedRides}
                  </p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-destructive">
                    {rider.cancelledRides}
                  </p>
                  <p className="text-xs text-muted-foreground">Cancelled</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate(`/admin/riders/${rider.id}`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Profile
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default CardView;
