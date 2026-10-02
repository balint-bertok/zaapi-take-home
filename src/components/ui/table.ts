// Data-table row classes from the live lists: a grey row hover unless a control inside the row is
// the thing hovered, and the same tint on keyboard focus.
export const tableRow =
  "border-b transition-colors cursor-pointer outline-none [&:focus-visible>td]:bg-gray-50! [&:hover:not(:has(:is(a,button,input,select,textarea,label,[role=button],[role=checkbox],[role=switch],[role=combobox]):hover))>td]:bg-gray-50!";
