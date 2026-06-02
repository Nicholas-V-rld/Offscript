import { cookies } from "next/headers";

const ANON_TOKEN_COOKIE = "offscript_anon_token";
const ANON_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

function anonTokenCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ANON_TOKEN_MAX_AGE,
  };
}

export async function getOrCreateAnonToken(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(ANON_TOKEN_COOKIE)?.value;

  if (existing) {
    return existing;
  }

  const token = crypto.randomUUID();
  cookieStore.set(ANON_TOKEN_COOKIE, token, anonTokenCookieOptions());
  return token;
}

export async function getAnonToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ANON_TOKEN_COOKIE)?.value ?? null;
}

export async function clearAnonToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ANON_TOKEN_COOKIE);
}
