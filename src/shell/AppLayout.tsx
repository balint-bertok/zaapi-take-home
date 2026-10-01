import { Toaster } from "sonner";
import { Banner } from "./Banner";
import { SuspendedOutlet } from "./SuspendedOutlet";

/** Everything after sign-in: the trial banner on top, the page (or section layout) below. */
export function AppLayout() {
  return (
    <div className="flex flex-col w-full">
      {/* Gradient referenced by `.ai-gradient-icon path`, as in the saved pages. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <linearGradient id="ai-linear-gradient-svg" x1="1.46%" y1="0%" x2="143.22%" y2="93.88%">
          <stop stopColor="#1ed1bb" offset="0%" />
          <stop stopColor="#5e40e1" offset="100%" />
        </linearGradient>
      </svg>
      <Banner />
      <SuspendedOutlet />
      <Toaster />
    </div>
  );
}
