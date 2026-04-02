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
  Shield,
  AlertTriangle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { PageHeader } from "@/components/page-header";
import { formatDate, formatPhone } from "@/lib/helper";
import { useRider, useSuspend, useUnsuspend } from "@/hooks/useRider";
import RiderDetailSkeleton from "@/components/RiderDetailSkeleton";
import type { Rider } from "@/lib/type";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
// import { api } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";

export default function RiderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // const { toast } = useToast();
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showUnsuspendModal, setShowUnsuspendModal] = useState(false);

  const { data: riders, isLoading } = useRider(id!);
  const data: Rider | null = riders ?? null;

  // Suspend mutation

  const { mutate: suspendRider, isPending: isSuspending } = useSuspend("riders");
  const { mutate: unSuspendRider, isPending: isUnsuspending } =
    useUnsuspend("riders");


  const handleSuspension = () => {
    if (!rider?.id) return;
    suspendRider(rider.id, {
      onSuccess: () => {
        toast.success("Rider Suspended");
        setShowSuspendModal(false);
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to suspend rider.",
        );
      },
    });
  };
  const handleUnsuspension = () => {
    if (!rider?.id) return;
    unSuspendRider(rider.id, {
      onSuccess: () => {
        toast.success("Rider Unsuspended");
        setShowUnsuspendModal(false);
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to unsuspend rider.",
        );
      },
    });
  };

  // Find the rider by ID - adjust property names based on your actual mockData structure
  const rider = {
    ...data,
    totalRides: 12, // fake data
    completedRides: 9, // fake data
    cancelledRides: 3, // fake data
    averageRating: 4.5, // fake data
  };

  // Calculate completion rate if we have total rides
  const completionRate =
    rider.totalRides > 0
      ? Math.round((rider.completedRides / rider.totalRides) * 100)
      : 0;

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

  const isActive = rider.isActive === "1";

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
              <Badge variant={isActive ? "default" : "destructive"}>
                {isActive ? "Active" : "Suspended"}
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

          {/* Suspend/Unsuspend Button */}
          <div>
            {isActive ? (
              <Button
                variant="destructive"
                onClick={() => setShowSuspendModal(true)}
                disabled={isSuspending}
                className="gap-2"
              >
                <Shield className="h-4 w-4" />
                {isSuspending ? "Suspending..." : "Suspend Rider"}
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={() => setShowUnsuspendModal(true)}
                disabled={isUnsuspending}
                className="gap-2"
              >
                <Shield className="h-4 w-4" />
                {isUnsuspending
                  ? "Unsuspending..."
                  : "Unsuspend Rider"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Suspension Info Card (only shown when suspended) */}
      {!isActive && rider.suspensionReason && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Suspension Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {rider.suspensionReason && (
              <div>
                <p className="text-sm text-muted-foreground">Reason</p>
                <p className="font-medium">{rider.suspensionReason}</p>
              </div>
            )}
            {rider.suspendedAt && (
              <div>
                <p className="text-sm text-muted-foreground">Suspended On</p>
                <p className="font-medium">{formatDate(rider.suspendedAt)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
                      {formatPhone(rider?.phoneNumber)}
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

      {/* Suspend Confirmation Modal */}
      <AlertDialog open={showSuspendModal} onOpenChange={setShowSuspendModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will suspend {rider.name}'s account. The rider will not be
              able to:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Accept new ride requests</li>
                <li>Access the rider app</li>
                <li>Receive payments</li>
              </ul>
              {/* <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">
                  You can add a suspension reason (optional)
                </p>
                <textarea
                  className="mt-2 w-full p-2 text-sm border rounded-md"
                  rows={2}
                  placeholder="Enter reason for suspension..."
                  onChange={(e) => {
                    // You can store this in state if you want to pass it to the API
                    console.log("Suspension reason:", e.target.value);
                  }}
                />
              </div> */}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSuspension}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Suspend Rider
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unsuspend Confirmation Modal */}
      <AlertDialog
        open={showUnsuspendModal}
        onOpenChange={setShowUnsuspendModal}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reinstate Rider?</AlertDialogTitle>
            <AlertDialogDescription>

              <div>

              This will reinstate {rider.name}'s account. The rider will regain:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Full access to the rider app</li>
                <li>Ability to accept ride requests</li>
                <li>Access to earnings and payments</li>
              </ul>
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-800">
                <p className="text-sm flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  Ensure any issues have been resolved before reinstating.
                </p>
              </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnsuspension}>
              Yes, Reinstate Rider
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
