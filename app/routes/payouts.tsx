import { PageHeader } from "@/components/page-header";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { mockPayoutDrivers, mockPaymentHistory, type PayoutDriver, type PaymentHistory } from "@/lib/mockData";

export default function Payouts() {
  const [driversOwed, setDriversOwed] = useState<PayoutDriver[]>(mockPayoutDrivers);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>(mockPaymentHistory);

  const handleMarkAsPaid = (driverId: string) => {
    const driver = driversOwed.find(d => d.id === driverId);
    if (!driver) return;

    // Remove from owed list
    setDriversOwed(prev => prev.filter(d => d.id !== driverId));

    // Add to payment history
    const newPayment: PaymentHistory = {
      id: `PH${String(paymentHistory.length + 1).padStart(4, '0')}`,
      driverName: driver.name,
      amountPaid: driver.amountOwed,
      paymentDate: new Date().toISOString().split('T')[0],
      reference: `TXN${Math.floor(Math.random() * 900000) + 100000}`,
      status: "Completed",
    };
    
    setPaymentHistory(prev => [newPayment, ...prev]);

    toast.success(`Payment of ₦${driver.amountOwed.toLocaleString()} marked as completed for ${driver.name}`);
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Driver Payouts" 
        description="Manage end-of-day driver payments"
      />

      <Tabs defaultValue="owed" className="space-y-6">
        <TabsList>
          <TabsTrigger value="owed">Drivers Owed ({driversOwed.length})</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="owed">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead>Bank Details</TableHead>
                    <TableHead>Amount Owed</TableHead>
                    <TableHead>Trips</TableHead>
                    <TableHead>Last Trip</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {driversOwed.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{driver.name}</p>
                          <Badge variant="secondary" className="mt-1">{driver.id}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{driver.bankName}</p>
                          <p className="text-sm font-mono text-muted-foreground">{driver.accountNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-lg font-bold text-chart-1">₦{driver.amountOwed.toLocaleString()}</TableCell>
                      <TableCell>{driver.tripCount} trips</TableCell>
                      <TableCell>{driver.lastTripDate}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          className="bg-success hover:bg-success/90 text-success-foreground cursor-pointer"
                          onClick={() => handleMarkAsPaid(driver.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Paid
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {driversOwed.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No pending payouts
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <p className="font-medium">{payment.driverName}</p>
                      </TableCell>
                      <TableCell className="text-lg font-bold">₦{payment.amountPaid.toLocaleString()}</TableCell>
                      <TableCell>{payment.paymentDate}</TableCell>
                      <TableCell><span className="font-mono text-sm">{payment.reference}</span></TableCell>
                      <TableCell>
                        <Badge className="bg-success text-success-foreground">{payment.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
