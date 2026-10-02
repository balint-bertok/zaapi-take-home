import { Button } from "@/components/ui/button";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";

/**
 * Pager under every list: "No data" until the workspace has rows of its own (system rows do not
 * count), then "Showing 1-n of n"; the demo never has a second page.
 */
export function Pagination({ count, className = "mt-4" }: { count: number; className?: string }) {
  return (
    <div className={cn("flex items-center justify-end", className)}>
      <div className="text-sm text-gray-800 mr-4">
        {count === 0 ? (
          <span className="font-medium">No data</span>
        ) : (
          <>
            Showing <span className="font-medium">1-{count}</span> of <span className="font-medium">{count}</span>
          </>
        )}
      </div>
      <Button variant="outline" size="sm" className="mr-2" aria-label="Previous page" disabled>
        <Icon name="chevron-left" className="size-3 text-gray-500" />
      </Button>
      <Button variant="outline" size="sm" className="mr-2" aria-label="Next page" disabled>
        <Icon name="chevron-right" className="size-3 text-gray-500" />
      </Button>
    </div>
  );
}
