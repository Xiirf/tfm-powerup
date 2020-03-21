const express = require('express');
const path = require('path');
const ngApp = express();
const cors = require('cors');

ngApp.use(cors({ origin: 'https://trello.com' }));
ngApp.use(express.static('./dist/tfm-powerup'));
ngApp.get('/*', function (request, response) {
    response.sendFile(path.join(__dirname, '/dist/tfm-powerup/index.html'));
});
ngApp.listen(process.env.PORT || 8080);