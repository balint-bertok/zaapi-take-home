import { Suspense } from "react";
import { Outlet } from "react-router";

/** Pages load lazily; only the part being swapped waits, the chrome around it stays. */
export function SuspendedOutlet() {
  return (
    <Suspense fallback={null}>
      <Outlet />
    </Suspense>
  );
}
