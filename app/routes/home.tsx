import type { Route } from "./+types/home";
import { Users, UserCircle, Car, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PageHeader } from "@/components/page-header";
import { MetricCard } from "@/components/metric-card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}
// Mock data - replace with real API calls
const mockData = [
  { date: "Mon", riders: 24, drivers: 13 },
  { date: "Tue", riders: 32, drivers: 18 },
  { date: "Wed", riders: 28, drivers: 16 },
  { date: "Thu", riders: 35, drivers: 21 },
  { date: "Fri", riders: 42, drivers: 25 },
  { date: "Sat", riders: 38, drivers: 22 },
  { date: "Sun", riders: 31, drivers: 19 },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Overview" 
        description="Platform performance and key metrics"
        action={
          <Select defaultValue="7">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Riders"
          value="1,247"
          icon={Users}
          trend={{ value: 12, label: "vs last period" }}
          variant="info"
        />
        <MetricCard
          title="Total Drivers"
          value="342"
          icon={UserCircle}
          trend={{ value: 8, label: "vs last period" }}
          variant="success"
        />
        <MetricCard
          title="Total Trips"
          value="3,891"
          icon={Car}
          trend={{ value: 15, label: "vs last period" }}
          variant="accent"
        />
        <MetricCard
          title="Forum Users"
          value="892"
          icon={MessageSquare}
          trend={{ value: 5, label: "vs last period" }}
          variant="default"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sign-up Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
                <Legend />
                <Bar dataKey="riders" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Riders" />
                <Bar dataKey="drivers" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Drivers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
