import { cookies } from "next/headers";

const PENDING_INTENT_COOKIE = "offscript_pending_intent";
const PENDING_INTENT_MAX_AGE = 60 * 60 * 24;

function pendingIntentCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PENDING_INTENT_MAX_AGE,
  };
}

export async function getPendingIntent(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(PENDING_INTENT_COOKIE)?.value ?? null;
}

export async function setPendingIntent(intentId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(PENDING_INTENT_COOKIE, intentId, pendingIntentCookieOptions());
}

export async function clearPendingIntent(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(PENDING_INTENT_COOKIE);
}
