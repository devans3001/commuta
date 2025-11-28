import type { Route } from "./+types/home";

import { Users, UserCircle, Car, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState } from "react";
import { calculateMetrics, generateChartData } from "@/lib/mockData";
import { PageHeader } from "@/components/page-header";
import { MetricCard } from "@/components/metric-card";
import { useNavigation } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}
export default function Overview() {
  const [selectedPeriod, setSelectedPeriod] = useState("7");
  const metrics = calculateMetrics(Number(selectedPeriod));
  const chartData = generateChartData(Number(selectedPeriod));

   const navigation = useNavigation();


 // Show loader if navigation state is "loading"
  if (navigation.state === "loading") {
    return <div className="text-center p-10">Loading... home</div>;
  }
  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="Platform performance and key metrics"
        action={
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
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
          value={metrics.totalRiders.toLocaleString()}
          icon={Users}
          trend={{ value: 12, label: "vs last period" }}
          variant="info"
        />
        <MetricCard
          title="Total Drivers"
          value={metrics.totalDrivers.toLocaleString()}
          icon={UserCircle}
          trend={{ value: 8, label: "vs last period" }}
          variant="success"
        />
        <MetricCard
          title="Total Trips"
          value={metrics.totalTrips.toLocaleString()}
          icon={Car}
          trend={{ value: 15, label: "vs last period" }}
          variant="accent"
        />
        <MetricCard
          title="Forum Users"
          value={metrics.totalForumUsers.toLocaleString()}
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
              <BarChart data={chartData}>
               <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
        <YAxis stroke="var(--muted-foreground)" fontSize={12} />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="riders"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                  name="Riders"
                />
                <Bar
                  dataKey="drivers"
                  fill="var(--chart-2)"
                  radius={[4, 4, 0, 0]}
                  name="Drivers"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
