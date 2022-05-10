import { activeAreaElementMustHaveAlternativeText } from './area-alt';
const rules = [
    activeAreaElementMustHaveAlternativeText
];
export async function scan(element) {
    for (const rule of rules) {
        for (const error of rule(element)) {
            document.body.dispatchEvent(new CustomEvent('accessbility-error', { detail: { error } }));
        }
    }
}
