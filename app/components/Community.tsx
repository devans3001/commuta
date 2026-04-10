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
  Users,
  FileText,
  MoreVertical,
  Trash2,
} from "lucide-react";
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
import { useDeleteCommunity, usePause, useResume } from "@/hooks/useForum";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Community {
  communityId: string;
  communityName: string;
  communityDesc: string;
  communityThumbnail: string;
  memberCount: string;
  postCount: string;
  isActive: string;
  createdAt: string;
  updatedAt: string;
}

function Community({
  paginatedCommunities,
  isLoading,
}: {
  paginatedCommunities: Community[] | undefined;
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Community Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead>Status</TableHead>
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
                  <TableCell className="lg:table-cell">
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className="lg:table-cell">
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className="lg:table-cell">
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              {paginatedCommunities?.map((community, i) => (
                <TableBodyContent
                  key={community.communityId}
                  community={community}
                  num={i}
                />
              ))}
            </TableBody>
          )}
        </Table>
      </CardContent>
    </Card>
  );
}

export default Community;

function TableBodyContent({
  community,
  num,
}: {
  community: Community | undefined;
  num?: number;
}) {
  const isActive = community?.isActive === "1";
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { mutate: pausePost, isPending: isPausing } = usePause("communities");
  const { mutate: resumePost, isPending: isResuming } =
    useResume("communities");
  const { mutate: deleteCommunity, isPending: isDeleting } =
    useDeleteCommunity(); // You'll need to create this hook

  const isAnyActionLoading = isPausing || isResuming || isDeleting;

  return (
    <>
      <TableRow className="hover:bg-muted/50">
        <TableCell>
          <Badge variant="outline">{num! + 1}</Badge>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {community?.communityThumbnail && (
              <img
                src={community.communityThumbnail}
                alt={community.communityName}
                className="h-8 w-8 rounded-full object-cover"
              />
            )}
            <span className="font-medium">{community?.communityName}</span>
          </div>
        </TableCell>
        <TableCell className="max-w-xs">
          <p className="text-sm text-muted-foreground truncate">
            {community?.communityDesc || "No description"}
          </p>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {community?.createdAt &&
            format(new Date(community.createdAt), "dd MMM yyyy")}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3 w-3" />
              {community?.memberCount || "0"}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <FileText className="h-3 w-3" />
              {community?.postCount || "0"}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant={isActive ? "success" : "destructive"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </TableCell>
        <TableCell>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isAnyActionLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreVertical className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!isActive ? (
                <DropdownMenuItem
                  onClick={() => setShowActivateModal(true)}
                  disabled={isAnyActionLoading}
                  className="text-green-600 focus:text-green-600"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Activate
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => setShowDeactivateModal(true)}
                  disabled={isAnyActionLoading}
                  className="text-orange-600 focus:text-orange-600"
                >
                  <EyeOffIcon className="mr-2 h-4 w-4" />
                  Deactivate
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => setShowDeleteModal(true)}
                disabled={isAnyActionLoading}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* Deactivate Confirmation Modal */}
      <AlertDialog
        open={showDeactivateModal}
        onOpenChange={setShowDeactivateModal}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Community?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate the community "{community?.communityName}".
              The community will not be visible to other users until it is
              reactivated. All posts within this community will also be hidden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                pausePost(community?.communityId, {
                  onSuccess: () => {
                    toast.success("Community Deactivated Successfully");
                    setDropdownOpen(false);
                  },
                })
              }
              className="bg-orange-600 text-background hover:bg-orange-600/90"
            >
              {isPausing ? (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Yes, Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Activate Confirmation Modal */}
      <AlertDialog open={showActivateModal} onOpenChange={setShowActivateModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate Community?</AlertDialogTitle>
            <AlertDialogDescription>
              Reactivate "{community?.communityName}"? The community will be
              visible to other users once again.
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-800">
                <p className="text-sm flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  Ensure any issues have been resolved before reactivating.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resumePost(community?.communityId, {
                  onSuccess: () => {
                    toast.success("Community Activated Successfully");
                    setDropdownOpen(false);
                  },
                });
              }}
            >
              {isResuming ? (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Yes, Activate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Community?</AlertDialogTitle>
            <AlertDialogDescription>
              <div>
                Are you sure you want to permanently delete "
                {community?.communityName}"?
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-800">
                  <p className="text-sm flex items-center gap-2 text-red-700 dark:text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    This action cannot be undone. All posts and data associated
                    with this community will be permanently deleted.
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteCommunity(community?.communityId, {
                  onSuccess: () => {
                    toast.success("Community Deleted Successfully");
                    setDropdownOpen(false);
                  },
                });
              }}
              className="bg-red-600 text-background hover:bg-red-600/90"
            >
              {isDeleting ? (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Yes, Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
