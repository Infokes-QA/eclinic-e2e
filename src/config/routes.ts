export const ROUTES = {
  login: "/login",

  //contoh route lainnya

  //dashboard: "/dashboard",
} as const;

export type Route = keyof typeof ROUTES;
