// Small helpers shared by the Flow Builder list and canvas.

/** `list` with `item` added, or removed when already present. */
export const toggleIn = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

/** The h-5 w-10 switch of the Flow Builder pages (classes from the saved logs panel). */
export const smallSwitch = {
  className: "h-5 w-10",
  thumbClassName: "w-3.5 h-3.5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
};
