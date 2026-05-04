import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Phone,
  Mail,
  Car,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  UserCheck,
  UserX,
  CreditCard,
  Building,
  Star,
  TrendingUp,
  DollarSign,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { formatDate, formatPhone } from "@/lib/helper";
import { useDriver, useSuspendUnsuspendDriver } from "@/hooks/useDriver";
import RiderDetailSkeleton from "@/components/RiderDetailSkeleton";
import type { Driver } from "@/lib/type";
import { useState } from "react";
import { toast } from "sonner";

export default function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [pendingAction, setPendingAction] = useState<
    "suspend" | "unsuspend" | null
  >(null);

  const { data: driverData, isLoading } = useDriver(String(id));
  const { mutate, isPending } = useSuspendUnsuspendDriver(String(id));

  const data: Driver | null = driverData ?? null;

  const driver = {
    ...data,
    totalRides: 12,
    completedRides: 9,
    cancelledRides: 3,
    averageRating: 4.5,
    totalEarnings: 250000,
  };

  const handleSuspendClick = () => {
    setPendingAction("suspend");
    setShowSuspendModal(true);
  };

  const handleReactivateClick = () => {
    setPendingAction("unsuspend");
    setShowSuspendModal(true);
  };

  const handleConfirmAction = () => {
    if (!driver.id || !pendingAction) return;

    if (pendingAction === "suspend" && !suspendReason.trim()) {
      toast.error("Please provide a reason for suspension");
      return;
    }

    mutate(
      {
        driverId: parseInt(driver.id),
        status: pendingAction,
        reason: pendingAction === "suspend" ? suspendReason : undefined,
      },
      {
        onSuccess: () => {
          toast.success(
            pendingAction === "suspend"
              ? "Driver suspended successfully"
              : "Driver reactivated successfully",
          );
          setShowSuspendModal(false);
          setSuspendReason("");
          setPendingAction(null);
        },
        onError: () => {
          toast.error("Failed to update driver status");
        },
      },
    );
  };

  if (isLoading) {
    return <RiderDetailSkeleton val="Drivers" />;
  }

  if (!driver) {
    return (
      <div className="space-y-8">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/drivers")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Drivers
          </Button>
          <PageHeader
            title="Driver Not Found"
            description={`No driver found with ID: ${id}`}
          />
        </div>
      </div>
    );
  }

  const completionRate =
    driver.totalRides > 0
      ? Math.round((driver.completedRides / driver.totalRides) * 100)
      : 0;

  const cancellationRate =
    driver.totalRides > 0
      ? Math.round((driver.cancelledRides / driver.totalRides) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/drivers")}
          className="mb-4 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Drivers
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <PageHeader
              title={driver.name}
              description={`Driver ID: ${driver.id}`}
            />
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Badge
                variant={driver.isActive === "1" ? "default" : "secondary"}
              >
                {driver.isActive === "1" ? "Active" : "Inactive"}
              </Badge>
              {driver.isOnline === "1" ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <Wifi className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-gray-50 text-gray-700 border-gray-200"
                >
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
              <Badge variant="outline">{driver.gender}</Badge>
              {driver.isAvailable === "1" ? (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  <UserCheck className="h-3 w-3 mr-1" />
                  Available
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-orange-50 text-orange-700 border-orange-200"
                >
                  <UserX className="h-3 w-3 mr-1" />
                  Unavailable
                </Badge>
              )}
              {driver.averageRating > 0 && (
                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-full">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="font-semibold text-sm">
                    {driver.averageRating}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Btn Position - Top Right Corner */}
          {driver.isActive === "1" ? (
            <Button
              variant="destructive"
              size="default"
              disabled={isPending}
              onClick={handleSuspendClick}
              className="cursor-pointer"
            >
              {isPending && pendingAction === "suspend" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <>
                  <UserX className="h-4 w-4 mr-2" />
                  Suspend Driver
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="outline"
              disabled={isPending}
              size="default"
              onClick={handleReactivateClick}
              className="cursor-pointer border-green-500 text-green-600 hover:bg-green-50"
            >
              {isPending && pendingAction === "unsuspend" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Reactivate
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Rest of your existing JSX (Main Content Grid) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* ... keep all your existing content ... */}
      </div>

      {/* SUSPENSION/REACTIVATION REASON MODAL */}
      <Dialog open={showSuspendModal} onOpenChange={setShowSuspendModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {pendingAction === "suspend" ? (
                <>
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Suspend Driver
                </>
              ) : (
                <>
                  <UserCheck className="h-5 w-5 text-green-600" />
                  Reactivate Driver
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {pendingAction === "suspend"
                ? "This will suspend the driver's account. They will not be able to accept rides or access the platform. Please provide a reason for this action."
                : "This will restore full access to the driver."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              {pendingAction === "suspend" && (
                <>
                  <Label htmlFor="reason" className="text-sm font-semibold">
                    Suspension Reason{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder={
                      pendingAction === "suspend"
                        ? "e.g., Multiple ride cancellations, Safety violation, Fraudulent activity, etc."
                        : "e.g., Driver appealed successfully, Issue resolved, etc."
                    }
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </>
              )}
              {pendingAction === "suspend" && !suspendReason.trim() && (
                <p className="text-xs text-destructive mt-1">
                  Reason is required for suspension
                </p>
              )}
            </div>

            {/* Driver Info Summary */}
            <div className="rounded-md bg-muted/30 p-3 space-y-1">
              <p className="text-xs text-muted-foreground">
                Driver Information
              </p>
              <p className="text-sm font-medium">{driver.name}</p>
              <p className="text-xs text-muted-foreground">ID: {driver.id}</p>
              <p className="text-xs text-muted-foreground">
                Email: {driver.emailAddress}
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuspendModal(false);
                setSuspendReason("");
                setPendingAction(null);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant={pendingAction === "suspend" ? "destructive" : "default"}
              onClick={handleConfirmAction}
              disabled={
                isPending ||
                (pendingAction === "suspend" && !suspendReason.trim())
              }
              className={
                pendingAction === "unsuspend"
                  ? "bg-green-600 hover:bg-green-700"
                  : ""
              }
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : pendingAction === "suspend" ? (
                <>
                  <UserX className="h-4 w-4 mr-2" />
                  Confirm Suspension
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Confirm Reactivation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
