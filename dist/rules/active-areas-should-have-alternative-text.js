export function activeAreaElementMustHaveAlternativeText(el) {
    const errors = [];
    for (const badEl of el.querySelectorAll('map area:not([alt])')) {
        errors.push({
            element: badEl,
            text: 'Active <area> elements must have alternate text',
            url: 'https://example.com'
        });
    }
    return errors;
}
