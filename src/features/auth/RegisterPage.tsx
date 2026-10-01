import * as Collapsible from "@radix-ui/react-collapsible";
import type { CSSProperties, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Inert } from "@/components/Inert";
import { Button, buttonClass } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/icons/Icon";
import { asset } from "@/lib/asset";
import { updateDemo } from "@/store/store";
import { LanguageButton } from "./AuthChrome";
import { FieldError, Label, PasswordInput, PhoneInput } from "./fields";
import "./outfit.css";

// Backgrounds from the saved page's theme (`--register-gradient`, `--register-card-gradient`).
const gradients = {
  "--register-gradient":
    "linear-gradient(89.14deg, #fafafa00 43.3%, #fafafa 49.07%), radial-gradient(35.61% 50.74% at 23.54% 66.39%, #009a87 0%, #15c0ab 55.19%, #f9fafb00 100%)",
  "--register-card-gradient": "linear-gradient(135deg, #fffc 0%, #fff0 32%)",
} as CSSProperties;

const customers = [
  ["Atelier Wen", "AtelierWen"],
  ["Blackmores", "Blackmores"],
  ["Colgate-Palmolive", "ColgatePalmolive"],
  ["Estee Lauder", "EsteeLauder"],
  ["SecretLab", "SecretLab"],
  ["Unilever", "Unilever"],
  ["Delugs", "Delugs"],
  ["Innisfree", "Innisfree"],
  ["L'Occitane", "LOccitane"],
] as const;

const stats = [
  ["10+", "Messaging Channels"],
  ["90%", "Chats Resolved with AI"],
  ["3x", "Faster Replies"],
  ["85%", "Lower Support Costs"],
] as const;

/**
 * The bot check as it looks once passed. Drawn locally: the real widget is a Cloudflare iframe,
 * and the demo makes no outbound request.
 */
function TurnstileSuccess() {
  return (
    <div className="mb-4 flex h-[65px] w-full items-center justify-between border border-[#3a3a3a] bg-[#232323] px-3 text-white">
      <div className="flex items-center gap-2.5">
        <svg viewBox="0 0 30 30" className="size-[30px]" aria-hidden="true">
          <circle cx="15" cy="15" r="15" fill="#2fb34a" />
          <path
            d="M9 15.5l4 4 8-8.5"
            fill="none"
            stroke="#fff"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-base">Success!</span>
      </div>
      <span className="self-end pb-2 text-[8px] text-[#d9d9d9]">
        <span className="underline">Privacy</span> · <span className="underline">Help</span>
      </span>
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();

  // No validation and no account: remember only the email, for the verify page to echo back.
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    updateDemo((s) => ({ ...s, registeredEmail: email }));
    navigate("/register/verify");
  }

  return (
    <main style={gradients} className="min-h-screen bg-gray-50 md:bg-(image:--register-gradient)">
      <div className="flex min-h-screen p-4 gap-0">
        <div className="flex-1 flex items-stretch">
          <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white/90 bg-(image:--register-card-gradient) px-6 py-6 md:px-12">
            <div className="w-full max-w-[436px] space-y-8">
              <img alt="Zaapi" className="h-16 w-auto" src={asset("images/logo.png")} />
              <div>
                <h1 className="font-outfit text-4xl font-[500] tracking-normal text-gray-800">
                  Start your 7-day free trial
                </h1>
                <p className="text-base text-gray-600 mt-4">The AI-native customer service platform</p>
              </div>
              <form onSubmit={submit}>
                <div className="space-y-3 mb-6">
                  <div>
                    <Label htmlFor="businessName">Business name</Label>
                    <Input
                      className="mt-2"
                      id="businessName"
                      name="businessName"
                      type="text"
                      autoComplete="organization"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input className="mt-2" id="email" name="email" type="email" autoComplete="email" />
                  </div>
                  <div className="mt-2">
                    <Label htmlFor="phoneNumber">Phone number</Label>
                    <PhoneInput id="phoneNumber" />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    {/* No name attribute: the password never joins the form data. */}
                    <PasswordInput id="password" autoComplete="new-password" />
                    <FieldError />
                  </div>
                  <Collapsible.Root>
                    <Collapsible.Trigger className="focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-gray-300 flex items-center gap-1 text-sm font-medium text-electric-green-600 hover:text-electric-green-700 transition-colors [&[data-state=open]>svg]:rotate-90">
                      Have a referral code?
                      <Icon name="angle-right" className="text-[10px] transition-transform duration-200" />
                    </Collapsible.Trigger>
                    <Collapsible.Content className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                      <Input
                        className="mt-1.5"
                        name="referralCode"
                        aria-label="Referral code"
                        placeholder="Enter your code"
                      />
                    </Collapsible.Content>
                  </Collapsible.Root>
                </div>
                <TurnstileSuccess />
                <Button type="submit" className="px-8 w-full h-12">
                  Get started
                </Button>
                <div className="flex items-center gap-6 mt-5">
                  {["7-day free trial", "No credit card required"].map((badge) => (
                    <span key={badge} className="flex items-center gap-2 text-sm text-gray-600">
                      <Icon name="check" variant="far" className="text-electric-green-600 !size-3.5 shrink-0" />
                      {badge}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-400">
                  By continuing, you agree to the <Inert className="underline">terms of service</Inert> and{" "}
                  <Inert className="underline">privacy policy</Inert>
                </p>
              </form>
            </div>
          </div>
        </div>
        <div className="flex-1 hidden md:flex items-stretch">
          <div className="flex w-full flex-col justify-between h-full px-10 py-6">
            <nav className="flex items-center justify-between">
              <LanguageButton />
              <Link className={buttonClass("outline")} to="/login">
                Log in
              </Link>
            </nav>
            <div className="flex flex-col items-center gap-24 pt-16 flex-1 justify-center">
              <h2 className="text-center font-outfit text-4xl font-light text-gray-800">
                Powering messaging for <span className="px-1 text-5xl text-electric-green-500">5,000+</span> businesses
              </h2>
              <div className="grid w-full max-w-[480px] grid-cols-3 items-center gap-x-16 gap-y-16">
                {customers.map(([name, file]) => (
                  <div key={file} className="flex aspect-[4/1] w-full items-center justify-center">
                    <img
                      alt={name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                      src={asset(`images/customers/${file}.png`)}
                    />
                  </div>
                ))}
              </div>
              <div className="hidden w-full items-start justify-center gap-x-2 gap-y-8 rounded-4xl px-4 py-10 ring-1 ring-black/[0.04] inset-shadow-[0_1px_4px_rgba(0,0,0,0.04)] md:grid md:grid-cols-2 lg:grid-cols-4 lg:gap-y-2 lg:rounded-full">
                {stats.map(([value, label]) => (
                  <div key={label} className="flex min-w-0 flex-col items-center text-center">
                    <p className="font-outfit text-5xl font-light tracking-tight text-electric-green-500">{value}</p>
                    <p className="mt-1 min-h-[2lh] text-sm leading-snug text-balance text-gray-600">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
