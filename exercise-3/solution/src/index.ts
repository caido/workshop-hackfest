import type { RequestResponse } from "caido:utils";
import type { SDK } from "caido:workflow";
import { analyse } from "./analyse";
import { createFinding } from "./finding";

export async function run(
  { request, response }: RequestResponse,
  sdk: SDK,
): Promise<undefined> {
  sdk.console.log(`New request ${request.getId()}`);

  const finding = analyse(request, response);
  if (finding) {
    sdk.console.log(
      `Found reflected parameter(s) ${finding.parameters} in request {finding.id}`,
    );
    await createFinding(sdk, finding);
  }
}
