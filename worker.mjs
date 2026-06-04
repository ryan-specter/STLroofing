const MAX_FIELD_LENGTH = 2000;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const formData = await request.formData();
  const honeypot = sanitizeText(formData.get("website"));
  if (honeypot) {
    return Response.redirect(new URL("/thanks.html", request.url), 303);
  }

  const payload = {
    source: sanitizeText(formData.get("source"), 100),
    name: sanitizeText(formData.get("name"), 120),
    email: sanitizeText(formData.get("email"), 254),
    phone: sanitizeText(formData.get("phone"), 40),
    message: sanitizeText(formData.get("message"), MAX_FIELD_LENGTH),
  };

  const validationError = validatePayload(payload);
  if (validationError) {
    return new Response(validationError, { status: 400 });
  }

  const accessToken = await getWorkspaceAccessToken(env);
  await sendWorkspaceEmail(payload, accessToken, env);

  return Response.redirect(new URL("/thanks.html", request.url), 303);
}

function sanitizeText(value, maxLen = MAX_FIELD_LENGTH) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return trimmed.slice(0, maxLen);
}

function validatePayload(payload) {
  if (!payload.name || !payload.email || !payload.message) {
    return "Name, email, and message are required.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.email)) {
    return "Please provide a valid email address.";
  }

  return null;
}

async function getWorkspaceAccessToken(env) {
  const assertion = await createJwtAssertion({
    serviceAccountEmail: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKeyPem: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    impersonatedUser: env.GOOGLE_IMPERSONATED_USER,
    scope: "https://www.googleapis.com/auth/gmail.send",
  });

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }).toString(),
  });

  if (!tokenResponse.ok) {
    const details = await tokenResponse.text();
    throw new Error(`Google token request failed: ${details}`);
  }

  const tokenJson = await tokenResponse.json();
  return tokenJson.access_token;
}

async function sendWorkspaceEmail(payload, accessToken, env) {
  const toAddress = env.CONTACT_TO_EMAIL || env.GOOGLE_IMPERSONATED_USER;
  const fromAddress = env.GOOGLE_IMPERSONATED_USER;
  const fromName = env.CONTACT_FROM_NAME || "Website Contact Form";

  const emailBody = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "N/A"}`,
    `Source: ${payload.source || "website"}`,
    "",
    payload.message,
  ].join("\n");

  const rawMessage = [
    `From: ${fromName} <${fromAddress}>`,
    `To: ${toAddress}`,
    `Reply-To: ${payload.email}`,
    `Subject: New website enquiry from ${payload.name}`,
    "Content-Type: text/plain; charset=UTF-8",
    "MIME-Version: 1.0",
    "",
    emailBody,
  ].join("\r\n");

  const gmailResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      raw: base64UrlEncode(rawMessage),
    }),
  });

  if (!gmailResponse.ok) {
    const details = await gmailResponse.text();
    throw new Error(`Gmail send failed: ${details}`);
  }
}

async function createJwtAssertion({
  serviceAccountEmail,
  privateKeyPem,
  impersonatedUser,
  scope,
}) {
  if (!serviceAccountEmail || !privateKeyPem || !impersonatedUser) {
    throw new Error("Missing required Google Workspace environment variables.");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccountEmail,
    sub: impersonatedUser,
    scope,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = await signJwt(signingInput, privateKeyPem);
  return `${signingInput}.${signature}`;
}

async function signJwt(signingInput, privateKeyPem) {
  const keyData = pemToArrayBuffer(privateKeyPem);
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    keyData,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signingInput),
  );

  return base64UrlEncode(new Uint8Array(signature));
}

function pemToArrayBuffer(pem) {
  const normalized = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");

  const binaryString = atob(normalized);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function base64UrlEncode(value) {
  const bytes =
    typeof value === "string" ? new TextEncoder().encode(value) : value;

  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
