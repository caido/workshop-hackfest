import { createHmac, createHash } from "crypto";
import { type Bytes, RequestSpec } from "caido:utils";
import type { SDK, BytesInput } from "caido:workflow";

const AWS_KEY_ID = "AKIA2MNVLX7XP5VD35UP";
const AWS_SECRET_ACCESS_KEY = "SEE THE PRESENTATION";
const AWS_REGION = "us-east-1";
const AWS_SERVICE = "s3";

function getSignatureKey(
  key: string,
  dateStamp: string,
  regionName: string,
  serviceName: string,
) {
  const kDate = createHmac("SHA256", `AWS4${key}`).update(dateStamp).digest();
  const kRegion = createHmac("SHA256", kDate).update(regionName).digest();
  const kService = createHmac("SHA256", kRegion).update(serviceName).digest();
  const kSigning = createHmac("SHA256", kService)
    .update("aws4_request")
    .digest();
  return kSigning;
}

function sign(spec: RequestSpec) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  const seconds = String(now.getUTCSeconds()).padStart(2, "0");
  const amzDate = `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  const dateStamp = amzDate.slice(0, 8);

  const method = spec.getMethod();
  const canonicalUri = spec.getPath();
  const canonicalQueryString = spec.getQuery();
  const host = spec.getHost();
  const payload = spec.getBody()?.toRaw() ?? "";
  const payloadHash = createHash("SHA256").update(payload).digest("hex");
  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");
  const hashedCanonicalRequest = createHash("sha256")
    .update(canonicalRequest)
    .digest("hex");
  const credentialScope = `${dateStamp}/${AWS_REGION}/${AWS_SERVICE}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    hashedCanonicalRequest,
  ].join("\n");

  const signingKey = getSignatureKey(
    AWS_SECRET_ACCESS_KEY,
    dateStamp,
    AWS_REGION,
    AWS_SERVICE,
  );
  const signature = createHmac("sha256", signingKey)
    .update(stringToSign)
    .digest("hex");
  const authorizationHeader = [
    `AWS4-HMAC-SHA256 Credential=${AWS_KEY_ID}/${credentialScope}`,
    `SignedHeaders=${signedHeaders}`,
    `Signature=${signature}`,
  ].join(", ");

  return {
    authorizationHeader,
    amzDate,
    payloadHash,
  };
}

export function run(input: BytesInput, sdk: SDK): Bytes {
  try {
    const spec = RequestSpec.parse(input);
    const { authorizationHeader, amzDate, payloadHash } = sign(spec);
    return `Authorization: ${authorizationHeader}\r\nx-amz-date: ${amzDate}\r\nx-amz-content-sha256: ${payloadHash}\r\n`;
  } catch {
    return input;
  }
}
