import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Inert } from "@/components/Inert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { useDemo } from "@/store/store";
import { CenteredAuthPage } from "./AuthChrome";
import { FieldError, Label, PasswordInput, PhoneInput } from "./fields";

type Method = "email" | "phone";
type Errors = { id?: string; password?: string };

const tab = "text-sm p-1.5 px-3 rounded-[24px] border";
const tabs: [Method, string][] = [
  ["email", "Email"],
  ["phone", "Phone no."],
];

export default function LoginPage() {
  const registeredEmail = useDemo((s) => s.registeredEmail);
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method>("email");
  const [errors, setErrors] = useState<Errors>({});

  // The real app's required-field checks; anything filled in signs in. Values are read for
  // emptiness only and never kept: the demo has no accounts.
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const filled = (selector: string) => !!form.querySelector<HTMLInputElement>(selector)?.value.trim();
    const next: Errors = {};
    if (!filled(method === "email" ? "#loginEmail" : "#loginPhone"))
      next.id = method === "email" ? "Please enter your email" : "Please enter your phone number";
    if (!filled("#password")) next.password = "Please enter your password";
    setErrors(next);
    if (!next.id && !next.password) navigate("/tickets");
  }

  return (
    <CenteredAuthPage
      below={
        <p className="text-sm text-gray-600">
          New to Zaapi?{" "}
          <Link className="text-electric-green-600 hover:underline" to="/register">
            Create an account
          </Link>
        </p>
      }
    >
      <h1 className="text-2xl text-center text-gray-800 mb-6">Log in</h1>
      <div className="p-1.5 bg-gray-50 rounded-[24px] space-x-2 mb-4 max-w-(--max-width-content) self-center">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={method === key}
            onClick={() => {
              setMethod(key);
              setErrors({});
            }}
            className={cn(
              tab,
              method === key ? "bg-white text-gray-800 border-gray-100" : "text-gray-400 border-gray-50",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <form noValidate onSubmit={submit} className="flex flex-col space-y-4 text-start">
        <div>
          {/* Both stay mounted, the other one hidden, so switching tabs keeps what was typed. */}
          <div hidden={method !== "email"}>
            <Label htmlFor="loginEmail">Email</Label>
            <Input
              type="email"
              id="loginEmail"
              autoComplete="email"
              defaultValue={registeredEmail}
              aria-invalid={!!errors.id || undefined}
              className="mt-2"
            />
          </div>
          <div hidden={method !== "phone"}>
            <Label htmlFor="loginPhone">Phone number</Label>
            <PhoneInput id="loginPhone" aria-invalid={!!errors.id || undefined} />
          </div>
          {errors.id && <FieldError>{errors.id}</FieldError>}
        </div>
        <div>
          <div>
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              aria-invalid={!!errors.password || undefined}
            />
            {errors.password && <FieldError>{errors.password}</FieldError>}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Forgot your password? <Inert className="text-electric-green-600 hover:underline">Reset password</Inert>
          </p>
        </div>
        <Button type="submit" className="w-full mt-6!">
          Log in
        </Button>
      </form>
    </CenteredAuthPage>
  );
}
