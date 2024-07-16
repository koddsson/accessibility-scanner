export interface AccessibilityError {
  text: string;
  url: string;
  element: HTMLElement;
}

type Scannable = HTMLElement | Document;

export declare function scan(element: Scannable): Promise<void>;
