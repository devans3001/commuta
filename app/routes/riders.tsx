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
import { mockRiders } from "@/lib/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isAfter, subHours } from "date-fns";

export default function Riders() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const navigate = useNavigate();

  const filteredRiders = useMemo(() => {

    const now = new Date();

  let result = mockRiders;

  // 🔥 Filter by selected period
  if (selectedPeriod === "24") {
    const last24h = subHours(now, 24);
    result = result.filter(rider =>
      isAfter(new Date(rider.signupDate), last24h)
    );
  }

   result = result.filter(
      (rider) =>
        rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.phone.includes(searchQuery)
    );

    return result;
  }, [searchQuery, selectedPeriod]);

  console.log("Filtered Riders:", filteredRiders);

  const totalPages = Math.ceil(filteredRiders?.length / itemsPerPage);
  const paginatedRiders = filteredRiders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    const csv = [
      ["Rider ID", "Name", "Email", "Phone", "Status", "Signup Date", "Total Trips", "Total Spent","Location"],
      ...filteredRiders.map((r) => [
        r.id,
        r.name,
        r.email,
        r.phone,
        r.status,
        r.signupDate,
        r.totalTrips,
        r.totalSpent,
        r.address,
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedRiders.map((rider) => (
            <Card key={rider.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{rider.name}</CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      {rider.id}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-chart-1">
                      {rider.totalTrips}
                    </p>
                    <p className="text-xs text-muted-foreground">trips</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{rider.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{rider.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Signup Date</p>
                    <p className="font-medium">{rider.signupDate}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate(`/riders/${rider.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rider ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Signup Date</TableHead>
                  <TableHead>Total Trips</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRiders.map((rider) => (
                  <TableRow key={rider.id}>
                    <TableCell>
                      <Badge variant="secondary">{rider.id}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{rider.name}</TableCell>
                    <TableCell>{rider.email}</TableCell>
                    <TableCell>{rider.phone}</TableCell>
                    <TableCell>{rider.signupDate}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary text-center">
                        {rider.totalTrips}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/riders/${rider.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
