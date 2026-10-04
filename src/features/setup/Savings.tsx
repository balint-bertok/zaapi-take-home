import { savingsLine, type Replies } from "./content";

/**
 * The savings estimate as one sentence (content.ts), on the welcome at full volume and on go live
 * following the "when" and share picks, in the share card. A paragraph, so a screen places it where it fits.
 */
export function SavingsLine({ replies, share, className }: { replies: Replies; share: number; className?: string }) {
  return (
    <p data-testid="savings" className={className}>
      {savingsLine(replies, share)}
    </p>
  );
}
