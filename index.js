require('dotenv').config();
// framework "to not invent the bicycle"
const express = require("express");
const path = require('path');
const app = express();
// importing&accept authentication middleware
const authMiddleware = require('./middleware/auth.js');
app.use(authMiddleware);
// importing&accept first fraud middleware
const fraudMiddleware = require('./middleware/fraud.js');
app.use(fraudMiddleware);
// HTTP requirements
app.use(express.json()); // to parse JSON request
app.use(express.urlencoded()); // to parse urlencoded
// app.use(express.parserBody()); // to parse urlencoded
// queue
const queue = require('./queue/queue.js');
const transactionsQueue = new queue();
// adapter for transactions
const transactions = require('./worker/transaction.js');
const transactionsAdapter = new transactions();
// append listeners to Queue
transactionsQueue.use(transactionsAdapter);
// start HTTP
app.listen(process.env.LISTEN, () => {
    console.log(`Server running on port ${process.env.LISTEN}`);
});
// info
app.get("/", (request, response, next) => {
    response.sendFile(path.join(__dirname+'/tests/index.html'));
});
// info
app.get("/info", (request, response, next) => {
    response.json({
        "name": "COPS",
        "description": "Concept of Payment System",
        "version": "0.0.1"
    });
});
// topup
app.post("/topup", (request, response, next) => {
    let req = {...request.body,type:'topup'};
    const txr = transactionsQueue.put(req);
    console.log('topup',req,txr);
    response.json(txr);
});
// withdraw
app.post("/withdraw", (request, response, next) => {
    let req = {...request.body,type:'withdraw'};
    const txr = transactionsQueue.put(req);
    console.log('topup',req,txr);
    response.json(txr);
});
// transfer
app.post("/transfer", (request, response, next) => {
    let req = {...request.body,type:'transfer'};
    const txr = transactionsQueue.put(req);
    console.log('topup',req,txr);
    response.json(txr);
});
// status
app.post("/status", (request, response, next) => {
    let req = request.body;
    const txr = req.id?transactionsQueue.get(req.id):{
        error: `Transaction not found`
    };
    response.json(txr);
});
