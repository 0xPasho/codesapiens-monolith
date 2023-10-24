import { createTRPCRouter } from "~/server/api/trpc";
import { projectsRouter } from "./routers/projects";
import { usersRouter } from "./routers/users";
import { organizationsRouter } from "./routers/organizations";
import { billingRouter } from "./routers/billing";
import { githubRouter } from "./routers/github";
import { chatRouter } from "./routers/chat";
import { documentRouter } from "./routers/document";
import { repositoriesRouter } from "./routers/repositories";
import { processesRouter } from "./routers/processes";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  projects: projectsRouter,
  users: usersRouter,
  organizations: organizationsRouter,
  billing: billingRouter,
  github: githubRouter,
  chat: chatRouter,
  document: documentRouter,
  repositories: repositoriesRouter,
  processes: processesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
