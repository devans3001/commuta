import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  XCircle,
  ShieldOff,
  ShieldCheck,
  ArrowLeft,
  Calendar,
  Mail,
  User,
  IdCard,
  AlertTriangle,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  useDriverVerificationById,
  useUpdateVerificationStatus,
} from "@/hooks/useDriver";
import { toast } from "sonner";

type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
type ActionType = "APPROVED" | "REJECTED" | "SUSPENDED" | "REINSTATED";

const STATUS_CONFIG: Record<
  VerificationStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-green-100 text-green-800",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-100 text-red-800",
  },
  SUSPENDED: {
    label: "SUSPENDED",
    className: "bg-slate-100 text-slate-700",
  },
};

function DocumentImage({
  src,
  label,
}: {
  src: string | undefined;
  label: string;
}) {
  const [enlarged, setEnlarged] = useState(false);

  if (!src) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/40 h-48 flex items-center justify-center text-sm text-muted-foreground">
        Not provided
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <button
          onClick={() => setEnlarged(true)}
          className="w-full rounded-lg overflow-hidden border hover:opacity-90 transition-opacity cursor-zoom-in"
        >
          <img
            src={src}
            alt={label}
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/400x250?text=Image+Error";
            }}
          />
        </button>
      </div>

      {/* Lightbox */}
      <Dialog open={enlarged} onOpenChange={setEnlarged}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
          </DialogHeader>
          <img
            src={src}
            alt={label}
            className="w-full rounded-md object-contain max-h-[70vh]"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function ActionModal({
  open,
  action,
  onClose,
  onConfirm,
  isPending,
}: {
  open: boolean;
  action: ActionType | null;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  isPending: boolean;
}) {
  const [reason, setReason] = useState("");

  const requiresReason = action === "REJECTED" || action === "SUSPENDED";

  const CONFIG: Record<
    ActionType,
    { title: string; description: string; variant: "default" | "destructive" }
  > = {
    APPROVED: {
      title: "Approve Driver",
      description:
        "This will grant the driver full access to the platform. Are you sure?",
      variant: "default",
    },
    REJECTED: {
      title: "Reject Driver",
      description:
        "The driver will lose access. Please provide a reason for rejection.",
      variant: "destructive",
    },
    SUSPENDED: {
      title: "SUSPENDED Driver",
      description:
        "The driver will have restricted access. Please provide a reason.",
      variant: "destructive",
    },
    REINSTATED: {
      title: "Reinstate Driver",
      description:
        "This will restore the driver's full access to the platform. Are you sure?",
      variant: "default",
    },
  };

  const cfg = action ? CONFIG[action] : null;

  const handleConfirm = () => {
    onConfirm(requiresReason ? reason : undefined);
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {action === "REJECTED" || action === "SUSPENDED" ? (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
            {cfg?.title}
          </DialogTitle>
          <DialogDescription>{cfg?.description}</DialogDescription>
        </DialogHeader>

        {requiresReason && (
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Enter reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant={cfg?.variant}
            onClick={handleConfirm}
            disabled={isPending || (requiresReason && !reason.trim())}
          >
            {isPending ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function DriverVerificationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);

  const { data, isLoading } = useDriverVerificationById(id!);
  const { mutate: updateStatus, isPending } = useUpdateVerificationStatus();

  const verification = data?.data;

  const handleAction = (action: ActionType) => {
    setActiveAction(action);
  };

  const handleConfirm = (reason?: string) => {
    if (!activeAction || !verification) return;

    updateStatus(
      {
        verificationId: parseInt(verification.id),
        status: activeAction,
        reason,
      },
      {
        onSuccess: () => {
          toast.success(`Driver ${activeAction.toLowerCase()} successfully.`);
          setActiveAction(null);
        },
        onError: () => {
          toast.error("Failed to update status. Please try again.");
        },
      },
    );
  };

  console.log("Verification Data:", activeAction, verification?.id);
  const status = verification?.status as VerificationStatus | undefined;
  const statusCfg = status ? STATUS_CONFIG[status] : null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>

      <PageHeader
        title="Driver Verification Detail"
        description="Review submitted documents and take action"
      />

      {isLoading ? (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-40" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </CardContent>
          </Card>
        </div>
      ) : !verification ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Verification record not found.
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Driver Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Driver Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{verification.driverName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{verification.driverEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <IdCard className="h-4 w-4 text-muted-foreground" />
                  <span>ID Type: {verification.idType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Submitted:{" "}
                    {format(
                      parseISO(verification?.createdAt),
                      "dd MMM yyyy, HH:mm",
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Status:</span>
                {statusCfg && (
                  <Badge className={statusCfg.className}>
                    {statusCfg.label}
                  </Badge>
                )}
              </div>

              {verification.rejectionReason && (
                <div className="rounded-md bg-red-50 border border-red-200 p-4">
                  <p className="text-sm font-medium text-red-700 mb-1">
                    Rejection/Suspension Reason
                  </p>
                  <p className="text-sm text-red-600">
                    {verification.rejectionReason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Submitted Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <DocumentImage src={verification.selfie} label="Selfie" />
                <DocumentImage
                  src={verification.idCardFront}
                  label="ID Card — Front"
                />
                <DocumentImage
                  src={verification.idCardBack}
                  label="ID Card — Back"
                />
              </div>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          {status === "PENDING" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Admin Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {/* Approve — show when PENDING or REJECTED */}
                  {(status === "PENDING" || status === "REJECTED") && (
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                      onClick={() => handleAction("APPROVED")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  )}

                  {/* Reject — show when PENDING or APPROVED */}
                  {status === "PENDING" && (
                    <Button
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() => handleAction("REJECTED")}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <ActionModal
        open={!!activeAction}
        action={activeAction}
        onClose={() => setActiveAction(null)}
        onConfirm={handleConfirm}
        isPending={isPending}
      />
    </div>
  );
}
