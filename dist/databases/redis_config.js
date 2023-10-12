"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)({ url: process.env.REDIS_LOCAL_URL });
//REDIS CONNECTION
client.on('connect', function () {
    console.log('Connected to Redis!');
});
client.on('error', function (err) {
    console.error('Redis error:' + err);
});
exports.default = client;
