import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useState, type ReactNode } from "react";
import { Inert } from "@/components/Inert";
import { Button } from "@/components/ui/button";
import { DialogOverlay } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Icon } from "@/icons/Icon";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import { updateDemo, useDemo } from "@/store/store";
import { qrPath, qrSize } from "./qr";

// Strings from the catalog's chats.onboardingModal; markup and classes from the saved tickets pages.

const staffCounts = ["1", "2-10", "11-25", "26-50", "51+"];

const channels = [
  ["Facebook", "facebook.svg"],
  ["Instagram", "instagram.svg"],
  ["LINE", "line.svg"],
  ["WhatsApp", "whatsapp.svg"],
  ["Shopee", "shopee_icon.svg"],
  ["Lazada", "lazada.svg"],
  ["TikTok Shop", "tiktok_shop_icon.svg"],
  ["Chat Widget", "chat-widget.svg"],
  ["Gmail", "gmail.svg"],
  ["Outlook", "outlook.svg"],
] as const;
const channelRows = [channels.slice(0, 4), channels.slice(4, 8), channels.slice(8)];

const finish = () => updateDemo((s) => ({ ...s, onboardingDone: true }));

/**
 * The two first-visit modals over the inbox. They cannot be dismissed by Escape or a click
 * outside, only by finishing step 2; `onboardingDone` then keeps them away until `?reset=1`.
 */
export function OnboardingModals() {
  const done = useDemo((s) => s.onboardingDone);
  const [step, setStep] = useState<1 | 2>(1);
  if (done) return null;
  return (
    <DialogPrimitive.Root open>
      <DialogPrimitive.Portal>
        <DialogOverlay />
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8">
          {step === 1 ? <DetailsStep onContinue={() => setStep(2)} /> : <TryInboxStep />}
          <p className="text-sm text-white" aria-hidden="true">
            Step {step} of 2
          </p>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function Step({
  width,
  title,
  subtitle,
  children,
}: {
  width: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <DialogPrimitive.Content
      aria-describedby={undefined}
      onEscapeKeyDown={(e) => e.preventDefault()}
      onInteractOutside={(e) => e.preventDefault()}
      className={cn("rounded-lg border bg-white shadow-lg overflow-hidden", width)}
    >
      <div className="flex flex-col items-center justify-center border-b px-6 py-4 text-center">
        <DialogPrimitive.Title className="text-base font-semibold text-gray-800">{title}</DialogPrimitive.Title>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
      {children}
    </DialogPrimitive.Content>
  );
}

const fieldLabel = "text-gray-800 font-medium text-sm mb-2 inline-block";

function DetailsStep({ onContinue }: { onContinue: () => void }) {
  const [name, setName] = useState("");
  const [staff, setStaff] = useState<string | null>(null);
  return (
    <Step width="w-[410px]" title="Tell us a bit about yourself" subtitle="This helps customize your experience">
      <div className="p-5 space-y-4">
        <div>
          <label className={fieldLabel} htmlFor="onboarding-name">
            What's your name?
          </label>
          <Input
            id="onboarding-name"
            placeholder="Enter your name"
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 h-[36px]"
          />
        </div>
        <div>
          <span className={fieldLabel} id="onboarding-staff">
            How many support agents do you have?
          </span>
          <div role="radiogroup" aria-labelledby="onboarding-staff" className="flex gap-2 mt-1">
            {staffCounts.map((count) => (
              <label
                key={count}
                className={cn(
                  "relative flex-1 cursor-pointer rounded-lg border py-2.5 text-xs text-center transition-colors has-[:focus-visible]:ring has-[:focus-visible]:ring-gray-300 has-[:focus-visible]:outline-none text-gray-800",
                  staff === count ? "border-gray-800 bg-gray-50" : "border-gray-200 bg-white hover:bg-gray-50",
                )}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="onboarding-staff"
                  value={count}
                  checked={staff === count}
                  onChange={() => setStaff(count)}
                />
                {count}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t bg-gray-50 px-6 py-3 flex justify-end">
        <Button disabled={!name.trim() || !staff} onClick={onContinue}>
          Continue
        </Button>
      </div>
    </Step>
  );
}

const column = "flex flex-col items-center text-center w-[264px] shrink-0 gap-4 py-4";

function TryInboxStep() {
  return (
    <Step width="w-[668px]" title="Try the inbox for yourself" subtitle="See a message land in Zaapi in real time">
      <div className="px-6 py-5">
        <div className="flex items-start gap-8">
          <div className={column}>
            <div className="space-y-1">
              <p className="text-base font-medium text-gray-800">Scan to send a test message</p>
              <p className="text-sm text-gray-500 whitespace-pre-line">
                {
                  "Scan the code with your phone's camera to send a test message.\nIt will appear instantly in your inbox!"
                }
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-2">
              <QrCode />
            </div>
            <Button className="px-10" onClick={finish}>
              Try the inbox
            </Button>
          </div>
          <div className="flex flex-col items-center gap-2 self-stretch py-4 shrink-0">
            <div className="w-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="w-px flex-1 bg-gray-200" />
          </div>
          <div className={column}>
            <div className="space-y-1">
              <p className="text-base font-medium text-gray-800">Connect your chats</p>
              <p className="text-sm text-gray-500">Facebook, Instagram, email, and more. All in one place.</p>
            </div>
            <div className="flex flex-col gap-6 items-center">
              {channelRows.map((row, i) => (
                <div key={i} className="flex items-center">
                  {row.map(([label, file]) => (
                    // Each opens that channel's connect flow on app.zaapi.com, which was not captured.
                    <Inert
                      key={label}
                      className="flex flex-col items-center gap-2.5 w-[65px] hover:opacity-80 transition-opacity"
                    >
                      <img alt="" className="size-8" src={asset(`images/channels/${file}`)} />
                      <span className="text-[8px] text-gray-500">{label}</span>
                    </Inert>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t bg-gray-50 p-6 flex justify-center">
        <button
          type="button"
          onClick={finish}
          className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
        >
          Do it later and explore the inbox
          <Icon name="arrow-right" variant="far" className="text-[10px]" />
        </button>
      </div>
    </Step>
  );
}

/**
 * The demo's own public URL as a QR code (see scripts/generate-qr.mjs), with the Zaapi bolt in
 * grey over a cleared centre, like the real modal. The bolt is cropped from the logo image.
 */
function QrCode() {
  const logo = 7.525; // modules, as on the saved page
  const at = (qrSize - logo) / 2;
  return (
    <svg height="118" width="118" viewBox={`0 0 ${qrSize} ${qrSize}`} role="img" aria-label="Demo QR code">
      <path fill="#FFFFFF" d={`M0,0 h${qrSize}v${qrSize}H0z`} shapeRendering="crispEdges" />
      <path fill="#000000" d={qrPath} shapeRendering="crispEdges" />
      <rect x={at - 0.5} y={at - 0.5} width={logo + 1} height={logo + 1} fill="#FFFFFF" />
      <svg
        x={at}
        y={at}
        width={logo}
        height={logo}
        viewBox="58 40 180 240"
        style={{ filter: "grayscale(1)", opacity: 0.5 }}
      >
        <image href={asset("images/logo.png")} width="684" height="323" />
      </svg>
    </svg>
  );
}
