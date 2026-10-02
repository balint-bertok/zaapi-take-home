import { lazy, Suspense } from "react";
import { ShellLayout } from "@/shell/ShellLayout";
import { SetupSidebar } from "./SetupSidebar";

// Its own chunk, so pages outside the setup do not load the modal's forms.
const SetupModal = lazy(() => import("./SetupModal"));

/**
 * The setup's layout route: the AI section's shell with the step list, and the setup modal mounted
 * once beside it, so moving between the modal's screens neither re-fades the overlay nor remounts
 * the page behind it.
 */
export function SetupShell() {
  return (
    <>
      <ShellLayout section="ai" sidebar={<SetupSidebar />} />
      <Suspense fallback={null}>
        <SetupModal />
      </Suspense>
    </>
  );
}
