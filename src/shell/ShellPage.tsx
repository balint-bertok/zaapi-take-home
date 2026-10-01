import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "./Breadcrumb";
import { Rail } from "./Rail";
import { SectionSidebar } from "./SectionSidebar";
import type { SectionKey } from "./sections";

type Props = {
  section: SectionKey;
  /** Header trail, last entry is the current page. Omit for pages with their own header (Tickets). */
  breadcrumb?: Crumb[];
  children?: ReactNode;
};

/**
 * Rail + section sidebar + the white content card, as on every captured dashboard page.
 * With `breadcrumb`, children go into the standard scrolling page container under a 70px header;
 * without it, children fill the card as they are.
 */
export function ShellPage({ section, breadcrumb, children }: Props) {
  return (
    <div className="flex bg-sidebar">
      <div className="shrink-0 w-[296px]" />
      <Rail />
      <SectionSidebar section={section} />
      <section className="rounded-lg border border-gray-200 bg-(--content-area-background) shadow-medium grow relative overflow-hidden mr-(--content-area-margin) my-[calc(var(--content-area-margin)-2px)]">
        {breadcrumb ? (
          <>
            <header className="absolute top-0 left-0 right-(--scrollbar-reserve) z-20 h-(--height-auth-header) rounded-tl-lg bg-white backdrop-blur-sm pl-10 pr-[calc(--spacing(10)-var(--scrollbar-reserve))]">
              <div className="mx-auto flex h-full w-full min-w-(--min-width-content) max-w-(--max-width-content) items-center justify-start gap-4">
                <Breadcrumb trail={breadcrumb} />
              </div>
            </header>
            <div className="bg-(--content-area-background) px-10 overflow-auto overscroll-x-none h-(--height-page-content-with-banner) pt-(--auth-header-height)">
              <main className="mx-auto min-w-(--min-width-content) max-w-(--max-width-content) mb-8">
                <div className="mt-3">{children}</div>
              </main>
            </div>
          </>
        ) : (
          <main className="h-(--height-page-content-with-banner)">{children}</main>
        )}
      </section>
    </div>
  );
}
