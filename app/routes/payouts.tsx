import { PageHeader } from "@/components/page-header";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { usePayout, usePayoutHistory } from "@/hooks/usePayout";
import { format } from "date-fns";

const mockPayoutDrivers = [
  {
    id: "DRV001",
    name: "Chisom Okafor",
    bankName: "GTBank",
    accountNumber: "0123456789",
    amountOwed: 45000,
    tripCount: 12,
    lastTripDate: "2024-01-15",
  },
  {
    id: "DRV002",
    name: "Ikechukwu Eze",
    bankName: "Access Bank",
    accountNumber: "1234567890",
    amountOwed: 62500,
    tripCount: 18,
    lastTripDate: "2024-01-15",
  },
  {
    id: "DRV003",
    name: "Blessing Adeyemi",
    bankName: "First Bank",
    accountNumber: "9876543210",
    amountOwed: 38000,
    tripCount: 9,
    lastTripDate: "2024-01-14",
  },
];

const mockPaymentHistory = [
  {
    id: "PH0001",
    driverName: "Tunde Oluwaseun",
    amountPaid: 55000,
    paymentDate: "2024-01-14",
    reference: "TXN742816",
    status: "Completed",
  },
  {
    id: "PH0002",
    driverName: "Amara Okoro",
    amountPaid: 41500,
    paymentDate: "2024-01-13",
    reference: "TXN591243",
    status: "Completed",
  },
];

export default function Payouts() {
  const { data } = usePayout();

  const {data:payoutHistory} = usePayoutHistory()

  const finalData = useMemo(() => {
    return data?.map((item) => ({
      ...item,
      id: item.driverId,
      name: item.driverName,
      bankName: item.bankName,
      accountNumber: item.accountNumber,
      amountOwed: item.expectedEarning,
      tripCount: parseInt(item.trips),
      lastTripDate: format(item.lastTripDate, "yyyy-MM-dd"),
    }));
  }, [data]);


  const [val, setVal] = useState("owed");
  const [driversOwed, setDriversOwed] = useState(finalData);
  const [paymentHistory, setPaymentHistory] = useState(payoutHistory || []);

  console.log(data);

  const handleMarkAsPaid = (driverId: string) => {
    const driver = driversOwed?.find((d) => d.id === driverId);
    if (!driver) return;

    // Remove from owed list
    setDriversOwed((prev) => prev?.filter((d) => d.id !== driverId));

    // Add to payment history
    const newPayment = {
      id: `PH${String(paymentHistory.length + 1).padStart(4, "0")}`,
      driverName: driver.name,
      amountPaid: driver.amountOwed,
      paymentDate: new Date().toISOString().split("T")[0],
      reference: `TXN${Math.floor(Math.random() * 900000) + 100000}`,
      status: "Completed",
    };

    setPaymentHistory((prev) => [newPayment, ...prev]);

    toast.success(
      `Payment of ₦${driver.amountOwed.toLocaleString()} marked as completed for ${driver.name}`
    );
  };

  const handleExport = () => {
    const exportName =
      val === "owed" ? "drivers-owed-export.csv" : "payment-history-export.csv";

    let headers: string[] = [];
    let rows = [];

    if (val === "owed") {
      headers = [
        "Driver ID",
        "Driver Name",
        "Bank Name",
        "Account Number",
        "Amount Owed",
        "Trip Count",
        "Last Trip Date",
      ];

      rows = driversOwed?.map((d) => [
        d.id,
        d.name,
        d.bankName,
        d.accountNumber,
        d.amountOwed,
        d.tripCount,
        d.lastTripDate,
      ]) || [];
    } else {
      headers = [
        "Payment ID",
        "Driver Name",
        "Amount Paid",
        "Payment Date",
        "Reference",
        "Status",
      ];

      rows = paymentHistory.map((p) => [
        p.id,
        p.driverName,
        p.amountPaid,
        p.paymentDate,
        p.reference,
        p.status,
      ]);
    }

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value: string | string[]) =>
            typeof value === "string" && value.includes(",")
              ? `"${value}"` // wrap values containing commas
              : value
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = exportName;
    a.click();
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Driver Payouts"
        description="Manage end-of-day driver payments"
      />

      <Tabs defaultValue="owed" className="space-y-6">
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger
              value="owed"
              onClick={() => setVal("owed")}
              className="cursor-pointer"
            >
              Drivers Owed ({driversOwed?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="history"
              onClick={() => setVal("history")}
              className="cursor-pointer"
            >
              Payment History
            </TabsTrigger>
          </TabsList>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={driversOwed?.length === 0 || paymentHistory.length === 0}
            className="cursor-pointer"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
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
                  {driversOwed?.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{driver.name}</p>
                          <Badge variant="secondary" className="mt-1">
                            {driver.id}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{driver.bankName}</p>
                          <p className="text-sm font-mono text-muted-foreground">
                            {driver.accountNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-lg font-bold text-chart-1">
                        ₦{driver.amountOwed.toLocaleString()}
                      </TableCell>
                      <TableCell>{driver.tripCount} trips</TableCell>
                      <TableCell>{driver.lastTripDate}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger>
                            {" "}
                            <Button
                              size="sm"
                              className="bg-success hover:bg-success/90 text-success-foreground cursor-pointer"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Paid
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Mark as Paid</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to mark the payment of{" "}
                                <strong>
                                  ₦{driver.amountOwed.toLocaleString()}
                                </strong>{" "}
                                to <strong>{driver.name}</strong> as completed?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button
                                type="submit"
                                onClick={() => handleMarkAsPaid(driver.id)}
                                className="cursor-pointer"
                              >
                                Complete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                  {driversOwed?.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground py-8"
                      >
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
                      <TableCell className="text-lg font-bold">
                        ₦{payment.amountPaid.toLocaleString()}
                      </TableCell>
                      <TableCell>{payment.paymentDate}</TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {payment.reference}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-success text-success-foreground">
                          {payment.status}
                        </Badge>
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
