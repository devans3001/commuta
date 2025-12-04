import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Search,
  LayoutGrid,
  Table as TableIcon,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router";
import { mockRiders } from "@/lib/mockData";
import { PageHeader } from "@/components/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isAfter, subHours } from "date-fns";
import { useRiders } from "@/hooks/useRider";
import CardView from "@/components/CardView";
import TableView from "@/components/TableView";

export default function Riders() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const { data: riders, isLoading, error } = useRiders();

  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const filteredRiders = useMemo(() => {
    const now = new Date();

    let result = riders || [];

    // 🔥 Filter by selected period
    if (selectedPeriod === "24") {
      const last24h = subHours(now, 24);
      result = result.filter((rider) =>
        isAfter(new Date(rider.createdAt), last24h)
      );
    }

    result = result.filter(
      (rider) =>
        rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.emailAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.phoneNumber.includes(searchQuery)
    );

    return result;
  }, [searchQuery, selectedPeriod, riders]);

  const totalPages = Math.ceil(filteredRiders.length / itemsPerPage);
  const paginatedRiders = filteredRiders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log(riders, paginatedRiders, filteredRiders, "ride");

  const handleExport = () => {
    const csv = [
      [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Gender",
        "Status",
        "Phone Verified",
        "Email Verified",
        "Created At",
        "Total Rides",
        "Completed",
        "Cancelled",
        "Rating",
      ],
      ...filteredRiders.map((r) => [
        r.id,
        r.name,
        r.emailAddress,
        r.phoneNumber,
        r.gender,
        r.isActive === "1" ? "Active" : "Inactive",
        r.isPhoneVerified === "1" ? "Yes" : "No",
        r.isEmailVerified === "1" ? "Yes" : "No",
        r.createdAt,
        r.totalRides,
        r.completedRides,
        r.cancelledRides,
        r.averageRating,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "riders-export.csv";
    a.click();
  };



  return (
    <div className="space-y-8">
      <PageHeader title="Riders" description="Manage and view rider accounts" />

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
            disabled={filteredRiders.length === 0}
            className="cursor-pointer"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("cards")}
            className="cursor-pointer"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("table")}
            className="cursor-pointer"

          >
            <TableIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "cards" ? (
        <CardView isLoading={isLoading} paginatedRiders={paginatedRiders}/>
      ) : (
       <TableView isLoading={isLoading} paginatedRiders={filteredRiders}/>
      )}

      {filteredRiders.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredRiders.length)} of{" "}
            {filteredRiders.length} riders
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
