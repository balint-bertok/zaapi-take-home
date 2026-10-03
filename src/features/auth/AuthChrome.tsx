import { Inert } from "@/components/Inert";
import { Icon } from "@/icons/Icon";

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
