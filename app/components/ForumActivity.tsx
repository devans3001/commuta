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
import { format } from "date-fns";
import { MessageCircle, ThumbsUp } from "lucide-react";
import type { ForumActivity } from "@/lib/type";
import { Skeleton } from "./ui/skeleton";

function ForumActivityComponent({
  paginatedPosts,
  isLoading,
}: {
  paginatedPosts: ForumActivity[] | undefined;
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Post ID</TableHead>
              <TableHead>Community</TableHead>
              <TableHead>Post & Author</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Engagement</TableHead>
            </TableRow>
          </TableHeader>

          {isLoading ? (
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
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              {paginatedPosts?.map((post) => (
                <TableRow
                  key={post.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell>
                    <Badge variant="outline">{post.id}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {post.communityName || "A commuinty"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="overflow-hidden">
                      <p className="font-medium truncate">{post.postTitle}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        by {post.authorName}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(post.createdAt, "dd MMM yyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        {post.likesCount}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MessageCircle className="h-3 w-3" />
                        {post.commentsCount}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </CardContent>
    </Card>
  );
}

export default ForumActivityComponent;
