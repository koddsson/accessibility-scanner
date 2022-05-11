export interface AccessibilityError {
    text: string;
    url: string;
    element: HTMLElement;
}
export declare function scan(element: HTMLElement): Promise<void>;
