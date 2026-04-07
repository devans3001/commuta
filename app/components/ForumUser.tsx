import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "./ui/skeleton";
import { format } from "date-fns";
import type { ForumUser } from "@/lib/type";
import { Button } from "./ui/button";
import { AlertTriangle, Loader, ShieldPlus, ShieldMinus } from "lucide-react";
import { useState } from "react";
import { useSuspend, useUnsuspend } from "@/hooks/useRider";
import { toast } from "sonner";
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
              <TableHead></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              {/* <TableHead>IsEmailVerified</TableHead> */}
              <TableHead>Communities</TableHead>
              <TableHead>Posts</TableHead>
              <TableHead>Signup Date</TableHead>
              <TableHead>Action</TableHead>
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
              {paginatedUsers?.map((user, num) => (
                <TableBodyContent key={user.userId} user={user} num={num} />
              ))}
            </TableBody>
          )}
        </Table>
      </CardContent>
    </Card>
  );
}

export default ForumUserComponent;

function TableBodyContent({
  user,
  num,
}: {
  user: ForumUser | undefined;
  num?: number;
}) {
  const isActive = user?.isActive;

  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showUnsuspendModal, setShowUnsuspendModal] = useState(false);

  const { mutate: suspend, isPending: isLoading } = useSuspend("forum-users");
  const { mutate: unSuspend, isPending } = useUnsuspend("forum-users");

  const id = user?.userId.slice(2);

  // console.log(typeof id,"id")
  return (
    <>
      <TableRow>
        <TableCell>
          <Badge variant="outline">{num + 1}</Badge>
        </TableCell>
        <TableCell className="font-medium">{user?.name}</TableCell>
        <TableCell>{user?.emailAddress}</TableCell>
        <TableCell>
          {" "}
          <Badge variant={!isActive ? "destructive" : "default"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </TableCell>

        {/* <TableCell>
                        <Badge variant={"default"}>
                          {user.isEmailVerified}
                        </Badge>
                      </TableCell> */}
        <TableCell className="text-center">{user?.totalCommunities}</TableCell>
        <TableCell className="text-center">{user?.totalPosts}</TableCell>
        <TableCell>{format(user?.createdAt, "dd MMM yyyy")}</TableCell>
        <TableCell>
          {/* Suspend/Unsuspend Button */}
          <div>
            {isActive ? (
              <Button
                variant="destructive"
                onClick={() => setShowSuspendModal(true)}
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldMinus className="h-4 w-4" />
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
                  <ShieldPlus className="h-4 w-4" />
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
              This will suspend {user?.name}'s account. The user will not be
              able login or access any features until the account is reinstated
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                suspend(Number(id), {
                  onSuccess: () => toast.success("Suspended Successfully -"),
                })
              }
              className="bg-destructive text-background hover:bg-destructive/90"
            >
              Yes, Suspend User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unsuspend Confirmation Modal */}
      <AlertDialog
        open={showUnsuspendModal}
        onOpenChange={setShowUnsuspendModal}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reinstate User?</AlertDialogTitle>
            <AlertDialogDescription>
              <div>
                This will reinstate {user?.name}'s account. This user will
                regain access to login and all features.
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
            <AlertDialogAction   onClick={() =>
                unSuspend(Number(id), {
                  onSuccess: () => toast.success("Unsuspended Successfully +"),
                })
              }>
              Yes, Reinstate User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
