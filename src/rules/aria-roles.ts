// article, banner, complementary, main, navigation, region, search, contentinfo
// alert, alertdialog, application, dialog, group, log, marquee, menu, menubar, menuitem, menuitemcheckbox, menuitemradio, progressbar, separator, slider, spinbutton, status, tab, tablist, tabpanel, timer, toolbar, tooltip, tree, treegrid, treeitem
// button, button, checkbox, columnheader, combobox, contentinfo, form, grid, gridcell, heading, img, link, listbox, listitem, option, radio, radiogroup, row, rowgroup, rowheader, scrollbar, textbox
// document (when creating a document region inside an other type of region)
// application (only around a widget to enable normal keyboard shortcuts for page content)
// presentation (to cancel the native role of the element)
// math, definition, note, directory
// command, composite, input, landmark, range, section, sectionhead, select, structure, widget
import { querySelectorAll } from "../utils";
import { AccessibilityError } from "../scanner";

const text = "ARIA roles used must conform to valid values";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/aria-roles?application=RuleDescription";

const validRoles = [
  "article",
  "banner",
  "complementary",
  "main",
  "navigation",
  "region",
  "search",
  "contentinfo",
];

export default function (el: Element): AccessibilityError[] {
  const errors = [];
  for (const element of querySelectorAll("[role]", el)) {
    const role = element.getAttribute("role");
    if (role && validRoles.includes(role)) continue;
    errors.push({
      element,
      text,
      url,
    });
  }
  return errors;
}
