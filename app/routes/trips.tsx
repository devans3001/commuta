import { PageHeader } from "@/components/page-header";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar } from "lucide-react";
import { mockTrips } from "@/lib/mockData";

export default function Trips() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rideTypeFilter, setRideTypeFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredTrips = useMemo(() => {
    return mockTrips.filter(trip => {
      const matchesSearch = trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.riderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.driverName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRideType = rideTypeFilter === "all" || trip.rideType === rideTypeFilter;
      const matchesPaymentStatus = paymentStatusFilter === "all" || trip.paymentStatus === paymentStatusFilter;
      const matchesPaymentMethod = paymentMethodFilter === "all" || trip.paymentMethod === paymentMethodFilter;
      
      return matchesSearch && matchesRideType && matchesPaymentStatus && matchesPaymentMethod;
    });
  }, [searchQuery, rideTypeFilter, paymentStatusFilter, paymentMethodFilter]);

  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
  const paginatedTrips = filteredTrips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Trip Log" 
        description="View and manage all ride history"
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by trip ID, rider, or driver..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={rideTypeFilter} onValueChange={(val) => { setRideTypeFilter(val); setCurrentPage(1); }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Ride Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Instant">Instant</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentStatusFilter} onValueChange={(val) => { setPaymentStatusFilter(val); setCurrentPage(1); }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentMethodFilter} onValueChange={(val) => { setPaymentMethodFilter(val); setCurrentPage(1); }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="Card">Card</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Wallet">Wallet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ride ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Rider</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTrips.map((trip) => {
                  const statusVariant = trip.paymentStatus === "Paid" ? "default" : 
                                       trip.paymentStatus === "Pending" ? "secondary" : "destructive";
                  return (
                    <TableRow key={trip.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell><Badge variant="outline">{trip.id}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={trip.rideType === "Instant" ? "default" : "secondary"}>
                          {trip.rideType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {trip.tripDate}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{trip.riderName}</TableCell>
                      <TableCell className="font-medium">{trip.driverName}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={statusVariant}
                          className={trip.paymentStatus === "Paid" ? "bg-success text-success-foreground" : ""}
                        >
                          {trip.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-primary">₦{trip.driverEarnings.toLocaleString()}</TableCell>
                      <TableCell>{trip.paymentMethod}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredTrips.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTrips.length)} of {filteredTrips.length} trips
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
