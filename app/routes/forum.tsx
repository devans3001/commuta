import { PageHeader } from "@/components/page-header";
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
import {
  Search,
  ThumbsUp,
  MessageCircle,
  Share2,
  Download,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useMemo } from "react";
import { useForumActivity, useForumUser } from "@/hooks/useForum";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import ForumUserComponent from "@/components/ForumUser";
import ForumActivityComponent from "@/components/ForumActivity";

export default function Forum() {
  const [activeTab, setActiveTab] = useState("users");

  const [searchQuery, setSearchQuery] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [postPage, setPostPage] = useState(1);
  const itemsPerPage = 20;

  const { data: forumUser, isLoading: isPending } = useForumUser();
  const { data: forumActivity, isLoading } = useForumActivity();

  const filteredUsers = useMemo(() => {
    return forumUser?.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.emailAddress.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery, forumUser]);

  const filteredPosts = useMemo(() => {
    return forumActivity?.filter((post) => {
      const matchesSearch =
        post.postTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [searchQuery, forumActivity]);

  const paginatedUsers = filteredUsers?.slice(
    (userPage - 1) * itemsPerPage,
    userPage * itemsPerPage
  );
  const paginatedPosts = filteredPosts?.slice(
    (postPage - 1) * itemsPerPage,
    postPage * itemsPerPage
  );
  const userTotalPages = Math.ceil((filteredUsers?.length ?? 0) / itemsPerPage);
  const postTotalPages = Math.ceil((filteredPosts?.length ?? 0) / itemsPerPage);

  console.log(paginatedPosts, filteredPosts, forumActivity, "forumActivity");

  const handleExport = () => {
    let headers: string[] = [];
    let rows: any[][] = [];
    let filename = "";

    if (activeTab === "users") {
      headers = [
        "User ID",
        "Name",
        "Email",
        "Phone",
        "Role",
        "Communities Joined",
        "Posts Count",
        "Signup Date",
      ];

      rows =
        filteredUsers?.map((user) => [
          user.userId,
          user.name,
          user.emailAddress,
          user.isActive,
          user.isEmailVerified,
          user.totalCommunities,
          user.totalPosts,
          user.createdAt,
        ]) ?? [];

      filename = "forum-users-export.csv";
    } else {
      headers = [
        "Post ID",
        "Community",
        "Title",
        "Author",
        "Created Date",
        "Likes",
        "Comments",
        "Shares",
      ];

      rows =
        filteredPosts?.map((post) => [
          post.id,
          post.communityName,
          post.postTitle,
          post.authorName,
          post.createdAt,
          post.likesCount,
          post.commentsCount,
        ]) ?? [];

      filename = "forum-posts-export.csv";
    }
    console.log(forumActivity, "forumActivity");

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) =>
            typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Forum Activity"
        description="Monitor community engagement and discussions"
      />

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Forum Users</TabsTrigger>
          <TabsTrigger value="posts">Posts & Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setUserPage(1);
                }}
                className="pl-10"
              />
            </div>

            <Button
              variant="outline"
              onClick={handleExport}
              disabled={
                filteredUsers?.length === 0 || filteredPosts?.length === 0
              }
              className="cursor-pointer"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <ForumUserComponent paginatedUsers={paginatedUsers} isPending={isPending}/>

          {(filteredUsers?.length ?? 0) > itemsPerPage && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(userPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(userPage * itemsPerPage, filteredUsers?.length ?? 0)}{" "}
                of {filteredUsers?.length} users
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                  disabled={userPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setUserPage((p) => Math.min(userTotalPages, p + 1))
                  }
                  disabled={userPage === userTotalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="posts" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts or authors..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPostPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>

          <ForumActivityComponent paginatedPosts={paginatedPosts} isLoading={isLoading}/>

          {(filteredPosts?.length ?? 0) > itemsPerPage && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(postPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(postPage * itemsPerPage, filteredPosts?.length ?? 0)}{" "}
                of {filteredPosts?.length ?? 0} posts
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPostPage((p) => Math.max(1, p - 1))}
                  disabled={postPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPostPage((p) => Math.min(postTotalPages, p + 1))
                  }
                  disabled={postPage === postTotalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
