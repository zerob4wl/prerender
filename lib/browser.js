const puppeteer = require('puppeteer');

class Browser {
    constructor() {
        this.browser = undefined;
    }

    async init() {
        console.log(`start new instance of browser!`);
        if (this.browser === undefined) {
            this.browser = await puppeteer.launch({headless: true});
        }
        return this.browser;
    }

    async getPage(url, params) {
        console.log(`get page: ${url}`);

        const page = await this.browser.newPage();

        if (params.userAgent) page.setUserAgent(params.userAgent);
        if (params.heraders) page.setExtraHTTPHeaders(params.heraders);
        try {
            await page.goto(url, {waitUntil: 'networkidle0'});
        } catch (e) {
            console.log(e)
        }
        const html = await page.content(); // serialized HTML of page DOM.
        page.close();
        return html;
    }

}

exports = module.exports = new Browser();
