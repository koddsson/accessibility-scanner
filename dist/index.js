"use strict";
function activeAreaElementMustHaveAlternativeText(el) {
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
async function scan(element) {
    for (const error of activeAreaElementMustHaveAlternativeText(element)) {
        document.body.dispatchEvent(new CustomEvent('accessbility-error', { detail: { error } }));
    }
}
async function ready() {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        return Promise.resolve();
    }
    else {
        return new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', () => resolve());
        });
    }
}
(async function () {
    await ready();
    document.body.addEventListener('accessbility-error', error => {
        console.log(error);
    });
    await scan(document.body);
})();
