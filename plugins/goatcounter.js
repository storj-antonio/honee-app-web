import {waitCondition} from '~/assets/utils/wait.js';
import {GOATCOUNTER_HOST, GOATCOUNTER_SCRIPT_HASH} from '~/assets/variables.js';

export default ({ app }) => {
    if (process.env.NODE_ENV !== 'production' || window.location.host !== 'my.honee.app') {
        console.debug('goatcounter disabled');
        return;
    }


    window.goatcounter = {
        endpoint: `${GOATCOUNTER_HOST}/count`,
        no_onload: true,
        no_events: true,
        allow_local: true,
    };

    let script = document.createElement('script');
    script.async = true;
    script.integrity = GOATCOUNTER_SCRIPT_HASH;
    script.crossOrigin = 'anonymous';
    script.src = `${GOATCOUNTER_HOST}/count.js`;
    document.body.appendChild(script);

    // count visit as event
    getCounter()
        .then((goatcounter) => {
            goatcounter.count({
                path: 'honee-app',
                title: 'Honee App visit',
                event: true,
            });
        });


    // count page view
    app.router.afterEach((to, from) => {
        getCounter()
            .then((goatcounter) => {
                let path = getPath();
                path = path.replace(/^\/ru/, '');
                path = path.replace(/\?.*/, '');
                path = path || '/';
                goatcounter.count({
                    path,
                    title: ' ',
                });
            });
    });
};


/**
 * @return {Promise<goatcounter>}
 */
function getCounter() {
    return waitCondition(() => !!window.goatcounter.count)
        .then(() => window.goatcounter);
}

function getPath() {
    var loc = location,
        c = document.querySelector('link[rel="canonical"][href]');
    if (c) {  // May be relative or point to different domain.
        var a = document.createElement('a');
        a.href = c.href;
        if (a.hostname.replace(/^www\./, '') === location.hostname.replace(/^www\./, ''))
            loc = a;
    }
    return (loc.pathname) || '/';
}
