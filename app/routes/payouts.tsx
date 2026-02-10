import { PageHeader } from "@/components/page-header";
import { useEffect, useMemo, useState } from "react";
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
import { CheckCircle, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMarkPayment, usePayout, usePayoutHistory } from "@/hooks/usePayout";
import { format } from "date-fns";
import type { PaymentHistoryType, PayoutDriver } from "@/lib/type";
import PayoutOwed from "@/components/PayoutOwed";
import PayoutHistory from "@/components/PayoutHistory";

export default function Payouts({
  onCloseModal,
}: {
  onCloseModal?: () => void;
}) {
  const { data } = usePayout();

  const { data: historyData } = usePayoutHistory();
  const { mutate, isPending } = useMarkPayment();

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
      rideIds: item.rideIds,
    }));
  }, [data]);

  useEffect(() => {
    if (finalData) {
      setDriversOwed(finalData);
    }
  }, [finalData]);

  useEffect(() => {
    if (historyData) {
      setPaymentHistory(historyData);
    }
  }, [historyData]);

  const [val, setVal] = useState("owed");
  const [driversOwed, setDriversOwed] = useState<PayoutDriver[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryType[]>(
    []
  );

//   console.log(historyData, "payoutHistory");

  const handleMarkAsPaid = (driver: PayoutDriver) => {
    const { id: driverId, rideIds } = driver;

    mutate(
      { driverId, rideIds },
      {
        onSuccess: () => {
          onCloseModal;
          toast.success(
            `Payment of ₦${driver.amountOwed.toLocaleString()} marked as completed for ${driver.name}`
          );
        },
      }
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

      rows =
        driversOwed?.map((d) => [
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
        p.driverId,
        p.driverName,
        p.amount,
        p.markedAt,
        p.payoutReference,
        p.status,
      ]);
    }

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value: string | number | string[]) => {
            const stringValue = String(value);
            return stringValue.includes(",") ? `"${stringValue}"` : stringValue;
          })
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
              Payment History ({paymentHistory?.length || 0})
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

     <PayoutOwed driversOwed={driversOwed} handleMarkAsPaid={handleMarkAsPaid} isPending={isPending}/>

     <PayoutHistory paymentHistory={paymentHistory}/>

      
      </Tabs>
    </div>
  );
}
