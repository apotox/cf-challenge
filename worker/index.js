import { appRouter } from "./lib/app"

addEventListener("fetch", async event => {

  event.respondWith(appRouter.handle(event.request))
})

