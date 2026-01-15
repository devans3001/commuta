
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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Download, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import type { PaymentHistoryType } from "@/lib/type";

function PayoutHistory({paymentHistory}:{paymentHistory:PaymentHistoryType[]}) {
  return (
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
                  {paymentHistory?.map((payment) => (
                    <TableRow key={payment.driverId}>
                      <TableCell>
                        <p className="font-medium">{payment.driverName}</p>
                      </TableCell>
                      <TableCell className="text-lg font-bold">
                        ₦{payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {format(payment.markedAt, "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {payment.payoutReference}
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
  )
}

export default PayoutHistory