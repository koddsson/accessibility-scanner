export interface AccessibilityError {
    text: string;
    url: string;
    element: Element;
}
export declare function scan(element: HTMLElement): Promise<void>;
