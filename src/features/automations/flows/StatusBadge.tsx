import { cn } from "@/lib/cn";

/** The pill from the saved builder header ("Draft"); the green variant is the app's success pill. The list labels it "Active". */
export function StatusBadge({ status, label }: { status: "draft" | "published"; label?: string }) {
  return (
    <div
      className={cn(
        "w-fit py-0.5 shrink-0 rounded-2xl text-center font-medium font-inter text-[12px] px-2",
        status === "published" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500",
      )}
    >
      {label ?? (status === "published" ? "Published" : "Draft")}
    </div>
  );
}
