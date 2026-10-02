import { cn } from "@/lib/cn";

/**
 * A team member without a photo: the initial on gray-500 with the "you" ring, as app.zaapi.com
 * draws it in the inbox, lists and dialogs. The letter keeps the text size of where it sits.
 */
export function InitialAvatar({ name, size = 16, text = "font-medium text-sm" }: { name: string; size?: number; text?: string }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-full select-none shrink-0"
      style={{ width: size, height: size, backgroundColor: "#667085" }}
    >
      <div className="absolute rounded-full border bg-transparent" style={{ borderColor: "#667085", width: size, height: size }}>
        <span className={cn(text, "text-white absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2")}>
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
    </div>
  );
}

/** The list tables' "Created by" / "Updated by" cell: avatar and name. */
export function Person({ name }: { name: string }) {
  return (
    <span className="flex gap-x-2.5 items-center">
      <InitialAvatar name={name} size={24} text="text-[12px]" />
      <span className="text-sm text-gray-800">{name}</span>
    </span>
  );
}
