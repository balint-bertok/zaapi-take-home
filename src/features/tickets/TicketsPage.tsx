import { GetStartedCard, OnboardingModals } from "../auth/onboarding";

/**
 * Placeholder until the tickets PR builds this page. Until then it shows what a first visit shows:
 * the get-started card under the onboarding modals (both owned by the auth feature).
 */
export default function TicketsPage() {
  return (
    <main className="h-(--height-page-content-with-banner)">
      <GetStartedCard />
      <OnboardingModals />
    </main>
  );
}
