import type { SDK } from "caido:workflow";

import type { Finding } from "./analyse";

export async function createFinding(sdk: SDK, finding: Finding) {
  let description = "Found reflected parameters in reponse:\n";
  for (let [key, value] of finding.parameters) {
    description += `- ${key}: ${value}\n`;
  }

  const result = {}; // CODE: Create a finding

  // @ts-ignore
  sdk.console.log(`Finding created with ID ${result.getId()}`);
}
