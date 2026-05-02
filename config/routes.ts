export const ROUTES = {
  home: {
    public: "/",
    internal: "/",
  },
  wells: {
    public: "/pozos",
    internal: "/wells",
  },
  wellAnalysis: {
    public: "/analisis-pozo",
    internal: "/well-analysis",
  },
  companies: {
    public: "/empresas",
    internal: "/companies",
  },
  companiesRanking: {
    public: "/ranking-empresas",
    internal: "/companies-ranking",
  },
} as const;

export const NAV_ROUTE_KEYS = [
  "wells",
  "companies",
  "wellAnalysis",
  "companiesRanking",
] as const;

export type RouteKey = keyof typeof ROUTES;
export type NavRouteKey = (typeof NAV_ROUTE_KEYS)[number];

export const ROUTE_REWRITES = Object.values(ROUTES)
  .filter((route) => route.public !== route.internal)
  .map((route) => ({
    source: route.public,
    destination: route.internal,
  }));

export const ROUTE_REDIRECTS = Object.values(ROUTES)
  .filter((route) => route.public !== route.internal)
  .map((route) => ({
    source: route.internal,
    destination: route.public,
    permanent: true,
  }));
