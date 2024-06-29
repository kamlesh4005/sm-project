require('dotenv').config();
const express = require("express");
const config = require("./configs/config.json");
const connectDB = require("./models/db");
const routes = require("./routes/events");
require('./logger'); // Initialize custom logger
const logger = require('./logger');
const loadMiddlewares = require("./middlewares");
const requestIdMiddleware = require("./middlewares/requestIdMiddleware");
const logRequestId = require('./middlewares/logRequestId');
const app = express();
const path = require('path');
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;

if (cluster.isMaster) {
    console.log(`Number of CPUs is ${totalCPUs}`);
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < totalCPUs; i++) {
    // for (let i = 0; i < 1; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.error(`worker ${worker.process.pid} died`);
        console.log("Let's fork another worker!");
        cluster.fork();
    });
} else {
    app.use(express.static(path.join(__dirname, 'client')));

    console.log("Loading middlewares");
    loadMiddlewares(app);
    app.use(requestIdMiddleware);
    app.use(logRequestId(logger));

    app.use("/api", routes);

    app.use((req, res, next) => {
        res.status(404).send({
            code: 404,
            message: "Not Found"
        });
    });
    console.log("Connecting to DB");
    connectDB()

    // app.get('*', (req, res) => {
    //     res.sendFile(path.join(__dirname, 'client', 'index.html'));
    // });

    app.listen(config.server.port, () => {
        console.log(`Server is running on port: ${config.server.port}`);
    });
}