import { Icon } from "@/icons/Icon";
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
        className="absolute left-0 top-0 size-[16px] rounded-full object-cover"
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

export { InitialAvatar as UserAvatar } from "@/components/Person";

/** The grey "nobody" circle of the unassigned chip and the assign dialog. */
export function UnassignedAvatar({ size = 16 }: { size?: number }) {
  return (
    <span
      className="relative flex items-center justify-center rounded-full border border-gray-300 bg-gray-100 shrink-0"
      style={{ width: size, height: size }}
    >
      <Icon name="user" variant="fas" className={size > 16 ? "text-gray-400 size-3.5!" : "text-gray-400 size-2.5!"} />
    </span>
  );
}
