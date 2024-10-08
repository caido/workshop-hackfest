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

  const finding = analyse(request, response);
  if (finding) {
    sdk.console.log(
      `Found reflected parameter(s) ${finding.parameters} in request {finding.id}`,
    );
    await createFinding(sdk, finding);
  }
}

export async function init(sdk: SDK) {
  sdk.events.onInterceptResponse(processNew);
}
