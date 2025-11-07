import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "autocomplete-valid";
const text =
  "Ensure the autocomplete attribute is correct and suitable for the form field";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

// Valid autocomplete tokens based on HTML Living Standard
// https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill

const autofillFieldNames = new Set([
  "name",
  "honorific-prefix",
  "given-name",
  "additional-name",
  "family-name",
  "honorific-suffix",
  "nickname",
  "username",
  "new-password",
  "current-password",
  "one-time-code",
  "organization-title",
  "organization",
  "street-address",
  "address-line1",
  "address-line2",
  "address-line3",
  "address-level4",
  "address-level3",
  "address-level2",
  "address-level1",
  "country",
  "country-name",
  "postal-code",
  "cc-name",
  "cc-given-name",
  "cc-additional-name",
  "cc-family-name",
  "cc-number",
  "cc-exp",
  "cc-exp-month",
  "cc-exp-year",
  "cc-csc",
  "cc-type",
  "transaction-currency",
  "transaction-amount",
  "language",
  "bday",
  "bday-day",
  "bday-month",
  "bday-year",
  "sex",
  "url",
  "photo",
  "tel",
  "tel-country-code",
  "tel-national",
  "tel-area-code",
  "tel-local",
  "tel-local-prefix",
  "tel-local-suffix",
  "tel-extension",
  "email",
  "impp",
]);

const contactTokens = new Set(["home", "work", "mobile", "fax", "pager"]);

function isValidAutocomplete(value: string): boolean {
  if (!value || value.trim() === "") {
    return true; // Empty is valid (no autocomplete)
  }

  const tokens = value.toLowerCase().trim().split(/\s+/);

  // "on" or "off" by itself is valid
  if (tokens.length === 1 && (tokens[0] === "on" || tokens[0] === "off")) {
    return true;
  }

  let index = 0;

  // Optional: section-* token
  if (tokens[index]?.startsWith("section-")) {
    index++;
  }

  // Optional: shipping or billing
  if (tokens[index] === "shipping" || tokens[index] === "billing") {
    index++;
  }

  // Required: field name (must be present for autofill)
  if (index >= tokens.length || !autofillFieldNames.has(tokens[index])) {
    return false;
  }
  index++;

  // Optional: contact type (home, work, mobile, fax, pager)
  if (index < tokens.length && contactTokens.has(tokens[index])) {
    index++;
  }

  // Optional: webauthn
  if (index < tokens.length && tokens[index] === "webauthn") {
    index++;
  }

  // Should have consumed all tokens
  return index === tokens.length;
}

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Check input, select, and textarea elements
  const selector = "input, select, textarea";
  const elements = querySelectorAll(selector, element);

  if (element.matches(selector)) {
    elements.push(element);
  }

  for (const el of elements) {
    const autocompleteAttr = el.getAttribute("autocomplete");

    // Skip if no autocomplete attribute
    if (autocompleteAttr === null) {
      continue;
    }

    // Check if element is visible/applicable
    // Hidden inputs and disabled fields should still be checked according to ACT rules

    // Validate the autocomplete value
    if (!isValidAutocomplete(autocompleteAttr)) {
      errors.push({
        id,
        element: el,
        text,
        url,
      });
    }
  }

  return errors;
}
