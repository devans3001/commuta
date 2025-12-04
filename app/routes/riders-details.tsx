import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Star,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { PageHeader } from "@/components/page-header";
import { mockRiders } from "@/lib/mockData";
import { formatDate, formatPhone } from "@/lib/helper";
import { useRider } from "@/hooks/useRider";
import RiderDetailSkeleton from "@/components/RiderDetailSkeleton";

export default function RiderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useRider(id!);

  console.log(data, "rider detail");

  // Find the rider by ID - adjust property names based on your actual mockData structure
  const rider = data!;

  // Calculate completion rate if we have total rides
  // const completionRate =
  //   rider.totalRides > 0
  //     ? Math.round((rider.completedRides / rider.totalRides) * 100)
  //     : 0;

  if (isLoading) {
    return <RiderDetailSkeleton />;
  }

  if (!rider) {
    return (
      <div className="space-y-8">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/riders")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Riders
          </Button>
          <PageHeader
            title="Rider Not Found"
            description={`No rider found with ID: ${id}`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/riders")}
          className="mb-4 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Riders
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <PageHeader
              title={rider.name}
              description={`Rider ID: ${rider.id}`}
            />
            <div className="flex items-center gap-3 mt-4">
              <Badge variant={rider.isActive === "1" ? "default" : "secondary"}>
                {rider.isActive === "1" ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="outline">{rider.gender}</Badge>
              {rider.averageRating > 0 && (
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold">{rider.averageRating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{rider.emailAddress}</p>
                  </div>
                  {rider.isEmailVerified === "1" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">
                      {formatPhone(rider.phoneNumber)}
                    </p>
                  </div>
                  {rider.isPhoneVerified === "1" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Signup Date</p>
                <p className="font-medium">{formatDate(rider.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">{formatDate(rider.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ride Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {rider.totalRides}
                </p>
                <p className="text-xs text-muted-foreground">Total Rides</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-green-500">
                  {rider.completedRides}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-destructive">
                  {rider.cancelledRides}
                </p>
                <p className="text-xs text-muted-foreground">Cancelled</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-sm font-medium">{completionRate}%</p>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Verification Status
              </p>
              <div className="flex gap-2">
                <Badge
                  variant={
                    rider.isPhoneVerified === "1" ? "default" : "secondary"
                  }
                  className="gap-1"
                >
                  <Phone className="h-3 w-3" />
                  Phone {rider.isPhoneVerified === "1" ? "Verified" : "Pending"}
                </Badge>
                <Badge
                  variant={
                    rider.isEmailVerified === "1" ? "default" : "secondary"
                  }
                  className="gap-1"
                >
                  <Mail className="h-3 w-3" />
                  Email {rider.isEmailVerified === "1" ? "Verified" : "Pending"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Activity</span>
            {/* <Badge variant="outline">Last 30 days</Badge> */}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rider.totalRides === 0 ? (
              <div className="text-center py-8">
                <div className="rounded-full bg-muted p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Activity Yet</h3>
                <p className="text-muted-foreground">
                  This rider hasn't completed any rides yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Total Rides Completed</p>
                    <p className="text-sm text-muted-foreground">
                      Lifetime total
                    </p>
                  </div>
                  <Badge variant="default">{rider.completedRides}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Cancellation Rate</p>
                    <p className="text-sm text-muted-foreground">
                      Based on total rides
                    </p>
                  </div>
                  <Badge variant="outline">
                    {rider.totalRides > 0
                      ? `${Math.round((rider.cancelledRides / rider.totalRides) * 100)}%`
                      : "0%"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Average Rating</p>
                    <p className="text-sm text-muted-foreground">
                      Based on customer reviews
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                    <span className="font-medium">{rider.averageRating}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
