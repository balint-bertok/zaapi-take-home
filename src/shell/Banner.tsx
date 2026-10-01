import { useMatch } from "react-router";
import { Inert } from "@/components/Inert";
import { buttonClass } from "@/components/ui/button";
import { Icon } from "@/icons/Icon";
import { useDemo } from "@/store/store";

/** Free-trial banner (common.freeTrialExpiryBanner). The billing page shows it without the button. */
export function Banner() {
  const days = useDemo((s) => s.freeTrialDaysLeft);
  const onBilling = useMatch("/settings/billing");
  return (
    <div className="max-h-(--height-banner) h-(--height-banner) border-b flex items-center z-30 overflow-auto">
      <div className="w-full px-8 flex items-center justify-center bg-white text-gray-600 h-full">
        <div className="flex items-center justify-center mr-2">
          <Icon name="circle-exclamation" className="size-4 text-gray-600" />
        </div>
        <div className="flex items-center gap-3">
          <span>
            Free trial ends in <b>{days}</b> days
          </span>
          {!onBilling && (
            <Inert className={buttonClass("subscribe", "sm")}>
              <Icon name="lock-open" variant="fal" className="size-4 text-white" />
              Subscribe now
            </Inert>
          )}
        </div>
      </div>
    </div>
  );
}
