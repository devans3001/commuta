import { type RouteConfig, route, layout, index } from "@react-router/dev/routes";

export default [
  // "/" → redirect to login
  index("routes/home.tsx"),

  // Login page without layout
  route("login", "routes/login.tsx"),

  // Dashboard layout for all admin pages
  layout("routes/layout.tsx", [
    route("admin/dashboard", "routes/dashboard.tsx"),
    route("admin/riders", "routes/riders.tsx"),
    route("admin/riders/:id", "routes/riders-details.tsx"),
    route("admin/drivers", "routes/drivers.tsx"),
    route("admin/drivers/:id", "routes/drivers-details.tsx"),
    route("admin/trips", "routes/trips.tsx"),
    route("admin/forum", "routes/forum.tsx"),
    route("admin/payouts", "routes/payouts.tsx"),
  ]),
] satisfies RouteConfig;
