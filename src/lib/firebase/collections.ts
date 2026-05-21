export const collections = {
  users: "users",
  profiles: "profiles",
  interestModules: "interestModules",
  watchlists: "watchlists",
  briefs: "briefs",
  sourceStories: "sourceStories",
  sourceLogs: "sourceLogs",
  deliveryLogs: "deliveryLogs",
  feedback: "feedback",
  events: "events",
  plans: "plans",
  stripeEvents: "stripeEvents",
  generationJobs: "generationJobs",
  adminLogs: "adminLogs"
} as const;

export type CollectionName = (typeof collections)[keyof typeof collections];
