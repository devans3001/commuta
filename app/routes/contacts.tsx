
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  LayoutGrid,
  Table as TableIcon,
  Download,
  Mail,
  Phone,
  User,
  Calendar,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isAfter, subHours } from "date-fns";

import { useContacts } from "@/hooks/useContacts";
import ContactsCardView from "@/components/ContactsCardView";
import ContactsTableView from "@/components/ContactsTableView";

export default function Contacts() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: contacts, isLoading, error } = useContacts();

//   console.log(contacts, "contacts");

  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredContacts = useMemo(() => {
    const now = new Date();

    let result = contacts || [];

    // Filter by selected period
    if (selectedPeriod === "24") {
      const last24h = subHours(now, 24);
      result = result.filter((contact) =>
        isAfter(new Date(contact.createdAt), last24h)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((contact) => contact.category === selectedCategory);
    }

    // Search filter
    result = result.filter(
      (contact) =>
        contact.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phoneNumber?.includes(searchQuery) ||
        contact.message?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return result;
  }, [searchQuery, selectedPeriod, selectedCategory, contacts]);

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = () => {
    const csv = [
      [
        "ID",
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Alt Phone",
        "Alt Email",
        "Category",
        "Message",
        "Created At",
      ],
      ...filteredContacts.map((contact) => [
        contact.id,
        contact.firstName,
        contact.lastName,
        contact.email,
        contact.phoneNumber,
        contact.altPhoneNumber || "",
        contact.altEmail || "",
        contact.category || "",
        contact.message,
        contact.createdAt,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts-export.csv";
    a.click();
  };

  // Extract unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    contacts?.forEach((contact) => {
      if (contact.category) {
        uniqueCategories.add(contact.category);
      }
    });
    return ["all", ...Array.from(uniqueCategories)];
  }, [contacts]);

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Contacts" 
        description="View and manage contact submissions" 
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone, or message..."
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
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="24">Last 24 hours</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handleExport}
            disabled={filteredContacts.length === 0}
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
        <ContactsCardView isLoading={isLoading} paginatedContacts={paginatedContacts} />
      ) : (
        <ContactsTableView isLoading={isLoading} paginatedContacts={filteredContacts} />
      )}

      {filteredContacts.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredContacts.length)} of{" "}
            {filteredContacts.length} contacts
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