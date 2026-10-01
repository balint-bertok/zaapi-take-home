import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useEffect, type ComponentType } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import type { AppRoute } from "./lib/route";
import { routes } from "./routes";
import { AppLayout } from "./shell/AppLayout";
import { sections, type SectionKey } from "./shell/sections";
import { ShellLayout } from "./shell/ShellLayout";
import { SuspendedOutlet } from "./shell/SuspendedOutlet";

function Titled({ title, Page }: { title: string; Page: ComponentType }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return <Page />;
}

const pages = (layout: AppRoute["layout"]) =>
  routes
    .filter((r) => r.layout === layout)
    .map((r) => <Route key={r.path} path={r.path} element={<Titled title={r.title} Page={r.Page} />} />);

export function App() {
  return (
    // One provider, delay 0 as in the app's own tooltip wrapper.
    <TooltipProvider delayDuration={0}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<SuspendedOutlet />}>{pages("auth")}</Route>
          <Route element={<AppLayout />}>
            {pages("canvas")}
            {(Object.keys(sections) as SectionKey[]).map((s) => (
              <Route key={s} element={<ShellLayout section={s} />}>
                {pages(s)}
              </Route>
            ))}
          </Route>
          {/* Unknown URLs (and "/") land on the login page, so nothing dead-ends in a 404. */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}
