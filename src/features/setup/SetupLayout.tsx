import { Rail } from "@/shell/Rail";
import { contentCard } from "@/shell/ShellLayout";
import { SuspendedOutlet } from "@/shell/SuspendedOutlet";
import { SetupSidebar } from "./SetupSidebar";

/**
 * The guided setup's frame: the section shell (rail, 240px menu, content card) with the step list
 * in place of the AI Agent menu. The rail shows AI Agent as the current section.
 */
export function SetupLayout() {
  return (
    <div className="flex bg-sidebar">
      <div className="shrink-0 w-[296px]" />
      <Rail section="ai" />
      <SetupSidebar />
      <section className={contentCard}>
        <SuspendedOutlet />
      </section>
    </div>
  );
}
