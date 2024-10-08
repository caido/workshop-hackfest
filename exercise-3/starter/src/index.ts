import type { RequestResponse } from "caido:utils";
import type { SDK } from "caido:workflow";
import { analyse } from "./analyse";
import { createFinding } from "./finding";

export async function run(
  { request, response }: RequestResponse,
  sdk: SDK,
): Promise<undefined> {
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
