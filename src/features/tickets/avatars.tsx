import { asset } from "@/lib/asset";

/**
 * Contact avatar as in the saved inbox: placeholder photo, the chat account's logo top-left and the
 * channel badge bottom-right. `size` is 48 in the list and 36 in the header and linked rows.
 */
export function ContactAvatar({ size }: { size: 36 | 48 }) {
  const b = size === 48 ? 20 : 16;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <img
        alt="chat account"
        src={asset("images/default-chat-account.png")}
        className="absolute left-0 top-0 size-4 rounded-full object-cover"
      />
      <img alt="avatar" src={asset("images/avatar_placeholder.jpeg")} className="h-full w-full rounded-full object-cover" />
      <div
        className="absolute rounded-full overflow-hidden bg-white border border-white bottom-0 -right-0.5"
        style={{ width: b, height: b }}
      >
        <img alt="widget icon" src={asset("images/channels/chat-widget.svg")} className="absolute inset-0 h-full w-full" />
      </div>
    </div>
  );
}

/** Team member initial on gray-500, as in the sidebar's "My Inbox" entry and assignee chips. */
export function UserAvatar({ name, size = 16 }: { name: string; size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-full select-none shrink-0 bg-gray-500"
      style={{ width: size, height: size }}
    >
      <span
        className="font-medium text-white leading-none"
        style={{ fontSize: Math.round(size * 0.62) }}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
