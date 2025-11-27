import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("riders", "routes/riders.tsx"),
] satisfies RouteConfig;
