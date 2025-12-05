import { PageHeader } from "@/components/page-header";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, Download, EyeIcon } from "lucide-react";
import { useTrips } from "@/hooks/useDriver";
import { format, parseISO } from "date-fns";
import { is } from "date-fns/locale";
import { RidersTableSkeleton } from "@/components/RidersTableSkeleton";
import { useNavigate } from "react-router";

export default function Trips() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rideTypeFilter, setRideTypeFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useTrips();
  const itemsPerPage = 10;

  const trips = data || [];

  const filteredTrips = useMemo(() => {
    return trips?.filter((trip) => {
      const matchesSearch =
        trip.rideId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.riderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.driverName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRideType =
        rideTypeFilter === "all" || trip.rideType === rideTypeFilter;
      const matchesPaymentStatus =
        paymentStatusFilter === "all" ||
        trip.rideStatus.toLowerCase() === paymentStatusFilter.toLowerCase();

      const matchesPaymentMethod =
        paymentMethodFilter === "all" ||
        trip.paymentMethod === paymentMethodFilter;

      return (
        matchesSearch &&
        matchesRideType &&
        matchesPaymentStatus &&
        matchesPaymentMethod
      );
    });
  }, [
    searchQuery,
    trips,
    rideTypeFilter,
    paymentStatusFilter,
    paymentMethodFilter,
  ]);

  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);

  const paginatedTrips = filteredTrips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const getStatusVariant = (status:string) => {
    switch(status) {
      case 'COMPLETED':
        return 'default';
      case 'CANCELLED':
        return 'destructive';
      case 'PENDING':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  const handleExport = () => {
    const csv = [
      [
        "Ride ID",
        "Type",
        "Date",
        "Rider",
        "Driver",
        "Ride Status",
        "Payment Status",
        "Payment Method",
        "Pickup",
        "Dropoff",
        "Fare",
        "Driver Earnings",
      ],
      ...filteredTrips.map((t) => [
        t.rideId,
        t.rideType,
        t.createdAt,
        t.riderName,
        t.driverName,
        t.rideStatus,
        t.paymentStatus,
        t.paymentMethod,
        t.pickupAddress,
        t.dropoffAddress,
        t.finalFare,
        t.expectedEarning,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trips-export.csv";
    a.click();
  };

  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Trip Log"
        description="View and manage all ride history"
        action={
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={filteredTrips.length === 0}
            className="cursor-pointer"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        }
      />

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col justify-center items-center md:flex-row gap-4 md:justify-between">
        <div className="relative flex-1 md:max-w-md max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ride ID, rider, or driver..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select
            value={rideTypeFilter}
            onValueChange={(val) => {
              setRideTypeFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Ride Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Instant">Instant</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={paymentStatusFilter}
            onValueChange={(val) => {
              setPaymentStatusFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Rider Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Riders Status</SelectItem>
              <SelectItem value="Accepted">Accepted</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              {/* <SelectItem value="Failed">Failed</SelectItem> */}
            </SelectContent>
          </Select>

          <Select
            value={paymentMethodFilter}
            onValueChange={(val) => {
              setPaymentMethodFilter(val);
              setCurrentPage(1);
            }}
          >
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

      {/* TABLE */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Rider</TableHead>
                  <TableHead >Driver</TableHead>
                  <TableHead >
                    Ride Status
                  </TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Payment Method
                  </TableHead>
                  <TableHead className="w-[80px]">Action</TableHead>
                </TableRow>
              </TableHeader>

              {isLoading ? (
                <TableBody>
                  <RidersTableSkeleton show={false} />
                </TableBody>
              ) : (
                <TableBody>
                  {paginatedTrips.map((trip) => {
                  
                    return (
                      <TableRow
                        key={trip.rideId}
                        className=" hover:bg-muted/50"
                      >
                        {/* <TableCell>
                        <Badge variant="outline">{trip.rideId}</Badge>
                      </TableCell> */}

                        <TableCell className="hidden md:table-cell">
                          <Badge
                            variant={
                              trip.rideType === "Instant"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {trip.rideType}
                          </Badge>
                        </TableCell>

                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {format(parseISO(trip.createdAt), "dd MMM yyy")}
                          </div>
                        </TableCell>

                        <TableCell className="font-medium">
                          {trip.riderName}
                        </TableCell>
                        <TableCell className="font-medium">
                          {trip.driverName}
                        </TableCell>

                     <TableCell>
                        <Badge 
                          variant={getStatusVariant(trip.rideStatus)}
                          className={
                            trip.rideStatus === 'ACCEPTED' 
                              ? "bg-green-100 text-green-800 hover:bg-green-100" 
                              : ""
                          }
                        >
                          {trip.rideStatus}
                        </Badge>
                      </TableCell>

                        <TableCell className="font-semibold text-primary">
                          ₦{trip.expectedEarning.toLocaleString()}
                        </TableCell>

                        <TableCell className="text-center hidden md:table-cell">
                          {trip.paymentMethod || "-"}
                        </TableCell>
                        <TableCell className="flex justify-center ">
                          <Button className="text-center cursor-pointer" onClick={()=>navigate(`/admin/trips/${trip.rideId}`)}>
                            <EyeIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* PAGINATION */}
      {filteredTrips.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1}–
            {Math.min(currentPage * itemsPerPage, filteredTrips.length)} of{" "}
            {filteredTrips.length} trips
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
