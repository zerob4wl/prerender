const express = require('express');
const Browser = require('./browser');
const Storage = require('./storage');
const device = require('express-device');

const md5 = require('md5');


const server = exports = module.exports = {};

server.start = async function (port = 8080, options) {
    const app = express();
    app.use(device.capture());

    app.get('/*', getHandler);

    await Browser.init();

    app.listen(port, () => console.log(`Pre Render Server Run on Port: ${port}!`));

};

async function getHandler(req, res) {

    const url = req.params[0];
    const userAgent = req.headers['user-agent'];
    const force = !!req.headers['force'];

    let {...headers} = req.headers;
    delete headers['user-agent'];
    delete headers['cookie'];
    delete headers['url'];

    const hash = md5(url + Object.values(req.headers).join("-"));
    const localFile = await Storage.getFile(hash, url);

    if (!localFile.err && !force) {
        res.send(localFile.html);
    } else {
        if (localFile.err) {
            console.log(localFile.err);
        }
        if (force) {
            console.log(`Force to load: ${url}`)
        }
        const isMobile = (req.device.type === "phone" || req.device.type === "tablet");
        const html = await Browser.getPage(url, {userAgent, headers, isMobile});
        res.send(html);

        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        await Storage.setFile(hash, {expirationDate: tomorrow, url, html});

    }

}