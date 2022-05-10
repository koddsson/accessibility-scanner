import { scan } from './scanner';
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
        console.log(error.element);
        console.log(error);
    });
    await scan(document.body);
})();
