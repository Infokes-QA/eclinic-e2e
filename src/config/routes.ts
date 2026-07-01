export const ROUTES = {
  login: "/login",
  home: "/home",
} as const;

export type Route = keyof typeof ROUTES;
