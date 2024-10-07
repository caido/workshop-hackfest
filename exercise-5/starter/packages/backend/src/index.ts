import type { Request, Response } from "caido:utils";
import type { SDK, DefineAPI } from "caido:plugin";

import { analyse } from "./analyse";
import { createFinding } from "./finding";

async function process_existing(sdk: SDK): Promise<void> {
  sdk.console.log("Analyzing existing requests");

  let nextPage = true;
  let after = null;
  let count = 0;
  do {
    // Query page
    let query = {}; // CODE

    // @ts-ignore
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
    // CODE
  } while (nextPage);

  sdk.console.log("Finished analyzing existing requests");
}

async function process_new(
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

export type API = DefineAPI<{}>; // CODE

export async function init(sdk: SDK<API, {}>) {
  // CODE

  sdk.events.onInterceptResponse(process_new);
}