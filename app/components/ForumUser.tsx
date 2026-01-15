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
import { Skeleton } from "./ui/skeleton";
import { format } from "date-fns";
import type { ForumUser } from "@/lib/type";
function ForumUserComponent({
  paginatedUsers,
  isPending,
}: {
  paginatedUsers: ForumUser[] | undefined;
  isPending: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              {/* <TableHead>IsEmailVerified</TableHead> */}
              <TableHead>Communities</TableHead>
              <TableHead>Posts</TableHead>
              <TableHead>Signup Date</TableHead>
            </TableRow>
          </TableHeader>
          
          {isPending ? (
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-5 w-10" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-5 w-40" />
                  </TableCell>

                  <TableCell className=" lg:table-cell">
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className=" lg:table-cell">
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className=" lg:table-cell">
                    <Skeleton className="h-5 w-15" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              {paginatedUsers?.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>
                    <Badge variant="outline">{user.userId}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.emailAddress}</TableCell>
                  <TableCell>
                    {" "}
                    <Badge variant={!user.isActive ? "secondary" : "default"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  {/* <TableCell>
                        <Badge variant={"default"}>
                          {user.isEmailVerified}
                        </Badge>
                      </TableCell> */}
                  <TableCell className="text-center">
                    {user.totalCommunities}
                  </TableCell>
                  <TableCell className="text-center">
                    {user.totalPosts}
                  </TableCell>
                  <TableCell>{format(user.createdAt, "dd MMM yyyy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </CardContent>
    </Card>
  );
}

export default ForumUserComponent;
