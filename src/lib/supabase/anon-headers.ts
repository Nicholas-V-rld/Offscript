export function anonHeaders(token: string | null): Record<string, string> {
  if (token) {
    return { "x-anon-token": token };
  }

  return {};
}
