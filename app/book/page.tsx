import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BookingWizard from "./BookingWizard";

const POLICY_COOKIE = "lbs_policy_accepted";

export default async function BookPage() {
  const cookieStore = await cookies();
  const hasAcceptedPolicy = cookieStore.get(POLICY_COOKIE)?.value === "1";

  if (!hasAcceptedPolicy) {
    redirect("/policy?next=/book");
  }

  return (
    <main className="min-h-screen bg-transparent text-white pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <BookingWizard />
      </div>
    </main>
  );
}