"use client";

import { useState } from "react";

import { sendMagicLink } from "./actions";

type FormState = "idle" | "submitting" | "sent" | "error";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage("");

    const result = await sendMagicLink(email);

    if (result.ok) {
      setState("sent");
      return;
    }

    setErrorMessage(result.error);
    setState("error");
  }

  if (state === "sent") {
    return (
      <p className="text-gray-700">
        Check your email. We sent a magic link to {email}. Click the link to
        finish signing in.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {state === "error" && errorMessage ? (
        <p className="text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2"
          disabled={state === "submitting"}
        />
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {state === "submitting" ? "Sending..." : "Send magic link"}
      </button>
    </form>
  );
}
