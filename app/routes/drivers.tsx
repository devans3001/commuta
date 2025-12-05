import { PageHeader } from "@/components/page-header";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  LayoutGrid,
  Table as TableIcon,
  Download,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isAfter, subHours } from "date-fns";
import DriverCardView from "@/components/DriverCardView";
import { useDrivers } from "@/hooks/useDriver";
import DriverTableVIew from "@/components/DriverTableVIew";
import DriverTableView from "@/components/DriverTableVIew";

export default function Drivers() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {data, isLoading} = useDrivers()

  console.log(data,"lol")
  const itemsPerPage = 12;
  const navigate = useNavigate();

  const filteredDrivers = useMemo(() => {
    const now = new Date();

    let result = data || [];

    // 🔥 Filter by selected period
    if (selectedPeriod === "24") {
      const last24h = subHours(now, 24);
      result = result.filter((driver) =>
        isAfter(new Date(driver.createdAt), last24h)
      );
    }

    result = result.filter(
      (driver) =>
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.emailAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.phoneNumber.includes(searchQuery)
    );

    return result;
  }, [searchQuery, selectedPeriod,data]);

  const totalPages = Math.ceil(filteredDrivers?.length / itemsPerPage);
  const paginatedDrivers = filteredDrivers?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
   const csv = [
  [
    "Driver ID",
    "Name", 
    "Phone Number",
    "Email Address",
    "Gender",
    "Status",
    "Phone Verified",
    "Email Verified",
    "Vehicle Type",
    "Vehicle Color", 
    "License Plate",
    "Online Status",
    "Available Status",
    "Last Online",
    "Current Latitude",
    "Current Longitude",
    "Created At",
    "Updated At",
    "Total Rides",
    "Completed Rides",
    "Cancelled Rides",
    "Average Rating",
    "Total Earnings",
  ],
  ...filteredDrivers.map((d) => [
    d.id,
    d.name,
    d.phoneNumber,
    d.emailAddress,
    d.gender,
    d.isActive === "1" ? "Active" : "Inactive",
    d.isPhoneVerified === "1" ? "Yes" : "No",
    d.isEmailVerified === "1" ? "Yes" : "No",
    d.vehicleType,
    d.vehicleColor,
    d.licensePlate,
    d.isOnline === "1" ? "Online" : "Offline",
    d.isAvailable === "1" ? "Available" : "Unavailable",
    d.lastOnline,
    d.currentLat,
    d.currentLng,
    d.createdAt,
    d.updatedAt,
    d.totalRides,
    d.completedRides,
    d.cancelledRides,
    d.averageRating,
    d.totalEarnings,
  ]),
]
  .map((row) => row.join(","))
  .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "drivers-export.csv";
    a.click();
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Drivers"
        description="Manage driver accounts and earnings"
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="24">Last 24 hours</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={filteredDrivers.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("cards")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("table")}
          >
            <TableIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "cards" ? (
      <DriverCardView isLoading={isLoading} paginatedDrivers={paginatedDrivers}/>
      ) : (
       <DriverTableView isLoading={isLoading} paginatedDrivers={filteredDrivers}/>
      )}

      {filteredDrivers.length > itemsPerPage && viewMode === "cards" && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredDrivers.length)} of{" "}
            {filteredDrivers.length} drivers
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
