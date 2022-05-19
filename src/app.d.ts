import type { AccessibilityError } from './scanner';
interface CustomEventMap {
    'accessbility-error': AccessbilityErrorEvent;
}
declare global {
    type AccessbilityErrorEvent = CustomEvent<{
        errors: AccessibilityError[];
    }>;
    interface Document {
        addEventListener<K extends keyof CustomEventMap>(type: K, listener: (this: Document, ev: CustomEventMap[K]) => void): void;
    }
}
export {};
