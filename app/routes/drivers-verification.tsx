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
import { Search, Eye, UserCheck } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router";
import { useDriverVerifications } from "@/hooks/useDriver";
import { RidersTableSkeleton } from "@/components/RidersTableSkeleton";

type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED" ;

interface DriverVerification {
  id: string;
  driverId: string;
  idType: string;
  status: VerificationStatus;
  rejectionReason: string | null;
  rejectedAt: string | null;
  createdAt: string;
  updatedAt: string;
  driverName: string;
  driverEmail: string;
  selfieUrl: string;
  idCardFrontUrl: string;
  idCardBackUrl: string;
}

const STATUS_CONFIG: Record<
  VerificationStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  // SUSPENDED: {
  //   label: "SUSPENDED",
  //   className: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  // },
};


export default function DriverVerifications() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | VerificationStatus>(
    "all"
  );

  const { data, isLoading } = useDriverVerifications();
  const verifications: DriverVerification[] = data?.data || [];

  const filtered = useMemo(() => {
    return verifications.filter((v) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        v.driverName.toLowerCase().includes(q) ||
        v.driverEmail.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" || v.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [verifications, searchQuery, statusFilter]);

  // Summary counts
  const counts = useMemo(() => {
    const base = { PENDING: 0, APPROVED: 0, REJECTED: 0 };
    verifications.forEach((v) => {
      base[v.status] = (base[v.status] || 0) + 1;
    });
    return base;
  }, [verifications]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Driver Verification"
        description="Review and manage driver identity submissions"
      />

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        {(
          Object.entries(STATUS_CONFIG) as [
            VerificationStatus,
            (typeof STATUS_CONFIG)[VerificationStatus]
          ][]
        ).map(([status, cfg]) => (
          <button
            key={status}
            onClick={() =>
              setStatusFilter((prev) => (prev === status ? "all" : status))
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all
              ${
                statusFilter === status
                  ? "ring-2 ring-offset-1 ring-current shadow-sm"
                  : "opacity-70 hover:opacity-100"
              }
              ${cfg.className}`}
          >
            <span>{cfg.label}</span>
            <span className="font-bold">{counts[status]}</span>
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(v) =>
            setStatusFilter(v as "all" | VerificationStatus)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            {/* <SelectItem value="SUSPENDED">SUSPENDED</SelectItem> */}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">ID Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date Submitted</TableHead>
                  <TableHead className="w-[80px]">Action</TableHead>
                </TableRow>
              </TableHeader>

              {isLoading ? (
                <TableBody>
                  <RidersTableSkeleton show={false} />
                </TableBody>
              ) : filtered.length === 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
                        <UserCheck className="h-10 w-10 opacity-30" />
                        <p className="text-sm">No driver verifications found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {filtered.map((v) => {
                    const cfg = STATUS_CONFIG[v.status] ?? {
                      label: v.status,
                      className: "bg-gray-100 text-gray-700",
                    };
                    return (
                      <TableRow key={v.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium capitalize">{v.driverName}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {v.driverEmail}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{v.idType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cfg.className}>{cfg.label}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {format(parseISO(v.createdAt), "dd MMM yyyy, HH:mm")}
                        </TableCell>
                        <TableCell className="flex justify-center">
                          <Button
                            className="cursor-pointer"
                            onClick={() => navigate(`/admin/drivers-verifications/${v.id}`)}
                          >
                            <Eye />
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

      {/* Count */}
      {!isLoading && filtered.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {filtered.length} of {verifications.length} submissions
        </p>
      )}
    </div>
  );
}