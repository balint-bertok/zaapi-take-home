import { cn } from "@/lib/cn";
import { AiAvatar } from "./AiAvatar";
import { RadioDot } from "./parts";

// The "Add new personality" sheet's help texts and signature choice (Step 11 (2), ai.personality.*),
// shared with the setup's persona step so the one wording has one home.

/** Under "Style your AI agent to match your brand personality". */
export const StyleHelp = () => (
  <p className="text-gray-500 whitespace-pre-line">
    Describe the personality that fits your brand voice. The AI will respond in this style.{"\n\n"}
    <b>For example</b>: "You're a calm and witty tech expert who explains things like a helpful friend."
  </p>
);

/** Under "Custom guidelines for response generation". */
export const GuidelinesHelp = () => (
  <div className="text-gray-500 whitespace-pre-line">
    Set specific rules to shape how the AI replies. This helps ensure consistency with your brand's voice and customer expectations. (By default, the AI replies in the
    customer's last-used language.){"\n\n"}
    <b>For example</b>:
    <ul className="list-disc list-inside">
      <li>"Always respond in English."</li>
      <li>"Use emojis sparingly."</li>
      <li>"Avoid big paragraphs—keep answers short and digestible."</li>
    </ul>
  </div>
);

/** The signature section's own two lines, under its "Signature Settings" label. */
export function SignatureIntro() {
  return (
    <div className="space-y-1">
      <h4 className="text-gray-800 font-medium">Add a signature at the end of every AI reply</h4>
      <p className="text-gray-500">Used to clarify that a message is from an AI</p>
    </div>
  );
}

// ai.personality.signatureSettings.*; the emoji is lifted out of the gradient text as the app's
// `.emoji` rule does, or the gradient would paint through it.
const emojiStyle = { WebkitTextFillColor: "initial", color: "initial", background: "none", backgroundClip: "initial" } as const;
const exampleMsg = (
  <>
    Let me know how I can assist you further! <span style={emojiStyle}>😊</span>
  </>
);

function SignatureOption({ checked, onSelect, label, signed }: { checked: boolean; onSelect: () => void; label: string; signed?: boolean }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className={cn(
        "flex disabled:opacity-50 flex-col p-3 border rounded-lg text-left transition-all gap-2",
        checked ? "border-electric-green-500" : "border-gray-200 bg-white hover:border-gray-300",
      )}
    >
      <div className="flex items-center space-x-2">
        <RadioDot checked={checked} />
        <span className="text-sm font-medium text-gray-800">{label}</span>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg flex-1 w-full">
        <div className="flex justify-end items-end gap-2">
          <div className="bg-(image:--color-ai-gradient-light) rounded-lg p-3 text-sm">
            <span className="ai-gradient-text whitespace-pre-line">
              {exampleMsg}
              {signed && " \n\nSent by AI Agent"}
            </span>
          </div>
          <AiAvatar />
        </div>
      </div>
    </button>
  );
}

/** The two signature cards: "Custom signature" (signed example) and "No signature". */
export function SignatureOptions({ value, onChange }: { value: boolean; onChange: (signed: boolean) => void }) {
  return (
    <div role="radiogroup" aria-label="Signature Settings" className="grid grid-cols-2 gap-4">
      <SignatureOption checked={value} onSelect={() => onChange(true)} label="Custom signature" signed />
      <SignatureOption checked={!value} onSelect={() => onChange(false)} label="No signature" />
    </div>
  );
}
