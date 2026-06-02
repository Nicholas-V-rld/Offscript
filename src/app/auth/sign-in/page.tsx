import { SignInForm } from "./SignInForm";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Sign in to Offscript</h1>
          <p className="text-gray-600">
            Enter your email and we&apos;ll send you a magic link to sign in.
          </p>
        </div>

        <SignInForm />
      </div>
    </main>
  );
}
