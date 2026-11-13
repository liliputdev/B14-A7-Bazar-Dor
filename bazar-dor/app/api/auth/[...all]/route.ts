
import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

let handlers: ReturnType<typeof toNextJsHandler> | undefined;

function getHandlers() {
  if (!handlers) {
    handlers = toNextJsHandler(getAuth());
  }

  return handlers;
}

export const GET = (request: Request) => getHandlers().GET(request);
export const POST = (request: Request) => getHandlers().POST(request);
