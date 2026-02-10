import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import type { Contact } from "@/lib/type";
  
  interface ContactsTableViewProps {
    isLoading: boolean;
    paginatedContacts: Contact[];
  }
  
  export default function ContactsTableView({ isLoading, paginatedContacts }: ContactsTableViewProps) {
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (paginatedContacts.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">No contacts found</div>;
    }
  
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">
                  {contact.firstName} {contact.lastName}
                </TableCell>
                <TableCell>
                  <div>
                    <div>{contact.email}</div>
                    {contact.altEmail && (
                      <div className="text-xs text-muted-foreground">{contact.altEmail}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div>{contact.phoneNumber}</div>
                    {contact.altPhoneNumber && (
                      <div className="text-xs text-muted-foreground">{contact.altPhoneNumber}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {contact.category ? (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {contact.category}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {contact.message || "-"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(contact.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }