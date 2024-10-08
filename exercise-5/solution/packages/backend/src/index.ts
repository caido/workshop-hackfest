import type { Request, Response } from "caido:utils";
import type { SDK, DefineAPI } from "caido:plugin";

import { analyse } from "./analyse";
import { createFinding } from "./finding";

async function processExisting(sdk: SDK): Promise<void> {
  sdk.console.log("Analyzing existing requests");

  let nextPage = true;
  let after = null;
  let count = 0;
  do {
    // Query page
    let query = sdk.requests.query();
    query = query.first(100);
    if (after) {
      query = query.after(after);
    }

    let result = await query.execute();
    count += result.items.length;

    // Analyse page
    for (const { request, response } of result.items) {
      if (!response) {
        continue;
      }

      const finding = analyse(request, response);
      if (finding) {
        sdk.console.log(
          `Found reflected parameter(s) ${
            finding.parameters
          } in request ${finding.request.getId()}`,
        );
        await createFinding(sdk, finding);
      }
    }

    sdk.console.log(`Processed ${count} requests`);
    nextPage = result.pageInfo.hasNextPage;
    after = result.pageInfo.endCursor;
  } while (nextPage);

  sdk.console.log("Finished analyzing existing requests");
}

async function processNew(
  sdk: SDK,
  request: Request,
  response: Response,
): Promise<void> {
  sdk.console.log(`New request ${request.getId()}`);

  const finding = analyse(request, response);
  if (finding) {
    sdk.console.log(
      `Found reflected parameter(s) ${finding.parameters} in request {finding.id}`,
    );
    await createFinding(sdk, finding);
  }
}

export type API = DefineAPI<{
  processExisting: typeof processExisting;
}>;

export async function init(sdk: SDK<API, {}>) {
  sdk.api.register("processExisting", processExisting);

  sdk.events.onInterceptResponse(processNew);
}
