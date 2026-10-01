import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import { Inert } from "@/components/Inert";
import { Icon } from "@/icons/Icon";
import { useDemo } from "@/store/store";
import { CenteredAuthPage } from "./AuthChrome";

// Shown when the register form was submitted with an empty email (no validation in the demo).
const fallbackEmail = "user@brand-one.example";

// Where the link in the verification email lands on app.zaapi.com (Step 4's address bar).
const verifiedUrl = "/login?supportSignUp=true&supportForgotPassword=true&code=success";

export default function VerifyEmailPage() {
  const email = useDemo((s) => s.registeredEmail) || fallbackEmail;
  const navigate = useNavigate();

  // Demo-only departure (user decision 2026-10-01: no mailbox page). The real app waits here until
  // the user clicks the link in the email; the demo plays that click itself after a short pause.
  useEffect(() => {
    const timer = setTimeout(() => navigate(verifiedUrl, { replace: true }), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <CenteredAuthPage
      cardClassName="items-center"
      below={
        <p className="text-gray-500 text-sm mt-7 mb-16">
          Need help? <Inert className="underline text-electric-green-600">Contact us</Inert>
        </p>
      }
    >
      <div className="flex justify-center my-6">
        <Icon name="paper-plane" variant="fal" className="size-12! text-gray-200" />
      </div>
      <h1 className="text-gray-800 text-2xl mb-4">Please verify your email</h1>
      <p className="text-gray-600 mb-1">We’ve sent an email verification link to your email:</p>
      <div className="text-electric-green-600 cursor-default">{email}</div>
      <p className="text-gray-600 text-sm my-8">If the email does not show up soon, check your spam folder.</p>
      <div className="p-3.5 rounded-md text-sm border-l-4 bg-gray-100 border-gray-600 text-center w-full" role="alert">
        <div className="flex flex-row gap-2 justify-center items-center">
          <div className="mt-1">
            <Icon name="circle-info" className="size-3.5! text-gray-600" />
          </div>
          <div className="text-gray-500">
            Didn’t get an email?
            <button
              type="button"
              className="ml-2 text-electric-green-600"
              onClick={() => toast.success("Email resent")}
            >
              Click to resend
            </button>
          </div>
        </div>
      </div>
      {/* Auth pages sit outside the app shell, which carries the other Toaster. */}
      <Toaster />
    </CenteredAuthPage>
  );
}
