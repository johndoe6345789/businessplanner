/** Static config for market-research sub-page cards. */
export const MARKET_RESEARCH_ROUTES = [
  {
    path: 'tam',
    titleKey: 'tam' as const,
    descKey: 'tamDesc' as const,
    testId: 'mr-card-tam',
  },
  {
    path: 'competitors',
    titleKey: 'competitors' as const,
    descKey: 'competitorsDesc' as const,
    testId: 'mr-card-competitors',
  },
  {
    path: 'canvas',
    titleKey: 'canvas' as const,
    descKey: 'canvasDesc' as const,
    testId: 'mr-card-canvas',
  },
  {
    path: 'personas',
    titleKey: 'personas' as const,
    descKey: 'personasDesc' as const,
    testId: 'mr-card-personas',
  },
  {
    path: 'discovery',
    titleKey: 'discovery' as const,
    descKey: 'discoveryDesc' as const,
    testId: 'mr-card-discovery',
  },
] as const;
