import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("riders", "routes/riders.tsx"),
  route("riders/:id", "routes/riders-details.tsx"),
  route("drivers", "routes/drivers.tsx"),
  route("drivers/:id", "routes/drivers-details.tsx"),
  route("trips", "routes/trips.tsx"),
  route("forum", "routes/forum.tsx"),
  route("payouts", "routes/payouts.tsx"),
] satisfies RouteConfig;
