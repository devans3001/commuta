import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Building, CreditCard, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useNavigation } from "react-router";

export default function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
 
  // Mock data
  const driver = {
    id: id || "D001",
    name: "David Wilson",
    phone: "+234 805 678 9012",
    bankName: "GTBank",
    accountNumber: "0123456789",
    totalTrips: 128,
    totalEarnings: "₦456,700",
    status: "Active",
    joinDate: "2024-01-10",
  };

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" onClick={() => navigate("/drivers")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Drivers
        </Button>
        <PageHeader title={driver.name} description={`Driver ID: ${driver.id}`} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact & Bank Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{driver.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Bank Name</p>
                <p className="font-medium">{driver.bankName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Account Number</p>
                <p className="font-mono font-medium">{driver.accountNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Join Date</p>
                <p className="font-medium">{driver.joinDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant="default" className="mt-1 bg-success text-success-foreground">{driver.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Trips</p>
              <p className="text-2xl font-bold text-success">{driver.totalTrips}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold text-primary">{driver.totalEarnings}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Trips</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Trip history will be displayed here</p>
        </CardContent>
      </Card>
    </div>
  );
}
