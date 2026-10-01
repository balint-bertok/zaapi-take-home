import { useSyncExternalStore } from "react";
import { seed, type DemoState } from "./fixtures";

// The whole demo state lives in this module and in one localStorage key. Nothing leaves the browser.
// Bump the key's version when a fixture changes shape incompatibly; old saved state is then ignored.
const STORAGE_KEY = "zaapi-demo-state-v1";

function load(): DemoState {
  try {
    // `?reset=1` on page load puts the demo back to its fixtures; the parameter is then dropped from
    // the URL so a reload does not wipe the state again.
    const url = new URL(location.href);
    if (url.searchParams.get("reset") === "1") {
      localStorage.removeItem(STORAGE_KEY);
      url.searchParams.delete("reset");
      history.replaceState(history.state, "", url);
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    // Spread over the seed so a slice added by a later PR gets its seed value in older saved state.
    return saved ? { ...seed, ...(JSON.parse(saved) as Partial<DemoState>) } : seed;
  } catch {
    return seed;
  }
}

let state: DemoState = load();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Replace the state with `update(current)` and persist it. `update` must not mutate its argument. */
export function updateDemo(update: (current: DemoState) => DemoState) {
  state = update(state);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked (private mode): the demo keeps working in memory.
  }
  listeners.forEach((l) => l());
}

/** Read a slice of the state. The selector must return a stored reference, not build a new object. */
export function useDemo<T>(select: (s: DemoState) => T): T {
  return useSyncExternalStore(subscribe, () => select(state));
}
