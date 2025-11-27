import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, LayoutGrid, Table as TableIcon, Download, Eye } from "lucide-react";
import { useNavigate } from "react-router";
import { PageHeader } from "@/components/page-header";

// Mock data
const mockRiders = [
  { id: "R001", name: "John Doe", email: "john@example.com", phone: "+234 801 234 5678", signupDate: "2024-01-15", totalTrips: 45 },
  { id: "R002", name: "Jane Smith", email: "jane@example.com", phone: "+234 802 345 6789", signupDate: "2024-01-20", totalTrips: 32 },
  { id: "R003", name: "Mike Johnson", email: "mike@example.com", phone: "+234 803 456 7890", signupDate: "2024-02-01", totalTrips: 28 },
  { id: "R004", name: "Sarah Williams", email: "sarah@example.com", phone: "+234 804 567 8901", signupDate: "2024-02-10", totalTrips: 51 },
];

export default function Riders() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredRiders = mockRiders.filter(
    (rider) =>
      rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Riders" 
        description="Manage and view rider accounts"
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setViewMode("cards")}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setViewMode("table")}>
            <TableIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {viewMode === "cards" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRiders.map((rider) => (
            <Card key={rider.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{rider.name}</CardTitle>
                    <Badge variant="secondary" className="mt-2">{rider.id}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-chart-1">{rider.totalTrips}</p>
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
                {filteredRiders.map((rider) => (
                  <TableRow key={rider.id}>
                    <TableCell><Badge variant="secondary">{rider.id}</Badge></TableCell>
                    <TableCell className="font-medium">{rider.name}</TableCell>
                    <TableCell>{rider.email}</TableCell>
                    <TableCell>{rider.phone}</TableCell>
                    <TableCell>{rider.signupDate}</TableCell>
                    <TableCell><span className="font-semibold text-accent">{rider.totalTrips}</span></TableCell>
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
    </div>
  );
}
