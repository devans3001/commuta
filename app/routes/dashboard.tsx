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
import { useCallback, useState } from "react";

// Mock data functions

function generateChartData(days: number) {
  const data = [];
  for (let i = 0; i < days; i++) {
    data.push({
      date: `Day ${i + 1}`,
      riders: Math.floor(Math.random() * 500) + 100,
      drivers: Math.floor(Math.random() * 300) + 50,
    });
  }
  return data;
}

import { PageHeader } from "@/components/page-header";
import { MetricCard, MetricCardSkeleton } from "@/components/metric-card";
import { useSummary } from "@/hooks/usePayout";
import { transformSignupData, type SignupTrends } from "@/lib/helper";
import { ChartSkeleton } from "@/components/chartSkeleton";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin - Overview" },
    { name: "description", content: "Welcome to Commuta overview page" },
  ];
}
export default function Overview() {
  const [selectedPeriod, setSelectedPeriod] = useState("7");

  const { data: summaryData, isLoading: isSummaryLoading } = useSummary();

  // Alternative: Generate chart data based on selected period
  const generateChartData = useCallback(
    (days: number, signupTrends?: SignupTrends) => {
      // If we have backend data, use it
      if (signupTrends) {
        const transformedData = transformSignupData(signupTrends);

        // Filter based on selected period if needed
        // You could implement logic to show last N weeks based on days parameter
        return transformedData;
      }

      // Fallback to mock data if no backend data
      const data = [];
      const today = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        data.push({
          date: date.toLocaleDateString("default", {
            month: "short",
            day: "numeric",
          }),
          week: `Week ${Math.floor(i / 7) + 1}`, // Fallback week format
          riders: Math.floor(Math.random() * 500) + 100,
          drivers: Math.floor(Math.random() * 300) + 50,
        });
      }

      return data;
    },
    []
  );

  console.log("summaryData", summaryData);

  const calculateMetrics = useCallback(
    (days: number) => {
      return {
        totalRiders: summaryData?.data.totalRiders ?? 0,
        totalDrivers: summaryData?.data.totalDrivers ?? 0,
        totalTrips: summaryData?.data.totalRides ?? 0,
        totalForumUsers: summaryData?.data.totalUsers ?? 0,
      };
    },
    [summaryData]
  );

  const metrics = calculateMetrics(Number(selectedPeriod));

  // Generate chart data
  const chartData = generateChartData(
    Number(selectedPeriod),
    summaryData?.data.signupTrends
  );
  // const chartData = generateChartData(Number(selectedPeriod));

  // Show loader if navigation state is "loading"
  //   if (navigation.state === "loading") {
  //     return <div className="text-center p-10">Loading... home</div>;
  //   }

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
        {isSummaryLoading ? (
          <>
            <MetricCardSkeleton variant="info" />
            <MetricCardSkeleton variant="success" />
            <MetricCardSkeleton variant="accent" />
            <MetricCardSkeleton variant="default" />
          </>
        ) : (
          <>
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
          </>
        )}
      </div>


<>
      {isSummaryLoading ? <ChartSkeleton/>:<Card>
        <CardHeader>
          <CardTitle>Sign-up Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="formattedWeek" // Use formatted week for display
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  allowDecimals={false}
                />

                <Tooltip
                  formatter={(value) => [`${value} signups`, ""]}
                  labelFormatter={(label) => `Week: ${label}`}
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
      </Card>}
</>

    </div>
  );
}
