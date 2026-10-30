import PolicyAcceptance from "./PolicyAcceptance";

export const metadata = {
  title: "Booking Policy | Looks By Slim",
  description: "Review and accept the booking policy before requesting an appointment.",
};

type PolicyPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function PolicyPage({ searchParams }: PolicyPageProps) {
  const { next } = await searchParams;
  const nextPath = typeof next === "string" ? next : "/book";

  return (
    <main className="min-h-screen text-white px-6 py-24 md:py-32">
      <div className="mx-auto w-full max-w-5xl">
        <PolicyAcceptance nextPath={nextPath} />
      </div>
    </main>
  );
}
