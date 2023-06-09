const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const {initPassport} = require("./middleware/passport");
const initRouter = require("./routes");
const initMqttConnection = require('./services/mqtt');
const initWebSockets = require('./websocket');
const ErrorHandler = require('./http-errors/error-handler');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const API_PORT = process.env.API_PORT;

initPassport(app);
initRouter(app);
initMqttConnection();
initWebSockets(app);

app.use(ErrorHandler);

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

const start = async () => {
    try {
        await mongoose.connect(MONGO_CONNECTION_STRING);
        app.listen(API_PORT, () => {
            console.log("Server is successfully running on port: " + API_PORT)
        });
    } catch (error) {
        console.log("Error occurred, server can't start");
        console.error(error);
        process.exit(1);
    }
}

start();

