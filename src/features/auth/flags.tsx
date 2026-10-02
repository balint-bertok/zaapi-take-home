import { asset } from "@/lib/asset";

// The phone picker's pinned countries. Only Thailand's flag file was saved with the pages; the
// others are simplified drawings at the picker's 14px round size, not the app's flag images.
const drawn: Record<string, React.ReactNode> = {
  SG: (
    <>
      <rect width="20" height="10" fill="#ef3340" />
      <rect y="10" width="20" height="10" fill="#fff" />
      <circle cx="6" cy="5" r="3" fill="#fff" />
      <circle cx="7.2" cy="5" r="2.6" fill="#ef3340" />
    </>
  ),
  PH: (
    <>
      <rect width="20" height="10" fill="#0038a8" />
      <rect y="10" width="20" height="10" fill="#ce1126" />
      <path d="M0 0 L9 10 L0 20 Z" fill="#fff" />
      <circle cx="3.5" cy="10" r="1.6" fill="#fcd116" />
    </>
  ),
  MY: (
    <>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} y={i * 2.86} width="20" height="1.43" fill="#cc0001" />
      ))}
      <rect y="1.43" width="20" height="1.43" fill="#fff" />
      <rect width="10" height="10" fill="#010066" />
      <circle cx="4.5" cy="5" r="2.6" fill="#fc0" />
      <circle cx="5.4" cy="5" r="2.2" fill="#010066" />
    </>
  ),
  US: (
    <>
      <rect width="20" height="20" fill="#fff" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} y={i * 3.08} width="20" height="1.54" fill="#b22234" />
      ))}
      <rect width="10" height="10.8" fill="#3c3b6e" />
    </>
  ),
  TW: (
    <>
      <rect width="20" height="20" fill="#fe0000" />
      <rect width="10" height="10" fill="#000095" />
      <circle cx="5" cy="5" r="2.2" fill="#fff" />
    </>
  ),
  CN: (
    <>
      <rect width="20" height="20" fill="#ee1c25" />
      <path d="M5 2.5 L5.9 5.2 L8.7 5.2 L6.4 6.9 L7.3 9.6 L5 7.9 L2.7 9.6 L3.6 6.9 L1.3 5.2 L4.1 5.2 Z" fill="#ffff00" />
    </>
  ),
  HK: (
    <>
      <rect width="20" height="20" fill="#de2910" />
      <circle cx="10" cy="10" r="4" fill="#fff" />
      <circle cx="10" cy="10" r="1.2" fill="#de2910" />
    </>
  ),
  ID: (
    <>
      <rect width="20" height="10" fill="#ce1126" />
      <rect y="10" width="20" height="10" fill="#fff" />
    </>
  ),
  IN: (
    <>
      <rect width="20" height="6.67" fill="#ff9933" />
      <rect y="6.67" width="20" height="6.67" fill="#fff" />
      <rect y="13.33" width="20" height="6.67" fill="#138808" />
      <circle cx="10" cy="10" r="1.8" fill="none" stroke="#000080" strokeWidth="0.6" />
    </>
  ),
};

export function Flag({ code, name }: { code: string; name: string }) {
  if (code === "TH") return <img alt={name} className="h-4 w-4 rounded-full" width="20" src={asset("images/TH.svg")} />;
  return (
    <svg viewBox="0 0 20 20" role="img" aria-label={name} className="h-4 w-4 rounded-full">
      {drawn[code]}
    </svg>
  );
}
