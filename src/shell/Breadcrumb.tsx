import { Link } from "react-router";
import { Icon } from "@/icons/Icon";

export type Crumb = { label: string; to?: string };

/** Gray trail, dark current page. Markup from the saved pages' header. */
export function Breadcrumb({ trail }: { trail: Crumb[] }) {
  const current = trail[trail.length - 1];
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center">
      {trail.slice(0, -1).map((crumb) => (
        <div key={crumb.label} className="flex shrink-0">
          {crumb.to ? (
            <Link to={crumb.to} className="truncate text-base cursor-pointer hover:text-gray-800 text-gray-400">
              {crumb.label}
            </Link>
          ) : (
            <div className="cursor-default truncate text-base text-gray-400">{crumb.label}</div>
          )}
          <div className="flex items-center mx-[12px]">
            <Icon name="chevron-right" className="text-gray-400 size-[12px]" />
          </div>
        </div>
      ))}
      <div className="flex min-w-0">
        <div aria-current="page" className="cursor-default truncate text-base text-gray-800 font-medium">
          {current.label}
        </div>
      </div>
    </nav>
  );
}
