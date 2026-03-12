import type { AccessibilityError } from "./scanner";
interface CustomEventMap {
  // TODO: Fix spelling of "accessbility-error" to "accessibility-error" in next major version (breaking change)
  "accessbility-error": AccessbilityErrorEvent;
}
declare global {
  // TODO: Fix spelling of "AccessbilityErrorEvent" to "AccessibilityErrorEvent" in next major version (breaking change)
  type AccessbilityErrorEvent = CustomEvent<{
    errors: AccessibilityError[];
  }>;
  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void,
    ): void;
  }
}
export {};
