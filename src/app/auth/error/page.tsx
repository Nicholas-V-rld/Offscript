type AuthErrorPageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function AuthErrorPage({
  searchParams,
}: AuthErrorPageProps) {
  const { message } = await searchParams;

  return (
    <main>
      <p>{message ?? "An authentication error occurred."}</p>
    </main>
  );
}
