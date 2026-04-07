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
import {
  AlertTriangle,
  Eye,
  EyeOffIcon,
  Loader,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";
import type { ForumActivity } from "@/lib/type";
import { Skeleton } from "./ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

import { Button } from "./ui/button";
import { toast } from "sonner";
import { usePause, useResume } from "@/hooks/useForum";

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
              <TableHead></TableHead>
              <TableHead>Community</TableHead>
              <TableHead>Post & Author</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Actions</TableHead>
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
              {paginatedPosts?.map((post, i) => (
                <TableBodyContent key={post.id} post={post} num={i} />
              ))}
            </TableBody>
          )}
        </Table>
      </CardContent>
    </Card>
  );
}

export default ForumActivityComponent;

function TableBodyContent({
  post,
  num,
}: {
  post: ForumActivity | undefined;
  num?: number;
}) {
  const isHidden = post?.isHidden;

  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showUnsuspendModal, setShowUnsuspendModal] = useState(false);

  const { mutate: pausePost, isPending: isLoading } = usePause("posts");
  const { mutate: resumePost, isPending } = useResume("posts");

  // const id = user?.userId.slice(2);

  // console.log(typeof id,"id")
  return (
    <>
      <TableRow className="cursor-pointer hover:bg-muted/50">
        <TableCell>
          <Badge variant="outline">{num + 1}</Badge>
        </TableCell>
        <TableCell>
          <Badge variant="secondary">
            {post?.communityName || "A commuinty"}
          </Badge>
        </TableCell>
        <TableCell className="max-w-xs">
          <div className="overflow-hidden">
            <p className="font-medium truncate">{post?.postTitle}</p>
            <p className="text-sm text-muted-foreground truncate">
              by {post?.authorName}
            </p>
          </div>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {format(post?.createdAt, "dd MMM yyy")}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <ThumbsUp className="h-3 w-3" />
              {post?.likesCount}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <MessageCircle className="h-3 w-3" />
              {post?.commentsCount}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <div>
            {!isHidden ? (
              <Button
                variant="destructive"
                onClick={() => setShowSuspendModal(true)}
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <EyeOffIcon className="h-4 w-4" />
                )}
                {/* {isSuspending ? "Suspending..." : "Suspend Rider"} */}
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={() => setShowUnsuspendModal(true)}
                disabled={isLoading}
                className="gap-2"
              >
                {isPending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      {/* Suspend Confirmation Modal */}
      <AlertDialog open={showSuspendModal} onOpenChange={setShowSuspendModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will hide {post?.authorName}'s post. The post will not be
              visible to other users until it is reinstated
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                pausePost(post?.postId, {
                  onSuccess: () => toast.success("Post Hidden Successfully -"),
                })
              }
              className="bg-destructive text-background hover:bg-destructive/90"
            >
              Yes, Hide Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showUnsuspendModal}
        onOpenChange={setShowUnsuspendModal}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reinstate User?</AlertDialogTitle>
            <AlertDialogDescription>
              <div>
                Reinstate {post?.authorName}'s post? The post will be visible to
                other users once again.
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-800">
                  <p className="text-sm flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4" />
                    Ensure any issues have been resolved before reinstating.
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => (
                resumePost(post?.postId),
                {
                  onSuccess: () => toast.success("Reinstated Successfully +"),
                }
              )}
            >
              Yes, Reinstate Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
