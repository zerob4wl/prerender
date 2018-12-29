const express = require('express');


const server = exports = module.exports = {};

server.start = async function (port = 8080, options) {
    const app = express();
    app.get('/*', (req,res) => {
        console.log(req.headers);
        res.send(req.headers);
    });


    app.listen(port, () => console.log(`Pre Render Server Run on Port: ${port}!`));

};

server.start(8003)