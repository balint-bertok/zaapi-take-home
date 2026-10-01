import type { ReactNode } from "react";
import { Inert } from "@/components/Inert";
import { Icon } from "@/icons/Icon";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

/** The "EN" language switcher. English is the only language (plan decision 4), so it is inert. */
export function LanguageButton() {
  return (
    <Inert className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors bg-transparent">
      <span className="flex items-center gap-2">
        <Icon name="globe" className="text-gray-800 !size-4" />
        <span className="font-normal text-gray-800">EN</span>
      </span>
    </Inert>
  );
}

/** Login and verify-email: logo and language on top, the card, a line under it, copyright at the foot. */
export function CenteredAuthPage({
  children,
  below,
  cardClassName,
}: {
  children: ReactNode;
  below: ReactNode;
  cardClassName?: string;
}) {
  return (
    <main className="min-h-screen md:bg-gray-50">
      <div className="flex flex-col min-h-screen overflow-y-auto max-w-[1020px] mx-auto p-6">
        <div className="flex items-center w-full justify-between py-4 px-2">
          {/* On app.zaapi.com the logo links to the marketing site, which the demo does not leave for. */}
          <span className="flex items-center">
            <img src={asset("images/logo.png")} className="mr-3 h-12 sm:h-16" alt="Zaapi Logo" />
          </span>
          <LanguageButton />
        </div>
        <div className="flex-1">
          <div className="flex flex-col w-full items-center md:mt-12">
            <div
              className={cn(
                "bg-white flex flex-col w-full p-2 sm:p-10 sm:max-w-[450px] rounded-lg md:shadow-xs",
                cardClassName,
              )}
            >
              {children}
            </div>
            <div className="mt-6">{below}</div>
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-6 text-center md:text-start">© 2026 Zaapi. All rights reserved.</p>
      </div>
    </main>
  );
}
