import { Icon } from "@/icons/Icon";

/** The AI agent's round avatar: gradient-tinted disc with the ai-symbol mark. */
export function AiAvatar() {
  return (
    <div className="bg-(image:--color-ai-gradient-light) relative flex overflow-hidden items-center justify-center rounded-full select-none shrink-0 size-6">
      <Icon name="ai-symbol" className="ai-gradient-icon text-white size-4!" />
    </div>
  );
}
