interface AccessibilityError {
    text: string;
    url: string;
    element: Element;
}
declare function activeAreaElementMustHaveAlternativeText(el: HTMLElement): AccessibilityError[];
declare function scan(element: HTMLElement): Promise<void>;
declare function ready(): Promise<void>;
