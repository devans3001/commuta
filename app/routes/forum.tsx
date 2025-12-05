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
// Mock data for forum users
const mockForumUsers = [
  {
    id: "U001",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1-555-0101",
    role: "Rider",
    communitiesJoined: 5,
    postsCount: 24,
    signupDate: "2023-01-15",
  },
  {
    id: "U002",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "+1-555-0102",
    role: "Driver",
    communitiesJoined: 7,
    postsCount: 42,
    signupDate: "2022-11-20",
  },
  {
    id: "U003",
    name: "Emma Rodriguez",
    email: "emma.rodriguez@email.com",
    phone: "+1-555-0103",
    role: "Forum-only",
    communitiesJoined: 3,
    postsCount: 8,
    signupDate: "2024-02-10",
  },
  {
    id: "U004",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+1-555-0104",
    role: "Driver",
    communitiesJoined: 6,
    postsCount: 35,
    signupDate: "2023-03-22",
  },
  {
    id: "U005",
    name: "Lisa Park",
    email: "lisa.park@email.com",
    phone: "+1-555-0105",
    role: "Rider",
    communitiesJoined: 4,
    postsCount: 19,
    signupDate: "2023-06-18",
  },
];

// Mock data for forum posts
const mockForumPosts = [
  {
    id: "P001",
    communityName: "Riders Hub",
    title: "Best routes for peak hours",
    authorName: "Sarah Johnson",
    createdDate: "2024-01-10",
    likes: 156,
    comments: 23,
    shares: 12,
  },
  {
    id: "P002",
    communityName: "Driver's Den",
    title: "Vehicle maintenance tips",
    authorName: "Mike Chen",
    createdDate: "2024-01-09",
    likes: 243,
    comments: 45,
    shares: 34,
  },
  {
    id: "P003",
    communityName: "Tech Talk",
    title: "App update feedback",
    authorName: "Emma Rodriguez",
    createdDate: "2024-01-08",
    likes: 89,
    comments: 12,
    shares: 5,
  },
  {
    id: "P004",
    communityName: "Safety First",
    title: "Night driving safety guidelines",
    authorName: "James Wilson",
    createdDate: "2024-01-07",
    likes: 312,
    comments: 67,
    shares: 89,
  },
  {
    id: "P005",
    communityName: "City Routes",
    title: "Construction updates on Main St",
    authorName: "Lisa Park",
    createdDate: "2024-01-06",
    likes: 178,
    comments: 34,
    shares: 21,
  },
];

export default function Forum() {
  const [activeTab, setActiveTab] = useState("users");

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [communityFilter, setCommunityFilter] = useState("all");
  const [userPage, setUserPage] = useState(1);
  const [postPage, setPostPage] = useState(1);
  const itemsPerPage = 20;

  const filteredUsers = useMemo(() => {
    return mockForumUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [searchQuery, roleFilter]);

  const filteredPosts = useMemo(() => {
    return mockForumPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCommunity =
        communityFilter === "all" || post.communityName === communityFilter;
      return matchesSearch && matchesCommunity;
    });
  }, [searchQuery, communityFilter]);

  const paginatedUsers = filteredUsers.slice(
    (userPage - 1) * itemsPerPage,
    userPage * itemsPerPage
  );
  const paginatedPosts = filteredPosts.slice(
    (postPage - 1) * itemsPerPage,
    postPage * itemsPerPage
  );
  const userTotalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const postTotalPages = Math.ceil(filteredPosts.length / itemsPerPage);

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

      rows = filteredUsers.map((user) => [
        user.id,
        user.name,
        user.email,
        user.phone,
        user.role,
        user.communitiesJoined,
        user.postsCount,
        user.signupDate,
      ]);

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

      rows = filteredPosts.map((post) => [
        post.id,
        post.communityName,
        post.title,
        post.authorName,
        post.createdDate,
        post.likes,
        post.comments,
        post.shares,
      ]);

      filename = "forum-posts-export.csv";
    }

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
            <Select
              value={roleFilter}
              onValueChange={(val) => {
                setRoleFilter(val);
                setUserPage(1);
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Rider">Rider</SelectItem>
                <SelectItem value="Driver">Driver</SelectItem>
                <SelectItem value="Forum-only">Forum-only</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={
                filteredUsers.length === 0 || filteredPosts.length === 0
              }
              className="cursor-pointer"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Communities</TableHead>
                    <TableHead>Posts</TableHead>
                    <TableHead>Signup Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Badge variant="outline">{user.id}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "Forum-only" ? "secondary" : "default"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.communitiesJoined}</TableCell>
                      <TableCell className="text-center">
                        {user.postsCount}
                      </TableCell>
                      <TableCell>{user.signupDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {filteredUsers.length > itemsPerPage && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(userPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(userPage * itemsPerPage, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
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
            <Select
              value={communityFilter}
              onValueChange={(val) => {
                setCommunityFilter(val);
                setPostPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by community" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Communities</SelectItem>
                <SelectItem value="Riders Hub">Riders Hub</SelectItem>
                <SelectItem value="Driver's Den">Driver's Den</SelectItem>
                <SelectItem value="Tech Talk">Tech Talk</SelectItem>
                <SelectItem value="Safety First">Safety First</SelectItem>
                <SelectItem value="City Routes">City Routes</SelectItem>
                <SelectItem value="Night Shift">Night Shift</SelectItem>
                <SelectItem value="Weekend Warriors">
                  Weekend Warriors
                </SelectItem>
                <SelectItem value="News & Updates">News & Updates</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                <TableBody>
                  {paginatedPosts.map((post) => (
                    <TableRow
                      key={post.id}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell>
                        <Badge variant="outline">{post.id}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{post.communityName}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{post.title}</p>
                          <p className="text-sm text-muted-foreground">
                            by {post.authorName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {post.createdDate}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <ThumbsUp className="h-3 w-3" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <MessageCircle className="h-3 w-3" />
                            {post.comments}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Share2 className="h-3 w-3" />
                            {post.shares}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {filteredPosts.length > itemsPerPage && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(postPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(postPage * itemsPerPage, filteredPosts.length)} of{" "}
                {filteredPosts.length} posts
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
