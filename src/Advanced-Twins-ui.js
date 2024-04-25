

import { KeyObserver, AdvancedSyllabus, KdbDisplayer } from './Advanced-Twins-core.js';
import KeyObserverUI from './ui/KeyObserverUI.js';
import KdbDisplayerUI from './ui/KdbDisplayerUI.js';

const jsonUrls = [
    'https://raw.githubusercontent.com/Make-IT-TSUKUBA/alternative-tsukuba-kdb/main/src/kdb.json',
    'https://raw.githubusercontent.com/Make-IT-TSUKUBA/alternative-tsukuba-kdb/main/src/kdb-grad.json'
];

export default async function initUI() {
    const keyObserver = new KeyObserver('body');
    await keyObserver.init();

    const advancedSyllabus = new AdvancedSyllabus(keyObserver);
    await advancedSyllabus.init();

    const kdbDisplayer = new KdbDisplayer(jsonUrls, keyObserver);
    await kdbDisplayer.init();

    new KeyObserverUI(keyObserver);
    new KdbDisplayerUI(kdbDisplayer);

    initializeEnhancer();
    observePageChanges();
}

async function initializeEnhancer() {
    const targetIframe = await waitForTargetIframe();
    if (targetIframe) {
        const iframeDocument = targetIframe.contentDocument || targetIframe.contentWindow.document;
        if (iframeDocument.readyState === 'complete') {
            const keyObserver = new KeyObserver('body');
            await keyObserver.init();

            const advancedSyllabus = new AdvancedSyllabus(keyObserver);
            await advancedSyllabus.init();

            const kdbDisplayer = new KdbDisplayer(jsonUrls, keyObserver);
            await kdbDisplayer.init();
        } else {
            setTimeout(initializeEnhancer, 100);
        }
    } else {
        console.warn('Target iframe not found, retrying in 1 second');
        setTimeout(initializeEnhancer, 1000);
    }
}

function observePageChanges() {
    const observerOptions = {
        childList: true,
        subtree: true
    };

    const observer = new MutationObserver(async (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const addedIframes = Array.from(mutation.addedNodes).filter(node => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'IFRAME');
                if (addedIframes.length > 0) {
                    console.log('New iframe(s) added:', addedIframes);
                    await initializeEnhancer();
                }
            }
        }
    });

    observer.observe(document.body, observerOptions);
}

async function waitForTargetIframe(maxRetries = 10, retryDelay = 1000) {
    let retries = 0;
    return new Promise((resolve, reject) => {
        const checkIframe = () => {
            const targetIframe = document.querySelector('iframe[src*="campussquare.do?_flowId=RSW0001000-flow"]');
            if (targetIframe) {
                resolve(targetIframe);
            } else {
                retries++;
                if (retries < maxRetries) {
                    setTimeout(checkIframe, retryDelay);
                } else {
                    resolve(null);
                }
            }
        };
        checkIframe();
    });
}