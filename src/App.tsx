import { Suspense, useEffect, type ComponentType } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import type { AppRoute } from "./lib/route";
import { routes } from "./routes";
import { AppLayout } from "./shell/AppLayout";

function Titled({ title, Page }: { title: string; Page: ComponentType }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  );
}

const element = (r: AppRoute) => <Route key={r.path} path={r.path} element={<Titled title={r.title} Page={r.Page} />} />;

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {routes.filter((r) => r.layout === "auth").map(element)}
        <Route element={<AppLayout />}>{routes.filter((r) => r.layout === "app").map(element)}</Route>
        {/* Unknown URLs (and "/") land on the login page, so nothing dead-ends in a 404. */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
