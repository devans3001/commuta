

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Car, 
  MapPin, 
  Wifi, 
  WifiOff,
  UserCheck,
  UserX 
} from "lucide-react";
import { useNavigate } from "react-router";
import { formatDate, formatPhone } from "@/lib/helper";
import type { Driver } from "@/lib/mockData"; // Assuming you have a Driver type
import { RiderCardSkeleton } from "./RiderCardSkeleton";

function DriverCardView({
  isLoading,
  paginatedDrivers,
}: {
  isLoading: boolean;
  paginatedDrivers: Driver[];
}) {
  const navigate = useNavigate();

  if (isLoading) {
    // Return skeleton loading cards
    return (
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <RiderCardSkeleton />
             <RiderCardSkeleton />
             <RiderCardSkeleton />
           </div>
    );
  }

  if (!paginatedDrivers || paginatedDrivers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Car className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Drivers Found</h3>
        <p className="text-muted-foreground max-w-md">
          There are no drivers to display. Try adjusting your filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
     {paginatedDrivers.map((driver) => (
        <Card key={driver.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg truncate">{driver.name}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
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
                </div>
              </div>
              {/* <Badge variant="secondary">#{driver.id}</Badge> */}
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Essential Information */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{formatPhone(driver.phoneNumber)}</p>
                    {driver.isPhoneVerified === "1" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{driver.vehicleType}</p>
                  <p className="text-sm text-muted-foreground">{driver.licensePlate}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-2 bg-muted rounded">
                <p className="text-xl font-bold">{driver.totalRides}</p>
                <p className="text-xs text-muted-foreground">Total Rides</p>
              </div>
              <div className="text-center p-2 bg-muted rounded">
                <p className="text-xl font-bold text-green-600">
                  ₦{(driver.totalEarnings || 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Earnings</p>
              </div>
            </div>

            {/* Action Button */}
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => navigate(`/admin/drivers/${driver.id}`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default DriverCardView;