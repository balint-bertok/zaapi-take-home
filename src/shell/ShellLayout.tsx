import type { ReactNode } from "react";
import { Rail } from "./Rail";
import { SectionSidebar } from "./SectionSidebar";
import type { SectionKey } from "./sections";
import { SuspendedOutlet } from "./SuspendedOutlet";

/**
 * Rail + section sidebar + the content card, mounted once per section as a layout route. The guided
 * setup passes its step list as `sidebar` in place of the section menu.
 */
export function ShellLayout({ section, sidebar = <SectionSidebar section={section} /> }: { section: SectionKey; sidebar?: ReactNode }) {
  return (
    <div className="flex bg-sidebar">
      <div className="shrink-0 w-[296px]" />
      <Rail section={section} />
      {sidebar}
      <section className="rounded-lg border border-gray-200 bg-(--content-area-background) shadow-medium grow relative overflow-hidden mr-(--content-area-margin) my-[calc(var(--content-area-margin)-2px)]">
        <SuspendedOutlet />
      </section>
    </div>
  );
}
