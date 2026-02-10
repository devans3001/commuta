import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User, Calendar, MessageSquare } from "lucide-react";
import type { Contact } from "@/lib/type";

interface ContactsCardViewProps {
  isLoading: boolean;
  paginatedContacts: Contact[];
}

export default function ContactsCardView({ isLoading, paginatedContacts }: ContactsCardViewProps) {
  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">Loading...</div>;
  }

  if (paginatedContacts.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No contacts found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {paginatedContacts.map((contact) => (
        <Card key={contact.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{contact.firstName} {contact.lastName}</span>
              </div>
              {contact.category && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {contact.category}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{contact.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{contact.phoneNumber}</span>
              {contact.altPhoneNumber && (
                <span className="text-xs text-muted-foreground">
                  (alt: {contact.altPhoneNumber})
                </span>
              )}
            </div>
            {contact.altEmail && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Alt: {contact.altEmail}</span>
              </div>
            )}
            {contact.message && (
              <div className="pt-3 border-t">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {contact.message}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
              </div>
              <span>{new Date(contact.createdAt).toLocaleTimeString()}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}