import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { format, parse, parseISO } from "date-fns";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Car,
  CreditCard,
  DollarSign,
  User,
  Package,
  Clock,
  Navigation,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Shield,
} from "lucide-react";
import { useTrip } from "@/hooks/useDriver";
import type { Trip } from "@/lib/mockData";


// Status configuration
const statusConfig = {
  COMPLETED: {
    variant: "default" as const,
    icon: CheckCircle,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  CANCELLED: {
    variant: "destructive" as const,
    icon: XCircle,
    color: "bg-red-100 text-red-800 border-red-200",
  },
  PENDING: {
    variant: "secondary" as const,
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
};

export default function TripDetail() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const {
    data: tripData,
    isLoading,
    error,
  } = useTrip(String(rideId)!)

 const trip: Trip | null = tripData ?? null

  if (isLoading) {
    return <TripDetailSkeleton />;
  }

  if (!trip) {
    return (
      <div className="space-y-8">
        <div>
          <Button variant="ghost" onClick={() => navigate("/admin/trips")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trips
          </Button>
          <PageHeader
            title="Trip Not Found"
            description={error?.message || `No trip found with ID: ${rideId}`}
          />
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[trip?.rideStatus as keyof typeof statusConfig] || {
    variant: "outline" as const,
    icon: AlertCircle,
    color: "bg-gray-100 text-gray-800 border-gray-200",
  };
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => navigate("/admin/trips")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Trips
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <PageHeader
              title={`Trip #${trip.rideId}`}
              description={trip.rideType}
            />
            <div className="flex items-center gap-3 mt-4">
              <Badge
                variant={statusInfo.variant}
                className={`gap-1 ${statusInfo.color}`}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {trip.rideStatus}
              </Badge>
              <Badge variant="outline">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {format(parseISO(trip.createdAt), "dd MMM yyy")}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Trip Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-muted-foreground" />
                Route Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Pickup Location</p>
                    <p className="font-medium">{trip.pickupAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Dropoff Location</p>
                    <p className="font-medium">{trip.dropoffAddress}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rider & Driver Information */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Rider Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  Rider Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{trip.riderName}</p>
                    <p className="text-sm text-muted-foreground">Rider</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{trip.riderPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{trip.riderEmail}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Driver Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-muted-foreground" />
                  Driver Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Car className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{trip.driverName}</p>
                    <p className="text-sm text-muted-foreground">Driver</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{trip.driverPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Vehicle Number</p>
                      <p className="font-mono font-medium">{trip.driverVehicleNumber}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Financial & Details */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Final Fare</span>
                  <span className="text-lg font-bold text-primary">
                    ₦{trip.finalFare?.toLocaleString() || "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Service Charge</span>
                  <span className="text-base font-medium text-blue-600">
                    ₦{trip.serviceCharge?.toLocaleString() || "0"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Driver Earnings</span>
                  <span className="text-xl font-bold text-green-600">
                    ₦{trip.expectedEarning?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                  <Badge variant="outline" className="w-full justify-center py-2">
                    {trip.paymentMethod || "Not Specified"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Channel</p>
                  <Badge variant="outline" className="w-full justify-center py-2">
                    {trip.paymentChannel || "Not Specified"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                  <Badge
                    variant={trip.paymentStatus ? "default" : "secondary"}
                    className="w-full justify-center py-2"
                  >
                    {trip.paymentStatus || "Pending"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

    </div>
  );
}

// Skeleton Loading Component
function TripDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-10 w-32 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-24" />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 w-32" />
        ))}
      </div>
    </div>
  );
}