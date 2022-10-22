const express = require('express');
const configController = require('./config'); 
const {PORT, TELEGRAM_API_TOKEN, urlHTTP, lunchShed} = configController.settings();
const moduleBot = require('./modules/moduleBot');

const app = express();

moduleBot.botStart(TELEGRAM_API_TOKEN, urlHTTP, lunchShed);

app.listen(PORT, () => {console.log(`My server is running on port ${PORT}`)})
