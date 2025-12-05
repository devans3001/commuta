import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DollarSign
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { formatDate, formatPhone } from "@/lib/helper";
import { useDriver } from "@/hooks/useDriver";
import RiderDetailSkeleton from "@/components/RiderDetailSkeleton";
import type { Driver } from "@/lib/mockData";

export default function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {data:driverData,isLoading} = useDriver(String(id))
  // Find the driver by ID from mockData

  const data:Driver | null = driverData ?? null

  const driver =  {
    ...data,
    totalRides: 12, // fake data
    completedRides: 9, // fake data
    cancelledRides: 3,  // fake data
    averageRating: 4.5, // fake data
    totalEarnings: 250000 // fake data
  };

    if (isLoading) {
      return <RiderDetailSkeleton val="Drivers"/>;
    }


  if (!driver) {
    return (
      <div className="space-y-8">
        <div>
          <Button variant="ghost" onClick={() => navigate("/admin/drivers")} className="mb-4">
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

  // Calculate completion rate
  const completionRate = driver.totalRides > 0 
    ? Math.round((driver.completedRides / driver.totalRides) * 100) 
    : 0;

  // Calculate cancellation rate
  const cancellationRate = driver.totalRides > 0 
    ? Math.round((driver.cancelledRides / driver.totalRides) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => navigate("/admin/drivers")} className="mb-4 cursor-pointer">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Drivers
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <PageHeader title={driver.name} description={`Driver ID: ${driver.id}`} />
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Badge variant={driver.isActive === "1" ? "default" : "secondary"}>
                {driver.isActive === "1" ? "Active" : "Inactive"}
              </Badge>
              {driver.isOnline === "1" ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Wifi className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
              <Badge variant="outline">{driver.gender}</Badge>
              {driver.isAvailable === "1" ? (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <UserCheck className="h-3 w-3 mr-1" />
                  Available
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  <UserX className="h-3 w-3 mr-1" />
                  Unavailable
                </Badge>
              )}
              {driver.averageRating > 0 && (
                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-full">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="font-semibold text-sm">{driver.averageRating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column: Personal & Vehicle Info */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{formatPhone(driver?.phoneNumber)}</p>
                  </div>
                </div>
                {driver.isPhoneVerified === "1" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{driver.emailAddress}</p>
                  </div>
                </div>
                {driver.isEmailVerified === "1" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Join Date</p>
                  <p className="font-medium">{formatDate(driver.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Online</p>
                  <p className="font-medium">{formatDate(driver.lastOnline)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Car className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle Type</p>
                  <p className="font-medium">{driver.vehicleType}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Color</p>
                  <p className="font-medium">{driver.vehicleColor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">License Plate</p>
                  <p className="font-mono font-medium">{driver.licensePlate}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Location</p>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Lat: {driver.currentLat}</span>
                  <span>Lng: {driver.currentLng}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Stats & Performance */}
        <div className="space-y-6">
          {/* Ride Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Ride Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-primary/5 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{driver.totalRides}</p>
                  <p className="text-xs text-muted-foreground">Total Rides</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{driver.completedRides}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{driver.cancelledRides}</p>
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
                <div className="flex justify-between mb-1">
                  <p className="text-sm text-muted-foreground">Cancellation Rate</p>
                  <p className="text-sm font-medium">{cancellationRate}%</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full" 
                    style={{ width: `${cancellationRate}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Earnings & Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings & Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                </div>
                <p className="text-3xl font-bold text-primary">
                  ₦{driver.totalEarnings.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Lifetime earnings from completed rides
                </p>
              </div>

              {driver.averageRating > 0 && (
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500 fill-current" />
                    <div>
                      <p className="font-medium">Average Rating</p>
                      <p className="text-sm text-muted-foreground">Based on customer reviews</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-amber-600">{driver.averageRating}</p>
                    <p className="text-xs text-muted-foreground">out of 5</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{formatDate(driver.updatedAt)}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Account Created</p>
                  <p className="font-medium">{formatDate(driver.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity / Additional Info */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Verification Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Phone Verification</span>
                  </div>
                  <Badge variant={driver.isPhoneVerified === "1" ? "default" : "secondary"}>
                    {driver.isPhoneVerified === "1" ? "Verified" : "Pending"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Verification</span>
                  </div>
                  <Badge variant={driver.isEmailVerified === "1" ? "default" : "secondary"}>
                    {driver.isEmailVerified === "1" ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Quick Actions</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  Send Message
                </Button>
                <Button variant="outline" size="sm">
                  View Ride History
                </Button>
                <Button variant="outline" size="sm">
                  Payment History
                </Button>
                <Button variant="outline" size="sm">
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}