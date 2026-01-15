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

import { TabsContent } from "@/components/ui/tabs";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { PayoutDriver } from "@/lib/type";
import { Skeleton } from "./ui/skeleton";
function PayoutOwed({
  driversOwed,
  handleMarkAsPaid,
  isPending,
}: {
  driversOwed: PayoutDriver[];
  handleMarkAsPaid: (driver: PayoutDriver) => any;
  isPending: boolean;
}) {
  return (
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

            {isPending ? (
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="hidden lg:table-cell">
                      <Skeleton className="h-5 w-10" />
                    </TableCell>

                    <TableCell>
                      <Skeleton className="h-5 w-25" />
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-5 w-25" />
                    </TableCell>

                    <TableCell className=" lg:table-cell">
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell className=" lg:table-cell">
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell className=" lg:table-cell">
                      <Skeleton className="h-5 w-15" />
                    </TableCell>
                  
                  </TableRow>
                ))}
              </TableBody>
            ) : (
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
                            <CheckCircle className="h-4 w-4 mr-2" /> Mark as
                            completed
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
                              onClick={() => handleMarkAsPaid(driver)}
                              disabled={isPending}
                              className="cursor-pointer"
                            >
                              {isPending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                "Complete"
                              )}
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
            )}
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

export default PayoutOwed;
