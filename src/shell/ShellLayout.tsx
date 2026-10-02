import { Rail } from "./Rail";
import { SectionSidebar } from "./SectionSidebar";
import type { SectionKey } from "./sections";
import { SuspendedOutlet } from "./SuspendedOutlet";

/** The content card right of the sidebar; shared with the guided setup's layout. */
export const contentCard =
  "rounded-lg border border-gray-200 bg-(--content-area-background) shadow-medium grow relative overflow-hidden mr-(--content-area-margin) my-[calc(var(--content-area-margin)-2px)]";

/** Rail + section sidebar + the content card, mounted once per section as a layout route. */
export function ShellLayout({ section }: { section: SectionKey }) {
  return (
    <div className="flex bg-sidebar">
      <div className="shrink-0 w-[296px]" />
      <Rail section={section} />
      <SectionSidebar section={section} />
      <section className={contentCard}>
        <SuspendedOutlet />
      </section>
    </div>
  );
}
