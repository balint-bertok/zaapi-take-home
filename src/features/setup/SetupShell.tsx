import { ShellLayout } from "@/shell/ShellLayout";
import { SetupModal } from "./SetupModal";
import { SetupSidebar } from "./SetupSidebar";

/**
 * The setup's layout route: the AI section's shell with the step list, and the setup modal mounted
 * once beside it, so moving between the modal's screens neither re-fades the overlay nor remounts
 * the page behind it.
 */
export function SetupShell() {
  return (
    <>
      <ShellLayout section="ai" sidebar={<SetupSidebar />} />
      <SetupModal />
    </>
  );
}
