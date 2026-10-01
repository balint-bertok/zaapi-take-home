import { Inert } from "@/components/Inert";
import { Button, buttonClass } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Icon } from "@/icons/Icon";
import { ShellPage } from "@/shell/ShellPage";
import { useDemo } from "@/store/store";

// Static demo values as captured (Step 8). The billing portal, plan dialogs and Stripe are never
// called: every action on this page is <Inert> (user decision 2026-10-01, uncaptured targets).
const nextRenewalDate = "08 Oct 2026";
const activeUsers = 1;
const lowBalanceWarning = 100;

const outline = buttonClass("outline", "lg");
const solid = buttonClass("default", "lg");
const card = "border border-gray-200 rounded-lg bg-white";
const row = `${card} p-4 flex items-center justify-between`;
const h3 = "text-lg font-medium text-gray-900";
const h4 = "text-base font-medium text-gray-900";
const muted = "text-sm text-gray-600";
const strong = "font-medium text-gray-900";

/** Settings > Billing: plan overview and the AI suite, markup and classes from the saved page. */
export default function BillingPage() {
  const aiTokens = useDemo((s) => s.aiTokens);
  return (
    <ShellPage breadcrumb={[{ label: "Settings" }, { label: "Billing" }]} className="space-y-10 pb-7">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-medium text-gray-900">Billing</h2>
        <p className={muted}>Manage your subscription, users, and tokens here.</p>
      </div>

      <div className="space-y-3">
        <h3 className={h3}>Plan overview</h3>
        <div className={row}>
          <div className="flex-1 space-y-1">
            <h4 className={h4}>Billing portal</h4>
            <p className={muted}>
              Manage billing details such as email address, payment method, and invoices in billing portal.
            </p>
            <p className={muted}>
              Next renewal date: <span className={strong}>{nextRenewalDate}</span>
            </p>
          </div>
          <Inert className={outline}>View billing portal</Inert>
        </div>

        <div className={`${card} p-4 flex justify-between`}>
          <div className="flex-1">
            <h4 className={`${h4} mb-2`}>Plan</h4>
            <div className="w-fit text-center font-medium bg-electric-green-50 text-gray-600 text-[12px] rounded-full px-3 py-0.5">
              Free trial
            </div>
          </div>
          <div className="flex gap-2">
            <Inert className={outline}>Compare plans</Inert>
            <Inert className={solid}>Subscribe now</Inert>
          </div>
        </div>

        <div className={row}>
          <div>
            <h4 className={h4}>Seats</h4>
            <p className={muted}>
              Number of active users: <span className={strong}>{activeUsers}</span>
            </p>
          </div>
          {/* Disabled on a free trial in the real app too. */}
          <Button variant="outline" size="lg" disabled>
            Manage seats
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon name="ai-symbol" className="ai-gradient-icon size-6!" />
          <h3 className={h3}>AI suite</h3>
        </div>
        <div className={`${card} flex flex-col`}>
          <section className="flex items-center justify-between p-4">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-2">
                <h4 className={h4}>AI tokens remaining</h4>
                <Tooltip content="AI tokens are used each time the AI agent generates a message. Every AI reply consumes one token.">
                  <span className="flex" aria-label="About AI tokens">
                    <Icon name="circle-info" variant="far" className="size-3.5! text-gray-600" />
                  </span>
                </Tooltip>
              </div>
              <p className="text-lg font-semibold text-gray-800">{aiTokens}</p>
            </div>
            <Inert className={solid}>Top up now</Inert>
          </section>
          <div role="none" className="shrink-0 bg-gray-200 h-px w-full" />
          <section className="flex items-center justify-between p-4">
            <p className={`${muted} flex-1`}>
              Low-balance warning: <span className={strong}>{lowBalanceWarning} tokens</span>
            </p>
            <Inert className={outline}>Manage auto top-up</Inert>
          </section>
        </div>
      </div>
    </ShellPage>
  );
}
