import type { Request, Response } from "caido:utils";
import type { SDK } from "caido:plugin";

import { analyse } from "./analyse";
import { createFinding } from "./finding";

async function processNew(
  sdk: SDK,
  request: Request,
  response: Response,
): Promise<void> {
  sdk.console.log(`New request ${request.getId()}`);

  const finding = null; // CODE: Call the analyse function
  if (finding) {
    sdk.console.log(
      `Found reflected parameter(s) ${
        /*finding.parameters*/ null
      } in request {finding.id}`,
    );
    // CODE: Call create finding function
  }
}

export async function init(sdk: SDK) {
  // CODE: Register the processNew function to the onInterceptResponse event
}
